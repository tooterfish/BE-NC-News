const express = require('express')
const { getArticle, getArticles } = require('./controllers/articles-controllers')
const { getTopics } = require('./controllers/topics-controllers')
const { handleErrors } = require('./controllers/error-controllers')


const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles', getArticles)

app.use('/*', (req, res) => {
  res.status(404).send({ msg: 'page not found' })
})

app.use(handleErrors)

module.exports = app