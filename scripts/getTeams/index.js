const requestPromise = require('request-promise-native')
const cheerio = require('cheerio')

const URL = 'https://www.fifa.com/worldcup/teams/'

/**
 * Parse team from HTML tree loaded into
 * cheerio function param
 * @param {object} $ - Cheerio reference to query HTML elements
 * @return {object} - Parsed team data in an object
 */
const parseTeam = ($) => {
  let name = $('.fi-team-card__name').html().trim()
  
  // handle data source team name edge case
  if (name === 'IR Iran') {
    // Iran team stored as "IR Iran" on fifa.com, 
    // set name to Iran
    name = 'Iran'
  }
  const logo = $('.fi-team-card__flag img').attr().src
  return {
    name,
    logo
  }
}

/**
 * Parse teams from HTML tree loaded into
 * cheerio function param
 * @param {object} $ - Cheerio reference to query HTML elements
 * @return {object[]} - Constructed team objects from
 * parsed HTML
 */
const parseTeams = ($) => {
  const worldCupTeams = $('.fi-team-card__team').toArray()
  const teams = worldCupTeams.map(team =>
    parseTeam(
      cheerio.load($(team).html())
    )
  )
  return teams
}

/**
 * Fires a network request to retrieve world cup
 * teams and uses parseTeams to parse team info.
 * @return {Promise<object[]>} Parsed team data array
 * within the context of a Promise
 */
const makeRequest = () => {
  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  }
  return requestPromise(options).then(parseTeams)
}

/**
 * Async function to initiate team data retrieval
 * @return {object[]} - Parsed team data
 */
async function retrieveData() {
  const teams = await makeRequest()
  return teams
}

module.exports = retrieveData
