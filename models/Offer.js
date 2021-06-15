const { Schema, model } = require('../db/connection')

const TaskSchema = require('./Task')

const offerSchema = new Schema({
	tasks: [TaskSchema],
})

module.exports = model('Offer', offerSchema)
