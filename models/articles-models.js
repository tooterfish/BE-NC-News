const db = require('../db/connection')

exports.fetchArticle = (articleId) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
  .then((result) => {
    if (result.rows[0]) { return result.rows[0] }
    else { return Promise.reject({ status:404, msg: 'article not found' }) }
  }
)}