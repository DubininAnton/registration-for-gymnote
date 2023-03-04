const ApiError = require('../exceptions/api-error')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }
  if (process.env.NODE_ENV !== 'test') {
    console.log('----------------------------')
    console.log(err.statusCode)
    console.log(err.message)
    console.log(err.name)
    console.log(err.statusCode)
    console.log('----------------------------')
  }
  return res
    .status(500)
    .json({ message: `Непредвиденная ошибка: ${err.message}` })
}
