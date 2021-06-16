const express = require('express')
const router = express.Router()
const Offer = require('../models/Offer')
const { auth } = require('./authController')

// Index
router.get('/', async (req, res) => {
	let filters
	if (Object.keys(req.query).length > 0) {
		filters = { ...req.query }
	}
	try {
		if (!filters) {
			const foundOffers = await Offer.find({})
			res.status(200).json(foundTasks)
		} else {
			const foundOffers = await Offer.find({ ...filters })
			res.status(200).json(foundOffers)
		}
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
// Create
router.post('/', async (req, res) => {
	try {
		const createdOffers = await Offer.create(req.body)
		res.status(200).json(createdOffers)
	} catch (err) {
		res.status(400).json({
			msg: err.message,
		})
	}
})
// Read
router.get('/:id', async (req, res) => {
	try {
		const foundOffers = await Offer.findById(req.params.id)
		res.status(200).json(foundOffers)
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
// Update
router.put('/:id', async (req, res) => {
	try {
		const updatedOffers = await Offer.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		)
		res.status(200).json(updatedOffers)
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})
// Delete
router.delete('/:id', async (req, res) => {
	try {
		const deletedOffers = await Offer.findByIdAndDelete(req.params.id)
		res.status(200).json(deletedOffers)
	} catch (error) {
		res.status(400).json({
			msg: error.message,
		})
	}
})

module.exports = router
