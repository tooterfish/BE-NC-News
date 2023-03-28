const { fetchArticle, fetchArticles, fetchCommentsByArticle, createComment } = require('../models/articles-models')

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params
  fetchArticle(article_id)
  .then((article) => {
    res.status(200).send({ article })
  })
  .catch((err) => {
    next(err)
  })
}

exports.getArticles = (req, res, next) => {
  fetchArticles()
  .then((articles) => {
    res.status(200).send({ articles })
  })
}

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params
  fetchCommentsByArticle(article_id)
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch((err) => {
    next(err)
  })
}

exports.postCommentOnArticle = (req, res, next) => {
  const { article_id } = req.params
  const { username, body } = req.body
  createComment(article_id, username, body)
  .then((comment) => {
    res.status(201).send({ comment })
  })
}