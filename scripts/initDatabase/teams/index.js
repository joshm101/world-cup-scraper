const Team = require('../../../models/Team')
const getTeams = require('../../getTeams')

const createTeam = (team) => {
  return Team.create(team)
}

async function initializeTeams() {
  const teams = await getTeams()
  const createdTeams = await Promise.all(
    teams.map(createTeam)
  )
}

module.exports = initializeTeams
