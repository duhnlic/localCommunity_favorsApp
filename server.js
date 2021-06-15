if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT

//database and middleware
app.use(express.json())
app.use((req, res, next) => {
	next()
})
app.use(cors())

app.use('/tasks', require('./controllers/taskController'))
app.use('/users', require('./controllers/userController'))

app.get('/', (req, res) => {
	res.send(
		`<h1>Helping Hands: Task Helper Application Backend</h1><h3>created by Group 3</h3>`
	)
})

app.listen(PORT, () => console.log('Hello! I am here on PORT: ', PORT))
