const request = require('request')
const cheerio = require('cheerio')

request('https://www.cbssports.com/soccer/world-cup/scoreboard/20180614', (err, res, body) => {
  const $ = cheerio.load(body)
  console.log($('.homeTeam .finalScore').text())
  console.log($('.awayTeam .finalScore').text())
  console.log($('.homeTeam .teamLogo').attr().src)
  console.log($('.awayTeam .teamLogo').attr().src)
  console.log($('.homeTeam .teamLocation').children()[0].prev.data)
  console.log($('.homeTeam .teamLocation').children()[0].children[0].data)
  console.log($('.awayTeam .teamLocation').children()[0].prev.data)
  console.log($('.awayTeam .teamLocation').children()[0].children[0].data)
})