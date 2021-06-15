const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    task: { type: String, required: true },

})
module.exports = model('Tasks', userSchema)
