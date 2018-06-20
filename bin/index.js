const mongoose = require('mongoose')

const app = require('../index')

const { 
  WCS_MONGODB_CONNECTION_URI,
  WCS_MONGODB_CONNECTION_USERNAME,
  WCS_MONGODB_CONNECTION_PASSWORD
} = process.env

const hasRequiredEnvironmentVariables = () => {
  if (
    WCS_MONGODB_CONNECTION_URI &&
    WCS_MONGODB_CONNECTION_USERNAME &&
    WCS_MONGODB_CONNECTION_PASSWORD
  ) { 
    return true
  }
  return false
}

if (!hasRequiredEnvironmentVariables()) {
  console.error(
    'Error: Required environment variables are not set. Exiting.'
  )
  process.exit(1)
}

const MONGODB_CONNECTION_URL = (
  `mongodb://${WCS_MONGODB_CONNECTION_USERNAME}:${encodeURIComponent(WCS_MONGODB_CONNECTION_PASSWORD)}@${WCS_MONGODB_CONNECTION_URI}`
)

// Connect to MongoDB
mongoose.connect(
  MONGODB_CONNECTION_URL
).then((_) => {
  app()
}).catch((error) => {
  console.error("There was an error connecting to database:")
  console.error(error.message)
  console.log('EXITING.')
  process.exit(1)
})
