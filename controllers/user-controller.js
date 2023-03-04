const { validationResult } = require('express-validator')
const UserService = require('../service/user-service')
const ApiError = require('../exceptions/api-error')
const config = require('../utils/config')
const UserDto = require('../dtos/user-dto')

class UserController {
  static async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }
      const { email, password } = req.body
      const { tokens, user } = await UserService.registration(email, password)
      res.setCook = UserController.setRefreshTokenToCookie(
        res,
        tokens.refreshToken,
      )
      return res.json({ accessToken: tokens.accessToken, user })
    } catch (e) {
      return next(e)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const { tokens, user } = await UserService.login(email, password)
      res.setCook = UserController.setRefreshTokenToCookie(
        res,
        tokens.refreshToken,
      )
      return res.json({
        accessToken: tokens.accessToken,
        user,
      })
    } catch (e) {
      return next(e)
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await UserService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      return next(e)
    }
  }

  static async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await UserService.activate(activationLink)
      return res.redirect(config.CLIENT_URL)
    } catch (e) {
      return next(e)
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { tokens, user } = await UserService.refresh(refreshToken)
      res.setCook = UserController.setRefreshTokenToCookie(
        res,
        tokens.refreshToken,
      )
      return res.json({ accessToken: tokens.accessToken, user })
    } catch (e) {
      return next(e)
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await (await UserService.getAllUsers())
        .filter((user) => req.user.isAdmin || req.user.email === user.email)
        .map((user) => new UserDto(user))
      return res.json(users)
    } catch (e) {
      return next(e)
    }
  }

  static setRefreshTokenToCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: config.MAX_AGE_REFRESH_TOKEN_COOKIE,
      httpOnly: true,
      sameSite: true,
    })
    return `Has set cookie: refreshToken: ${refreshToken}`
  }

  static async addAccount() {
    const exercise = await UserService.addNewAccount()
    return exercise;
  }

  static async getAccount() {
    const exercise = await UserController.getAllAccount()
    return exercise
  }
}

module.exports = UserController
