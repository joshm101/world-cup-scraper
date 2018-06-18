/**
 * NOTE:
 * This script operates under the assumption that
 * the database has already been populated with
 * teams. This script should always run after
 * initializeTeams()
 */

const Group = require('../../../models/Group')
const Team = require('../../../models/Team')

const getGroups = require('../../getGroups')

const createGroup = (group) => {
  const teams = [...group.teams]

  // Find all teams that should belong
  // to this group
  return Team.find(
    {
      name: {
        $in: teams.map(team =>
          team.name
        )
      }
    }
  ).then(teams =>
    // create array of Team ObjectIDs
    teams.map(team => team._id)
  ).then(teamReferences =>
    // Create group with references
    // to teams that belong to group
    Group.create({
      ...group,
      teams: [...teamReferences]
    })
  )
}

async function initializeGroups() {
  const groups = await getGroups()
  const createdGroups = await Promise.all(
    groups.map(createGroup)
  )
}

module.exports = initializeGroups