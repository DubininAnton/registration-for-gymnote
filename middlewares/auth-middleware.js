const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')
const { ADMIN_EMAILS } = require('../utils/config')

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError('no Authorization header'))
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError('no token'))
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError('invalid token'))
    }

    if (ADMIN_EMAILS.includes(userData.email)) {
      userData.isAdmin = true
    }

    req.user = userData
    return next()
  } catch (error) {
    return next(ApiError.UnauthorizedError('unknown error!'))
  }
}
