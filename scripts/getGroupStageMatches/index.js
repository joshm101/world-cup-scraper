/**
 * Scrapes world cup group stage data from HTML
 * responses
 */

const requestPromise = require('request-promise-native')
const cheerio = require('cheerio')
const moment = require('moment')
const twix = require('twix')

const URL = 'https://www.cbssports.com/soccer/world-cup/scoreboard'

let days = []

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
  return games
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
    days.push({
      date: date.format('YYYY-MM-DD'),
      games
    })
  }

  console.log('DAYS: ', days)
  console.log('------')
  console.log('------')
  console.log('------')
  days.forEach((day) => {
    console.log(`GAMES ON ${day.date}:`)
    day.games.forEach((game) => {
      console.log(`---- GAME: `, game)
    })
  })
}

module.exports = makeRequests
