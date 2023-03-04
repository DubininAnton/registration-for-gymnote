const router = require('express').Router()
const { body } = require('express-validator')
const UserController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const Exercise = require('../models/exercise-model')

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 3, max: 32 }),
  UserController.registration,
)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)

router.get('/refresh', UserController.refresh)

router.use(authMiddleware)

router.get('/users', UserController.getUsers)

/* Добавляю в базу данных информацию об упражнении */
// router.patch('/users/:id', UserController.addExerсise) 

// router.post('/exercise', UserController.addAccount)

// router.get('/getExercise', UserController.getAccount)

// router.post('/exercise', (req, res)=> {
//   const exercise = new Exercise(req.body)

//   exercise
//     .then((result) => {
//       res 
//         .status(200)
//         .json(result)
//     })
//   return exercise;
// })


module.exports = router
