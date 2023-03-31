const articleRouter = require('express').Router()
const { getArticle, getArticles, getCommentsByArticle, postCommentOnArticle, patchArticleVotes, postArticle, deleteArticle } = require('../controllers/articles-controllers')

articleRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)

articleRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle)

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentOnArticle)

module.exports = articleRouter