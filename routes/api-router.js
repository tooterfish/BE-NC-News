const apiRouter = require('express').Router()
const endpoints = require('../endpoints.json')

apiRouter.get('/', (req, res) => {
  res.status(200).send({ endpoints })
})

module.exports = apiRouter