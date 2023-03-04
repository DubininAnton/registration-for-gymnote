const winston = require('winston')
require('winston-daily-rotate-file')
const expressWinston = require('express-winston')
const { LOG_FOLDER } = require('../utils/config')

const fileSuffix = process.env.NODE_ENV === 'test' ? '_tests' : ''
const requestLogFile = {
  filename: `${LOG_FOLDER}/request${fileSuffix}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '2m',
  maxFiles: '3d',
}
const errorLogFile = {
  filename: `${LOG_FOLDER}/error${fileSuffix}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '2m',
  maxFiles: '3d',
}

/**
 *
 * @param {*} str - стока которая примет вид: 'start символов с начал ... end символов с конца'
 * @param {*} start
 * @param {*} end
 * @returns
 */
const shorter = (str, start = 30, end = 10) => (str ? `${str.slice(0, start)}...${str.slice(-end)}` : null)

// логгер запросов
const requestFileLogger = expressWinston.logger({
  transports: [new winston.transports.DailyRotateFile(requestLogFile)],
  format: winston.format.json(),
  metaField: null,
  requestField: null,
  responseField: null,
  requestWhitelist: ['headers', 'query', 'body'],
  responseWhitelist: ['body'],

  dynamicMeta: (req, res) => {
    const httpRequest = {}
    const httpResponse = {}
    const meta = {}

    if (req) {
      meta.z_httpRequest = httpRequest
      // httpRequest.a_requestMethod = req.method
      // httpRequest.a_request_Url = `${req.method}  ${req.protocol}://${req.get('host')}${req.originalUrl}`
      // httpRequest.protocol = `HTTP/${req.httpVersion}`
      // httpRequest.remoteIp = req.ip.indexOf(':') >= 0
      // ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip
      // httpRequest.requestSize = req.socket.bytesRead
      // httpRequest.userAgent = req.get('User-Agent')
      // httpRequest.referrer = req.get('Referrer')
      // httpRequest.c_query = req.query
      httpRequest.body = req.body
      if (httpRequest.body.password) {
        httpRequest.body.password = '******'
      }
      httpRequest.headers = {
        // "content-type": req.headers["content-type"],
        authorization: shorter(req.headers.authorization),
        cookie: shorter(req.headers.cookie),
      }
      // req.headers //если нужно смотреть все заголовки
    }
    // meta.httpRequest = httpRequest

    if (res) {
      meta.z_httpResponse = httpResponse
      httpResponse.a_status = res.statusCode
      // httpResponse.latency = {
      //   seconds: `${Math.floor(res.responseTime / 1000)}.${( res.responseTime % 1000 ) * 1000}`
      // }
      if (res.body) {
        // if (typeof res.body === 'object') {
        //   httpResponse.responseSize = JSON.stringify(res.body).length
        // } else if (typeof res.body === 'string') {
        //   httpResponse.responseSize = res.body.length
        // }
        httpResponse.body = res.body
        httpResponse.body.accessToken = shorter(httpResponse.body.accessToken)
      }
      httpResponse.hasSetCookie = shorter(res.setCook, 50, 10)
    }
    meta.added_log = new Date().toLocaleString().slice(0, 20)

    return meta
  },
})

// консольный логгер запросов
const requestConsoleLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  expressFormat: true,
  metaField: null,
  requestField: null,
  responseField: null,
  requestWhitelist: ['headers', 'query', 'body'],
  responseWhitelist: ['body'],
  dynamicMeta: (req, res) => {
    const httpRequest = {}
    const httpResponse = {}
    const meta = {}

    if (req) {
      meta.z_httpRequest = httpRequest
      httpRequest.headers = {
        authorization: shorter(req.headers.authorization),
        cookie: shorter(req.headers.cookie),
      }
    }
    if (res) {
      meta.z_httpResponse = httpResponse
      httpResponse.a_status = res.statusCode
      httpResponse.hasSetCookie = shorter(res.setCook, 50, 10)
    }

    return meta
  },
  statusLevels: false,
})

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.DailyRotateFile(errorLogFile)],
  meta: false,
  format: winston.format.json(),
})

module.exports = {
  requestFileLogger,
  requestConsoleLogger,
  errorLogger,
}
