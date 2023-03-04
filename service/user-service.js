
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const userModel = require('../models/user-model')
// const mailService = require('./mail-service')
const TokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const config = require('../utils/config')

const Exercise = require('../models/exercise-model')

class UserService {
  static async registration(email, password) {
    const candidate = await userModel.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`,
      )
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await userModel.create({
      email,
      password: hashPassword,
      activationLink,
    })
    // await mailService.sendActivationMail(
    //   email,
    //   `${config.API_URL}/api/activate/${activationLink}`,
    // )

    return this.prepareUserForResponse(user)
  }

  static async activate(activationLink) {
    const user = await userModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }
    if (!user.isActivated) {
      user.isActivated = true
      await user.save()
    }
  }

  static async login(email, password) {
    const user = await userModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Некорректный пароль!')

    }

    return this.prepareUserForResponse(user)
  }

  static async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken)
    return token
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await TokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await userModel.findById(userData.id)
    return this.prepareUserForResponse(user)
  }

  static async getAllUsers() {
    const users = await userModel.find()
    return users
  }

  static async prepareUserForResponse(user) {
    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveToken(userDto.id, tokens.refreshToken)
    return { tokens, user: userDto }
  }


  static async patсhExercise(data) {
    userModel  
      .findByIdAndUpdate(JSON.parse(data).id, JSON.parse(data))
      .then((results)=> {
        results 
          .status(200)
          .json(results)
      })
      .catch((e)=>{throw ApiError(e)})
  }

  static async addNewAccount(req, res) {
    const exercise = new Exercise(req.body)

  await  exercise
      .then((result) => {
        res 
          .status(200)
          .json(result)
      })
    return exercise;
  }

  static async getAllAccount() {
    const exercise = Exercise.find()
    return exercise;
  }
  


}

module.exports = UserService
