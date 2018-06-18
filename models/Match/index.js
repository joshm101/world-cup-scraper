const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const MatchSchema = new Schema({
  date: Date,
  homeTeam: ObjectId,
  awayTeam: ObjectId,
  homeTeamGoals: Number,
  awayTeamGoals: Number,
  homeTeamGoalsByHalf: [Number],
  awayTeamGoalsByHalf: [Number]
})

const Match = mongoose.model('Match', MatchSchema)

module.exports = Match
