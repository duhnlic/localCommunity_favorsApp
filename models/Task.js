const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
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
},
{
  timestamp: true,
})

module.exports = model('Task', taskSchema)
