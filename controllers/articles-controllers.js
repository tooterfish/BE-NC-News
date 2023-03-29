const { fetchArticle, fetchArticles, fetchCommentsByArticle, createComment, updateArticleVotes } = require('../models/articles-models')

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
  const { topic, sort_by, order } = req.query
  fetchArticles(topic, sort_by, order)
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
  .catch((err) => {
    next(err)
  })
}

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params
  const { inc_votes } = req.body
  updateArticleVotes(article_id, inc_votes)
  .then((article) => {
    res.status(200).send({ article })
  })
  .catch((err) => {
    next(err)
  })
}