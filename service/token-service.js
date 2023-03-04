const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')
const config = require('../utils/config')

class TokenService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.MAX_AGE_ACCESS_TOKEN,
    })
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.MAX_AGE_REFRESH_TOKEN,
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  static validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, config.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  static validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, config.JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  static async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await tokenModel.create({ user: userId, refreshToken })
    return token
  }

  static async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken })
    return tokenData
  }

  static async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken })
    return tokenData
  }
}

module.exports = TokenService
