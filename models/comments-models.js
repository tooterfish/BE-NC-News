const db = require('../db/connection')

exports.removeComment = (commentId) => {
  const queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  `
  return db.query(queryStr, [ commentId ]).then((result) => {
    if (result.rowCount === 0) return Promise.reject({ status: 404, msg: 'comment not found' })
  })
}