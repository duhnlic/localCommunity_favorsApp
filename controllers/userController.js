const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tasks = require('../models/Tasks');
const { auth } = require('./authController');




router.get('/', auth, (req, res) => {
    console.log(res.locals)
    const userQuery = User.find({}).select('-password').populate('stations') 
    userQuery.exec((err, foundUsers) => {
        if (err){
            console.log(err);
            res.status(401).json({ msg: err.message });
        } else {
           res.status(200).json(foundUsers) 
        }
    })
 })

 router.post('/addTasksToUser', auth, async (req, res) =>{
    console.log(res.locals)
    const tasks = await Tasks.create(req.body)
    const addTasksQuery = User.findOneAndUpdate({ username: res.locals.user }, { $addToSet: { tasks: tasks }}, {new: true})
    addTasksQuery.exec((err) => {
        if (err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            res.status(200).json({
                msg: `Updated ${res.locals.user} with ${tasks.name}`
            })
        }
    })
})

router.post('/addTasks/:tasks/:username', auth, (req, res) =>{
    const tasksQuery = Tasks.findOne({ _id: req.params.tasks })
    tasksQuery.exec(( err, tasks ) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addTasksQuery = User.findOneAndUpdate({ username: req.params.username }, { $addToSet: { tasks: tasks._id }}, {new: true})
            addTasksQuery.exec((err, updatedUser) => {
                if(err){
                    res.status(400).json({
                        msg: err.message
                    }) 
                } else {
                    console.log(updatedUser);
                    res.status(200).json({
                        msg: `Updated ${updatedUser.username} with ${tasks.name} `
                    })
                }
            })
        }
    })
})


router.delete('/:username/:tasks', auth, (req, res) => {
    const deletedTasks = User.findOneAndUpdate({username: req.params.username}, {$pull: { tasks: req.params.tasks}});
    console.log(deletedTasks)
    deletedTasks.exec((error, deletedTasks) => {
        if(error) {
            res.status(400).json({
                msg: error.message
            })
        } else {
            res.status(200).json(deletedTasks);
        }
    })
})




 router.get('/:username', auth, (req, res) => {
    const userQuery = User.findOne({ username: req.params.username.toLowerCase() }).select('-password').populate('tasks')
    userQuery.exec((err, foundUser) => {
        if (err) {
           res.status(400).json({
               msg: err.message
           }) 
        } else {
            res.status(200).json(foundUser)
        }
    })
})


module.exports = router