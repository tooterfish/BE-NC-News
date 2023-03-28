const db = require('../db/connection')

exports.removeComment = (commentId) => {
  const queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  `
  return db.query(queryStr, [ commentId ])
}