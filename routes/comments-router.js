const commentRouter = require('express').Router()
const { patchCommentVotes, deleteComment } = require('../controllers/comments-controllers')

commentRouter
  .route('/:comment_id')
  .patch(patchCommentVotes)
  .delete(deleteComment)

module.exports = commentRouter

