const topicRouter = require('express').Router()
const { getTopics, postNewTopic } = require('../controllers/topics-controllers')

topicRouter
  .route('/')
  .get(getTopics)
  .post(postNewTopic)

module.exports = topicRouter