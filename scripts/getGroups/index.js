const requestPromise = require('request-promise-native')
const cheerio = require('cheerio')

const URL = 'https://www.bbc.com/sport/football/world-cup/schedule/group-stage'

/**
 * This function parses individual group data from
 * the HTML subtree loaded into the cheerio function
 * param
 * @param {object} $ - Cheerio reference to query HTML elements
 * @return {object} - Group name and teams
 */
const parseGroupData = ($) => {
  const name = $('.group-stage__title').html().trim()

  // construct all teams for the current group
  const teams = $('tbody abbr').toArray().map(element =>
    ({
      name: element.attribs.title,
      abbrevation: $(element.children[0]).html()
    })
  )

  // return final group object consisting of the group's
  // name and teams
  return {
    name,
    teams
  }
}

/**
 * This function parses groups' data from the HTML
 * response loaded into the cheerio function param
 * @param {object} $ - Cheerio reference to query HTML elements
 * @return {object[]} - All groups' data
 */
const parseGroups = ($) => {
  const groupDataElements = $('.group-stage__wrapper .gel-layout__item')

  // iterate over each HTML group element and parse to
  // construct an array of group data objects
  const groups = groupDataElements.toArray().map(element =>
    parseGroupData(
      cheerio.load(
        $(element).html()
      )
    )
  )
  return groups
}

/**
 * Fires a network request to retrieve world cup group
 * data information and uses parseGroups to parse
 * the relevent group information
 * @return {Promise<object[]>} - Parsed group data array
 * within the context of a promise
 */
const makeRequest = () => {
  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  }
  return requestPromise(options).then(parseGroups)
}

/**
 * Async function to initiate group data retrieval
 * @return {object[]} - Parsed group data array
 */
async function retrieveData() {
  const groupData = await makeRequest()
  console.log('GROUP DATA: ', groupData)
  return groupData
}

module.exports = retrieveData
