const config = require('config')

const getGroupStageMatches = require('./scripts/getGroupStageMatches')
const getGroups = require('./scripts/getGroups')
const initDatabase = require('./scripts/initDatabase')

const app = () => {
  if (config.INIT_DB) {
    try {
      initDatabase()
    } catch (error) {
      console.error('-- DB initialization error --')
      console.error(error)
    }
  }
}

module.exports = app
