const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Task = require('../models/Task')
const { auth } = require('./authController')

router.get('/', auth, (req, res) => {
	console.log(res.locals)
	const userQuery = User.find({}).select('-password').populate('stations')
	userQuery.exec((err, foundUsers) => {
		if (err) {
			console.log(err)
			res.status(401).json({ msg: err.message })
		} else {
			res.status(200).json(foundUsers)
		}
	})
})

router.post('/addTaskToUser', auth, async (req, res) => {
	const task = await Task.create(req.body)
	const addTaskQuery = User.findOneAndUpdate(
		{ username: res.locals.user },
		{ $addToSet: { task: task } },
		{ new: true }
	)
	addTaskQuery.exec((err) => {
		if (err) {
			res.status(400).json({
				msg: err.message,
			})
		} else {
			res.status(200).json({
				msg: `Updated ${res.locals.user} with ${task.name}`,
			})
		}
	})
})

router.post('/addTask/:task/:username', auth, (req, res) => {
	const taskQuery = Task.findOne({ _id: req.params.task })
	taskQuery.exec((err, task) => {
		if (err) {
			res.status(400).json({
				msg: err.message,
			})
		} else {
			const addTaskQuery = User.findOneAndUpdate(
				{ username: req.params.username },
				{ $addToSet: { task: task._id } },
				{ new: true }
			)
			addTaskQuery.exec((err, updatedUser) => {
				if (err) {
					res.status(400).json({
						msg: err.message,
					})
				} else {
					res.status(200).json({
						msg: `Updated ${updatedUser.username} with ${task.name} `,
					})
				}
			})
		}
	})
})

router.delete('/:username/:task', auth, (req, res) => {
	const deletedTask = User.findOneAndUpdate(
		{ username: req.params.username },
		{ $pull: { task: req.params.task } }
	)

	deletedTask.exec((error, deletedTask) => {
		if (error) {
			res.status(400).json({
				msg: error.message,
			})
		} else {
			res.status(200).json(deletedTask)
		}
	})
})

router.get('/:username', auth, (req, res) => {
	const userQuery = User.findOne({
		username: req.params.username.toLowerCase(),
	})
		.select('-password')
		.populate('task')
	userQuery.exec((err, foundUser) => {
		if (err) {
			res.status(400).json({
				msg: err.message,
			})
		} else {
			res.status(200).json(foundUser)
		}
	})
})

module.exports = router
