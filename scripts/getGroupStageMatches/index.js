/**
 * Scrapes world cup group stage data from HTML
 * responses
 */

const requestPromise = require('request-promise-native')
const cheerio = require('cheerio')
const moment = require('moment')
const twix = require('twix')

const URL = 'https://www.cbssports.com/soccer/world-cup/scoreboard'

let matches = []

/**
 * This function parses game data from HTML response
 * accessible via $ param.
 * @param {objet} $ - Cheerio accessor
 * @return {object[]} - Parsed game data 
 */
const parseDataForDate = ($) => {
  // each node represents scores for a game.
  // if the array is empty, then the schedule
  // of teams to play hasn't been determined
  // for the date being processed (quarter
  // finals, semi finals, etc.)
  const scoreNodes = $('[id^=scores]').toArray()
  const games = scoreNodes.map(scoreNode => {
    const matchStatus = parseMatchStatusInfo(
      $, scoreNode.attribs.id
    )
    return ({
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
      },
      inProgress: matchStatus.inProgress
    })
  })
  return games
}

/**
 * Queries match status node to determine match status
 * such as whether or not a game is in progress
 * @param {object} $ - Cheerio accessor
 * @param {string} gameScoreNodeId - Score node element ID
 * @return {object} - match status object
 */
const parseMatchStatusInfo = ($, gameScoreNodeId) => {
  const gameStatusNodes = $(`#${gameScoreNodeId} .gameStatus`)
  const gameStatusNode = gameStatusNodes[0]
  const gameStatus = gameStatusNode.children[0]
  let inProgress = 0

  if (gameStatus.type === 'text') {
    // gameStatus node object represents either
    // current time or full time indicator
    if (gameStatus.data !== 'FT') {
      inProgress = 1
    }
  }

  return {
    inProgress
  }
}

/**
 * This function fires a network request to retrieve all
 * score data for a given date & returns the parsed results 
 * @param {string} dateString - YYYYMMDD formatted date string
 * @return {Promise<object[]>} - Parsed games data 
 */
const requestDataForDate = (dateString) => {
  const uri = `${URL}/${dateString}`
  console.log('REQUESTING: ', uri)
  const options = {
    uri,
    transform: body => cheerio.load(body)
  }
  return requestPromise(options).then(parseDataForDate)
}

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

  // get team name
  const infoNodes = $(`${prefix} .teamLocation`).children()
  let name = infoNodes[0].prev.data
  if (name === 'Korea Republic') {
    name = 'South Korea'
  }
  

  let goalsByHalf = []
  if ($(`${prefix} .periodScore`).length) {
    // periodScore node exists, scrape goals data
    // (periodScore wouldn't exist on games that
    // have not yet been played)
    goalsByHalf = $(`${prefix} .periodScore`)
    if (goalsByHalf[0]) {
      firstHalfGoals = parseInt(
        goalsByHalf[0].children[0].data
      )
    }
    if (goalsByHalf[1]) {
      secondHalfGoals = parseInt(
        goalsByHalf[1].children[0].data
      )
    }
  }

  // integer value if firstHalfGoals & secondHalfGoals
  // are defined, null otherwise
  const finalScore = (
    ((firstHalfGoals >= 0) && (secondHalfGoals >= 0)) ?
    firstHalfGoals + secondHalfGoals : null
  )

  let finalGoalsByHalf = [null, null]
  
  if (firstHalfGoals >= 0 && secondHalfGoals >= 0) {
    finalGoalsByHalf = [firstHalfGoals, secondHalfGoals]
  }
  if (firstHalfGoals >= 0 && secondHalfGoals === undefined) {
    finalGoalsByHalf = [firstHalfGoals, null]
  }

  console.log({
    name,
    finalScore,
    goalsByHalf: finalGoalsByHalf
  })

  return {
    name,
    finalScore,
    goalsByHalf: finalGoalsByHalf
  }
}

/**
 * Async function which iterates over all days in
 * world cup date range and fires a request to
 * any and all game data for each date
 * @param {object} startDate - Moment.js date object
 * @param {object} endDate - Moment.js date object
 * @return {void}
 */
async function makeRequests(
  startDate = moment('2018-06-14'),
  endDate = moment('2018-06-28')
) {
  const dateRange = startDate.twix(endDate)
  const dateRangeIterator = dateRange.iterate('days')
  while (dateRangeIterator.hasNext()) {
    const date = dateRangeIterator.next()
    let dateString = date.format('YYYYMMDD')
    const games = await requestDataForDate(dateString)

    // add games for current date to final matches array
    matches.push(
      ...games.map((game) => {
        return ({
          ...game,
          date: moment(date.format('YYYY-MM-DD')).toDate()
        })
      })
    )
  }

  return matches
}

module.exports = makeRequests
