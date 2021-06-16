const { Schema, model } = require('../db/connection')

const userSchema = new Schema({
	profileIcon: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
	offers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
	completedTotal: { type: Number },
})

module.exports = model('User', userSchema)
