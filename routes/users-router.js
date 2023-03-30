const userRouter = require('express').Router()
const { getUsers } = require('../controllers/users-controllers')

userRouter
  .route('/')
  .get(getUsers)

module.exports = userRouter