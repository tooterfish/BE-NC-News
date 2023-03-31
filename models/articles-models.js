const db = require('../db/connection')
const { qs } = require('../app-utils')

exports.fetchArticles = (topic, sortBy, order, limit = 10, page = 1) => {
  const offset = (page - 1) * limit
  let topicQuery = ''
  if (topic) {
    if (qs.allowedArticleTopics.has(topic)) topicQuery = `WHERE topic = '${topic}'`
    else return Promise.reject({ status: 404, msg: 'topic not found' })
  }
    
  if(sortBy && !qs.allowedArticleSorts.has(sortBy)) return Promise.reject({ status: 400, msg: 'invalid query: sort_by' })
  if(!sortBy) sortBy = 'created_at'
  
  if(order && !qs.allowedOrders.has(order)) return Promise.reject({ status: 400, msg: 'invalid query: order' })
  if (!order) order = 'DESC'
  
  const sortQuery = `${sortBy} ${order}`
  
  const queryStr = `
  SELECT COUNT(articles.*) OVER()::int AS total_count, articles.*, COUNT(comment_id)::int AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  ${topicQuery}
  GROUP BY articles.article_id
  ORDER BY ${sortQuery}
  LIMIT $1 OFFSET $2
  `
  return db.query(queryStr, [ limit, offset ]).then((result) => {
    return result.rows
  })
}

exports.createArticle = (author, title, body, topic, article_img_url) => {
  const queryParams = [author, title, body, topic]
  // check that needed parameters exist
  for(const param of queryParams) {
    if (!param) return Promise.reject({ status: 400, msg: 'invalid body properties' })
  }
  
  // check topic exists
  if (!qs.allowedArticleTopics.has(topic)) return Promise.reject({ status: 404, msg: 'topic not found' })
  
  // modify query depending on existence of article_img_url
  let a = ')'
  let b = ')'
  if (article_img_url) {
    a = ', article_img_url)'
    b = ', $5)'
    queryParams.push(article_img_url)
  }
  const queryStr = `
  WITH
  inserted AS (
    INSERT INTO articles
    (author, title, body, topic${a}
    VALUES
    ($1, $2, $3, $4${b}
    RETURNING *
  )
  SELECT inserted.*, COUNT(comment_id)::int AS comment_count FROM inserted
  LEFT JOIN comments ON comments.article_id = inserted.article_id
  GROUP BY inserted.article_id, inserted.title, inserted.topic, inserted.author,
  inserted.body, inserted.created_at, inserted.votes, inserted.article_img_url
  ` //<<< must be a better way to do this?
  return db.query(queryStr, queryParams)
  .then((result) => {
    return result.rows[0]
  })
}

exports.fetchArticle = (articleId) => {
  const queryStr = `
  SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  `
  return db.query(queryStr, [articleId])

  .then((result) => {
    if (result.rows[0]) return result.rows[0]
    else return Promise.reject({ status:404, msg: 'article not found' })
  }
)}

exports.fetchCommentsByArticle = (articleId, limit = 10, page = 1) => {
  let offset = (page - 1) * limit
  const commentQueryStr = `
  SELECT comments.* FROM comments
  JOIN articles ON comments.article_id = articles.article_id
  WHERE comments.article_id = $1
  ORDER BY created_at ASC
  LIMIT $2 OFFSET $3
  `
  const articleQueryStr = `
  SELECT * FROM articles
  WHERE article_id = $1
  `
  //duplicating a tiny bit of code is better than tightly coupling two models imo
  const promises = [db.query(articleQueryStr, [ articleId ]), db.query(commentQueryStr, [ articleId, limit, offset ])]
  return Promise.all(promises)
  .then((result) => {
    const [ article, comments ] = result
    if (article.rows[0]) { return comments.rows }
    else { return Promise.reject({ status:404, msg: 'article not found' }) }
  })
}

exports.createComment = (articleId, username, commentBody) => {
  if (!(username && commentBody)) return Promise.reject({ status: 400, msg: 'invalid body properties' })
  const queryStr = `
  INSERT INTO comments
  (article_id, votes, author, body, created_at)
  VALUES
  ($1, 0, $2, $3, NOW()::timestamp)
  RETURNING *
  `
  return db.query(queryStr, [articleId, username, commentBody])
  .then((result) => {
    return result.rows[0]
  })
}

exports.updateArticleVotes = (articleId, incVotes) => {
  if (!incVotes) return Promise.reject({ status: 400, msg: 'invalid body properties' })
  const queryStr = `
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *
  `
  return db.query(queryStr, [ articleId, incVotes ])
  .then((result) => {
    if(result.rows[0]) return result.rows[0]
    else return Promise.reject({ status:404, msg: 'article not found' })
  })
}

exports.removeArticle = (articleId) => {
  const queryStr = `
  DELETE FROM articles
  WHERE article_id = $1
  `
  return db.query(queryStr, [ articleId ]).then((result) => {
    if (result.rowCount === 0) return Promise.reject({ status: 404, msg: 'article not found' })
  })
}