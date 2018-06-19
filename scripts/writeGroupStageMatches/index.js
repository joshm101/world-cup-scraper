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
      return Group.findOne(
        searchQuery
      ).then((group) => {
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

  // iterate over each match and write the
  // match data. await used for synchronization
  for (let i = 0; i < matches.length; ++i) {
    const result = await writeMatch(matches[i])
    results.push(result)
  }
  return results
}

module.exports = writeData
