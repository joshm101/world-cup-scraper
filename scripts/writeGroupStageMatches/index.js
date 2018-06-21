/**
 * NOTE:
 * This script operates under the assumption that
 * the database has already been populated with
 * groups & teams.
 */


const Team = require('../../models/Team')
const Match = require('../../models/Match')
const Group = require('../../models/Group')

/**
 * Update group's matches array by ensuring that the
 * writtenMatch is a part of the group's matches
 * array
 * @param {object} searchQuery - MongoDB search query object 
 * @param {object} writtenMatch - Mongoose Match object 
 */
const updateGroup = (searchQuery, writtenMatch) => {
  return Group.findOne(
    searchQuery
  ).then((group) => {
    if (!group) {
      console.log(
        'Match is already referenced in group, continuing...'
      )
      return
    }
    // set resulting match ObjectId array
    // and update Group
    const matches = [
      ...group.matches,
      writtenMatch._id
    ]
    return Group.update(
      searchQuery,
      {
        matches
      }
    )
  })
}

/**
 * Update team's matches array by ensuring that
 * the writtenMatch is a part of the team's matches
 * array
 * @param {object} team - Team mongoose object 
 * @param {object} writtenMatch - Written mongoose Match object
 * @return {Promise} - MongoDB update promise
 */
const updateTeam = (team, writtenMatch) => {

  // filter out written match if already part of team's
  // matches ID array and append to end of matches ID array
  const teamMatches = team.matches.filter(match =>
    !(match._id.equals(writtenMatch._id))
  ).concat([writtenMatch._id])
  
  // Update team in database
  return Team.update(
    {
      _id: team._id
    },
    {
      matches: teamMatches
    }
  )
}

/**
 * Writes an individual match to
 * the database.
 * @param {object} match - Match data object
 * @return {Promise<Match>} - Database Match
 * object wrapped in a Promise
 */
const writeMatch = (match) => {
  return Promise.all([
    Team.findOne({ name: match.homeTeam.name }),
    Team.findOne({ name: match.awayTeam.name })
  ]).then(([homeTeam, awayTeam]) => {
    const homeTeamGoalsByHalf = match.homeTeam.goalsByHalf
    const awayTeamGoalsByHalf = match.awayTeam.goalsByHalf
    const matchToWrite = {
      date: match.date,
      homeTeam: homeTeam._id,
      awayTeam: awayTeam._id,
      homeTeamGoalsByHalf,
      awayTeamGoalsByHalf
    }

    // we want to update a match that has the same
    // teams and occurred on the same date as
    // matchToWrite
    const searchQuery = {
      homeTeam: homeTeam._id,
      awayTeam: awayTeam._id,
      date: matchToWrite.date
    }

    return Match.findOneAndUpdate(
      searchQuery,
      matchToWrite,
      { new: true }
    ).then((match) => {
      if (match) {
        // match exists, so it was successfully updated
        return match
      }
      // match does not exist, document in Match
      // collection needs to be created
      return Match.create(matchToWrite)
    }).then((writtenMatch) => {
      // Find group that home team and away team
      // are a part of AND does not currently have
      // writtenMatch._id in its matches array
      const searchQuery = {
        teams: {
          $in: [homeTeam._id, awayTeam._id]
        },
        matches: {
          $nin: [writtenMatch._id] 
        }
      }

      const groupUpdate = updateGroup(searchQuery, writtenMatch)
      const homeTeamUpdate = updateTeam(homeTeam, writtenMatch)
      const awayTeamUpdate = updateTeam(awayTeam, writtenMatch)
      return Promise.all([
        groupUpdate,
        homeTeamUpdate,
        awayTeamUpdate
      ]).then(updates =>
        writtenMatch
      )
    })
  })
}

/**
 * Writes match data to the database
 * synchronously via await
 * @param {object[]} matches - Retrieved match data
 * @return {Promise<object[]>} - DB write results 
 */
async function writeData(matches) {
  let results = []
  try {
    // iterate over each match and write the
    // match data. await used for synchronization
    for (let i = 0; i < matches.length; ++i) {
      const result = await writeMatch(matches[i])
      results.push(result)
    }
    return results
  } catch (error) {
    throw new Error(
      `An error occurred while writing match data: ${error.message}`
    )
  }
}

module.exports = writeData
