const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const { auth } = require('./authController')

// Index
// router.get('/', auth, async (req, res) => {
router.get('/', async (req, res) => {
	let filters
	if (Object.keys(req.query).length > 0) {
		filters = { ...req.query }
	}
	try {
		if (!filters) {
			const foundTasks = await Task.find({})
			res.status(200).json(foundTasks)
		} else {
			const foundTasks = await Task.find({ ...filters })
			res.status(200).json(foundTasks)
		}
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
// Create
// router.post('/', auth, async (req, res) => {
router.post('/', async (req, res) => {
	try {
		const createdTasks = await Task.create(req.body)
		res.status(200).json(createdTasks)
	} catch (err) {
		res.status(400).json({
			msg: err.message,
		})
	}
})
// Read
// router.get('/:type', auth, async (req, res) => {
router.get('/:type', async (req, res) => {
	try {
		const foundTasks = await Task.findOne({ type: req.params.type })
		res.status(200).json(foundTasks)
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
// Update
// router.put('/:id', auth, async (req, res) => {
router.put('/:id', async (req, res) => {
	try {
		const updatedTasks = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		res.status(200).json(updatedTasks)
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
// Delete
// router.delete('/:id', auth, async (req, res) => {
router.delete('/:id', async (req, res) => {
	try {
		const deletedTasks = await Task.findByIdAndDelete(req.params.id)
		res.status(200).json(deletedTasks)
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
module.exports = router
