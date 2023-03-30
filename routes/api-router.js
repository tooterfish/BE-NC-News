const apiRouter = require('express').Router()
const endpoints = require('../endpoints.json')
const userRouter = require('./users-router')
const articleRouter = require('./articles-router')

apiRouter.get('/', (req, res) => {
  res.status(200).send({ endpoints })
})

apiRouter.use('/users', userRouter)
apiRouter.use('/articles', articleRouter)

module.exports = apiRouter