require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

const router = require('./router/index')
const corsMiddleware = require('./middlewares/cors-middleware')
const errorMiddleware = require('./middlewares/error-middleware')
const logMiddleware = require('./middlewares/log-middleware')
const { API_PATH } = require('./utils/config')
const {
  requestFileLogger,
  requestConsoleLogger,
  errorLogger,
} = require('./middlewares/logger-middleware')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(logMiddleware)
app.use(corsMiddleware)
app.use(requestFileLogger)
if (process.env.NODE_ENV !== 'test') {
  app.use(requestConsoleLogger)
}

app.use(`${API_PATH}/`, router)

app.use(errorLogger)
app.use(errorMiddleware)

module.exports = app
