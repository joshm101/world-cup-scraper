const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const MatchSchema = new Schema({
  date: Date,
  homeTeam: ObjectId,
  awayTeam: ObjectId,
  homeTeamGoalsByHalf: [Number],
  awayTeamGoalsByHalf: [Number],
  inProgress: Number
})

const Match = mongoose.model('Match', MatchSchema)

module.exports = Match
