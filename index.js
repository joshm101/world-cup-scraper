const CronJob = require('cron').CronJob

const getGroupStageMatches = require('./scripts/getGroupStageMatches')
const initDatabase = require('./scripts/initDatabase')
const writeGroupStageMatches = require('./scripts/writeGroupStageMatches')
const utils = require('./utils')

const app = () => {
  const { generateLogBlock } = utils
  if (process.env.INIT_DB) {
    try {
      generateLogBlock('Initializing DB...')
      initDatabase().then(() => {
        generateLogBlock(
          'Successfully initialized the DB.'
        )
      })
    } catch (error) {
      console.error('-- DB initialization error --')
      console.error(error)
    }
  } else {
    const job = new CronJob('*/5 * * * *', () => {
      generateLogBlock(
        'Retrieving latest group stage match data...'
      )
      getGroupStageMatches().then((matches) => {
        generateLogBlock(
          'Latest group stage match data successfully retrieved.'
        )
        generateLogBlock(
          'Writing latest group stage match data to DB...'
        )
        return writeGroupStageMatches(
          matches
        ).then(() => {
          generateLogBlock(
            'Latest group stage match data successfully written to DB.'
          )
        }).catch((error) => {
          console.error('-- DB WRITE ERROR --')
          console.error(error)
        })
      }).catch((error) => {
        console.error('-- DATA RETRIEVAL ERROR --')
        console.error(error)
      })
    }, null, true)
  }
}

module.exports = app
