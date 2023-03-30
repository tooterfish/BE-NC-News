const articleRouter = require('express').Router()
const { getArticle, getArticles, getCommentsByArticle, postCommentOnArticle, patchArticleVotes } = require('../controllers/articles-controllers')

articleRouter
  .route('/')
  .get(getArticles)

articleRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes)

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentOnArticle)

module.exports = articleRouter