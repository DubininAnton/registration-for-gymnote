/* eslint-disable key-spacing */
const SETTINGS = {
  PORT:                          '5000',
  DB_URL:                        'mongodb://localhost:27017/gymNote', // for mongoDB-Atlas'mongodb+srv://<user>.<password>@<claster>.mongodb.net/?retryWrites=true&w=majority'
  JWT_ACCESS_SECRET:             'jwt-secret-key-Change-it-in-production',
  JWT_REFRESH_SECRET:            'jwt-refresh-secret-Change-it-in-production',
  MAX_AGE_ACCESS_TOKEN:          '60d',
  MAX_AGE_REFRESH_TOKEN:         '30d',
  MAX_AGE_REFRESH_TOKEN_COOKIE:   30 /* дней */ * 24 /* часов */ * 60 * 60 * 1000,
  SMTP_HOST:                     'smtp.server.com',
  SMTP_PORT:                      25, // default smtp port
  SMTP_USER:                     'user@smtp.server.com',
  SMTP_PASSWORD:                 'password fo user',
  API_URL:                       'http://localhost:5000',
  CLIENT_URL:                    'http://localhost:3000',
  API_PATH:                      '/api',
  LOG_FOLDER:                    'logs',
  ADMIN_EMAILS:                  ['user1@test.ru'], // User whitch are admins, and have all privilegies
}

const envVariables = {}

// eslint-disable-next-line guard-for-in, no-restricted-syntax
for (const key in SETTINGS) {
  envVariables[key] = ['production', 'test'].includes(process.env.NODE_ENV)
    ? process.env[key] ?? SETTINGS[key]
    : SETTINGS[key]
}

module.exports = envVariables
