const Team = require('../../models/Team')
const Match = require('../../models/Match')
const Group = require('../../models/Group')

const initGroups = require('./groups')
const initTeams = require('./teams')

/**
 * Initializes database data by invoking
 * scripts which fetch data and create
 * entries in DB collections.
 */
async function initDatabase() {
  // Start by clearing the database
  return await Promise.all([
    Team.remove({}),
    Match.remove({}),
    Group.remove({})
  ]).then(() => {
    // Initialize collections
    initTeams()
    initGroups()
  })
}

module.exports = initDatabase
