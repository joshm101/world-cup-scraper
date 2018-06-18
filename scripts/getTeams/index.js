const requestPromise = require('request-promise-native')
const cheerio = require('cheerio')

const URL = 'https://www.fifa.com/worldcup/teams/'

/**
 * Parse teams from HTML tree loaded into
 * cheerio function param
 * @param {object} $ - Cheerio reference to query HTML elements
 * @return {object[]} - Constructed team objects from
 * parsed HTML
 */
const parseTeams = ($) => {
  const worldCupTeams = $('.fi-team-card__name').toArray()
  const teams = worldCupTeams.map(team =>
    ({
      name: $(team).html().trim()
    })
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
