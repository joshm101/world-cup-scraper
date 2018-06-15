const request = require('request')
const cheerio = require('cheerio')

request('https://www.cbssports.com/soccer/world-cup/scoreboard/20180624', (err, _, body) => {
  try {
    if (err) {
      throw new Error(err.message)
    }
    const $ = cheerio.load(body)

    // each node represents scores for a game.
    // if the array is empty, then the schedule
    // of teams to play hasn't been determined
    // for the date being processed (quarter
    // finals, semi finals, etc.)
    const scoreNodes = $('[id^=scores]').toArray()
    const games = scoreNodes.map(scoreNode =>
      ({
        homeTeam: {
          ...parseTeamData(
            $,
            scoreNode.attribs.id,
            'home'
          )
        },
        awayTeam: {
          ...parseTeamData(
            $,
            scoreNode.attribs.id,
            'away'
          )
        }
      })
    )

    console.log('games: ', games)

  } catch (error) {
    console.error(error)
  }
})

/**
 * Parses & scrapes team data from the HTML response
 * @param {object} $ - Cheerio reference to query page elements 
 * @param {string} gameScoreNodeId - ID of game score element
 * being parsed/scraped.
 * @param {'home'|'away'} homeAwayPrefix - home/away class
 * selection prefix
 * @return {object} - Team data object
 */
const parseTeamData = ($, gameScoreNodeId, homeAwayPrefix) => {
  let firstHalfGoals = secondHalfGoals = undefined
  const prefix = `#${gameScoreNodeId} .${homeAwayPrefix}Team`

  // get team name & record
  const infoNodes = $(`${prefix} .teamLocation`).children()
  const name = infoNodes[0].prev.data
  const recordNode = infoNodes[0].children[0]
  const record = recordNode.data

  let goalsByHalf = []
  if ($(`${prefix} .periodScore`).length) {
    // periodScore node exists, scrape goals data
    // (periodScore wouldn't exist on games that
    // have not yet been played)
    goalsByHalf = $(`${prefix} .periodScore`)
    firstHalfGoals = parseInt(
      goalsByHalf[0].children[0].data
    )
    secondHalfGoals = parseInt(
      goalsByHalf[1].children[0].data
    )
  }
  // integer value if firstHalfGoals & secondHalfGoals
  // are defined, null otherwise
  const finalScore = (
    ((firstHalfGoals >= 0) && (secondHalfGoals >= 0)) ?
    firstHalfGoals + secondHalfGoals : null
  )

  const logo = $(`${prefix} .teamLogo`).attr().src

  return {
    name,
    logo,
    record,
    finalScore,
    goalsByHalf: [firstHalfGoals, secondHalfGoals],
  }
}