const { fetchTopics, createTopic } = require('../models/topics-models.js')

exports.getTopics = (req, res, next) => {
  fetchTopics()
  .then((topics) => {
    res.status(200).send({ topics })
  })
}

exports.postNewTopic = (req, res, next) => {
  console.log(req.body)
  const { description, slug } = req.body
  createTopic(description, slug)
  .then((topic) => {
    res.status(201).send({ topic })
  })
  .catch((err) => {
    next(err)
  })
}