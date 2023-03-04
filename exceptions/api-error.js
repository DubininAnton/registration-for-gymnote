module.exports = class ApiError extends Error {
  status

  errors

  constructor(status, message, errors = []) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`Ошибка ${status} : ${message}`)
    }
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError(text = '') {
    return new ApiError(401, `Пользователь не авторизован: ${text}`)
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }
}
