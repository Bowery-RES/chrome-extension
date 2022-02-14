const result = require('dotenv').config()

if (result.error) {
  throw result.error
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ENV: process.env.APP_ENV || 'development',
  PORT: process.env.PORT || 3000,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  BOWERY_APP_DOMAIN: process.env.BOWERY_APP_DOMAIN,
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
}
