const apiRouter = require('express').Router()
const endpoints = require('../endpoints.json')
const userRouter = require('./users-router')
const articleRouter = require('./articles-router')
const topicRouter = require('./topics-router')

apiRouter.get('/', (req, res) => {
  res.status(200).send({ endpoints })
})

apiRouter.use('/users', userRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/topics', topicRouter)

module.exports = apiRouter