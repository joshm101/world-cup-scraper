const getGroupStageMatches = require('./scripts/getGroupStageMatches')
const getGroups = require('./scripts/getGroups')

const app = () => {
  getGroupStageMatches()
  getGroups()
}

module.exports = app
