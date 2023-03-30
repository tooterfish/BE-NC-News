const topicRouter = require('express').Router()
const { getTopics } = require('../controllers/topics-controllers')

topicRouter
  .route('/')
  .get(getTopics)

module.exports = topicRouter