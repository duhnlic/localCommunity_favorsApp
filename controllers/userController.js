const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Task = require('../models/Task')
const SECRET = process.env.SECRET_KEY
const { auth, hash } = require('./authController')

router.get('/', (req, res) => {
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

router.get('/:username', (req, res) => {
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

// login route
router.post('/login', (req, res) => {
	const { username, password } = req.body
	const hashedPassword = hash(password)

	User.findOne({ username }, (err, foundUser) => {
		if (err) {
			return res.status(400).json({ msg: err.message })
		}

		if (!foundUser) {
			return res.send({ userFound: false })
		}

		if (bcrypt.compareSync(hashedPassword, foundUser.password)) {
			const token = jwt.sign(
				{
					id: foundUser._id,
					username: foundUser.username,
				},
				SECRET
			)

			return res.status(200).json({
				userFound: true,
				isPasswordValid: true,
				token,
				username: foundUser.username,
			})
		}

		res.send({ userFound: true, isPasswordValid: false })
	})
})

// register
router.post('/register', (req, res) => {
	const passwordHash = hash(req.body.password)
	req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))

	User.create(req.body, (err, createdUser) => {
		if (err) {
			console.log(err)
			res.status(400).json({
				msg: err.message,
			})
		} else {
			const token = jwt.sign(
				{
					id: createdUser._id,
					username: createdUser.username,
				},
				SECRET
			)
			res.status(200).json({
				token,
			})
		}
	})
})

router.post('/addTaskToUser', async (req, res) => {
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

router.post('/addTask/:task/:username', (req, res) => {
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

router.delete('/:username/:task', (req, res) => {
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

module.exports = router
