const db = require('../db/connection')

exports.updateCommentVotes = (commentId, incVotes) => {
  if (!incVotes) return Promise.reject({ status: 400, msg: 'invalid body properties' })
  const queryStr = `
  UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *
  `
  return db.query(queryStr, [ commentId, incVotes ]).then((result) => {
    if (result.rows[0]) return result.rows[0]
    else return Promise.reject({ status: 404, msg: 'comment not found' })
  })
}

exports.removeComment = (commentId) => {
  const queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  `
  return db.query(queryStr, [ commentId ]).then((result) => {
    if (result.rowCount === 0) return Promise.reject({ status: 404, msg: 'comment not found' })
  })
}