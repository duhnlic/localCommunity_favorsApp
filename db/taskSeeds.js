const mongoose = require('./connection')

const Task = require('../models/Task')

const taskSeeds = require('./seed.json')

Task.deleteMany({})
	.then(() => {
		Project.insertMany(taskSeeds)
	})
	.then(console.log())
	.catch(console.error)
	.finally(() => {
		process.exit
	})
