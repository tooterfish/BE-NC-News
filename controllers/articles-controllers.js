const { forEach } = require('../db/data/test-data/articles')
const { fetchArticle, fetchArticles, fetchCommentsByArticle, createComment, updateArticleVotes, createArticle } = require('../models/articles-models')

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

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body
  createArticle(author, title, body, topic, article_img_url)
  .then((article) => {
    res.status(201).send({ article })
  })
  .catch((err) => {
    next(err)
  })
}

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query
  fetchArticles(topic, sort_by, order, limit, p)
  .then((articles) => {
    
    let total_count = 0
    if (articles.length !== 0) { 
      total_count = articles[0].total_count
      articles.forEach(article => delete article.total_count)
    }
    res.status(200).send({ articles, total_count })
  })
  .catch((err) => {
    next(err)
  })
}

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params
  const { limit, p } = req.query
  fetchCommentsByArticle(article_id, limit, p)
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