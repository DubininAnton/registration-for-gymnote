/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-undef */
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const TokenService = require('../service/token-service')
const { API_PATH } = require('../utils/config')

const request = supertest(app)

const { userAdmin, userSimple } = require('../fixtures/users')

const accessTokenUserAdmin = TokenService.generateTokens(userAdmin).accessToken // is Admin
const accessTokenUserSimple = TokenService.generateTokens(userSimple).accessToken
// const tokenModel = require('../models/token-model')
const userModel = require('../models/user-model')
// const UserDto = require('../dtos/user-dto')

const MONGO_URL = 'mongodb://localhost:27017/testGymNote'

beforeAll(() => {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  return userModel.create([userAdmin, userSimple]).then((result) => {
    const users = [userAdmin, userSimple]
    users.map((user, index) => {
      const newUser = user
      newUser.id = `${result[index]._id}`
      return newUser
    })
  })
})

afterAll(() => {
  mongoose.disconnect()
  return mongoose.connection.db.dropDatabase()
})

describe('Тестируем защищенные маршруты для пользователей', () => {
  it(`${API_PATH}/users -без токена должен выдавать 401 ошибку`, () =>
    request.get(`${API_PATH}/users`).then((response) => {
      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Пользователь не авторизован: no Authorization header')
    }))
  it(`${API_PATH}/users - с плохим токеном должен выдавать 401 ошибку`, () =>
    request
      .get(`${API_PATH}/users`)
      .set('Authorization', 'bedTOken')
      .then((response) => {
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован: no token')
      }))
  it(`${API_PATH}/users - с невалидным токеном должен выдавать 401 ошибку`, () =>
    request
      .get(`${API_PATH}/users`)
      .set('Authorization', 'Bearer invalidToken1804398-1')
      .then((response) => {
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован: invalid token')
      }))
  it(`${API_PATH}/users - с валидным токеном должен вернуть 200 код и данные авторизованного пользователя `, () =>
    request
      .get(`${API_PATH}/users`)
      .set('Authorization', `Bearer ${accessTokenUserSimple}`)
      .then((response) => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        const { email, id, isActivated } = userSimple
        expect(response.body[0]).toEqual({ email, id, isActivated })
      }))
  it(`${API_PATH}/users - с валидным токеном админа должен вернуть 200 код и данные всех пользователей`, () =>
    request
      .get(`${API_PATH}/users`)
      .set('Authorization', `Bearer ${accessTokenUserAdmin}`)
      .then((response) => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)
        const { email, id, isActivated } = userAdmin
        expect(response.body).toContainEqual({ email, id, isActivated })
      }))
  it(`${API_PATH}/notcorrect - с валидным токеном должен ответить 404 ошибкой`, () =>
    request
      .get(`${API_PATH}/notcorrect`)
      .set('Authorization', `Bearer ${accessTokenUserAdmin}`)
      .then((response) => {
        expect(response.status).toBe(404)
      }))
  it(`${API_PATH}/notcorrect - с не валидным токеном должен ответить 401 ошибкой`, () =>
    request.get(`${API_PATH}/hello`).then((response) => {
      expect(response.status).toBe(401)
    }))
  // .catch((err) => {
  //   console.log("++++++++++++++++++++++++++++++")
  //   console.log(err)
  // })

  it('"/" - независимо от авторизации должен ответить 404 ошибкой', () =>
    request.get('/').then((response) => {
      expect(response.status).toBe(404)
    }))
}, 30)
