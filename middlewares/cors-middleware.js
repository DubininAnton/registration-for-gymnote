const cors = require('cors')

// const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'
const config = require('../utils/config')

module.exports = cors({
  credentials: true,
  // origin: true
  origin: config.CLIENT_URL,
})
