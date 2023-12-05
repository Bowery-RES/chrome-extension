require('dotenv').config()

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ENV: process.env.APP_ENV || 'development',
  PORT: process.env.PORT || 3000,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  BOWERY_APP_DOMAIN: process.env.BOWERY_APP_DOMAIN,
  COMPPLEX_DOMAIN: process.env.COMPPLEX_DOMAIN,
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
}
