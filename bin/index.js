const mongoose = require('mongoose')
const config = require('config')

const app = require('../index')

const MONGODB_CONNECTION_URL = (
  `mongodb://mongo/${config.WCS_MONGODB_CONNECTION_PATH}`
)

// Connect to MongoDB
mongoose.connect(MONGODB_CONNECTION_URL).then((_) => {
  app()
})
