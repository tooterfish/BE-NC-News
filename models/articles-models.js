const db = require('../db/connection')

exports.fetchArticles = (topic, sortBy, order) => {
  const allowedSorts = new Set(['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count'])
  const allowedOrder = new Set(['ASC', 'DESC'])
  const allowedTopics = new Set(['mitch', 'cats', 'paper']) //cache this at startup and update everytime topic is posted or deleted?
  
  let topicQuery = ''
  if (allowedTopics.has(topic)) topicQuery = `WHERE topic = '${topic}'`
  
  if(!allowedSorts.has(sortBy)) sortBy = 'created_at'
  if(!allowedOrder.has(order)) order = 'DESC'
  const sortQuery = `${sortBy} ${order}`

  const queryStr = `
  SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  ${topicQuery}
  GROUP BY articles.article_id
  ORDER BY ${sortQuery}
  `

  return db.query(queryStr).then((result) => {
    return result.rows
  })
}

exports.fetchArticle = (articleId) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
  .then((result) => {
    if (result.rows[0]) { return result.rows[0] }
    else { return Promise.reject({ status:404, msg: 'article not found' }) }
  }
)}

exports.fetchCommentsByArticle = (articleId) => {
  const commentQueryStr = `
  SELECT comments.* FROM comments
  JOIN articles ON comments.article_id = articles.article_id
  WHERE comments.article_id = $1
  ORDER BY created_at ASC
  `
  const articleQueryStr = `
  SELECT * FROM articles
  WHERE article_id = $1
  `
  //duplicating a tiny bit of code is better than tightly coupling two models imo
  const promises = [db.query(articleQueryStr, [ articleId ]), db.query(commentQueryStr, [ articleId ])]
  return Promise.all(promises)
  .then((result) => {
    const [ article, comments ] = result
    if (article.rows[0]) { return comments.rows }
    else { return Promise.reject({ status:404, msg: 'article not found' }) }
  })
}

exports.createComment = (articleId, username, commentBody) => {
  if (!(username || commentBody)) return Promise.reject({ status: 400, msg: 'invalid body properties' })
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