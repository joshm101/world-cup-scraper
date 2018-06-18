const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const MatchSchema = new Schema({
  date: Date,
  teamA: ObjectId,
  teamB: ObjectId,
  teamAGoals: Number,
  teamBGoals: Number,
  teamAGoalsByHalf: [Number],
  teamBGoalsByHalf: [Number]
})

const Match = mongoose.model('Match', MatchSchema)

module.exports = Match
