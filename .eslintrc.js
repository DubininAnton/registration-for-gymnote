module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: 0,
    'no-console': 'off',
    'no-unused-vars': 1,
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
}
