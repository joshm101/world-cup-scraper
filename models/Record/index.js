const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const RecordSchema = new Schema({
  matches: [ObjectId],
  wins: Number,
  losses: Number,
  draws: Number
})

const Record = mongoose.model('Record', RecordSchema)

module.exports = Record
