const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref:'Tasks'}],
    completedTotal: { type: Number }
})
module.exports = model('User', userSchema)