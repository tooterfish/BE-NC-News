const express = require('express')
const { handleErrors } = require('./controllers/error-controllers')
const apiRouter = require('./routes/api-router')
const { pregenQueriesSets } = require('./app-utils')
const cors = require('cors')

pregenQueriesSets()


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)

app.use('/*', (req, res) => {
  res.status(404).send({ msg: 'page not found' })
})

app.use(handleErrors)

module.exports = app