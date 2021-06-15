const { Schema, model } = require('mongoose');

const TaskSchema = require('./Task')

const offerSchema = new Schema({
  tasks: [TaskSchema],
})

module.exports = model('Offer', offerSchema)
