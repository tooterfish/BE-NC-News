const db = require('../db/connection')

exports.fetchArticle = (articleId) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
  .then((result) => {
    if (result.rows[0]) { return result.rows[0] }
    else { return Promise.reject({ status:404, msg: 'article not found' }) }
  }
)}

exports.fetchArticles = () => {
  const queryStr = `
  SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC
  `
  return db.query(queryStr).then((result) => {
    return result.rows
  })
}

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