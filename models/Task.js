const { Schema, model } = require('../db/connection')

const taskSchema = new Schema({
	type: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: String,
	creationDate: { type: Date, default: Date.now },
	dueDate: Date,
	completed: {
		type: Boolean,
		default: false,
	},
	createdBy: String,
})

module.exports = model('Task', taskSchema)
