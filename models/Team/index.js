const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const TeamSchema = new Schema({
  name: String,
  logo: String,
  matches: [ObjectId],
  groupStageRecord: ObjectId,
  knockoutStageRecord: ObjectId
})

const Team = mongoose.model('Team', TeamSchema)

module.exports = Team
