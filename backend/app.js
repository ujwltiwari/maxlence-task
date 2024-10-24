const express = require('express')
const connectDB = require('./lib/db')
const cors = require('cors')
const PORT = 3000
const app = express()
connectDB()
// Middleware to parse JSON
app.use(express.json())
app.use(cors())
const loginRoute = require('./routes/(auth)/login')
const signUpRoute = require('./routes/(auth)/signup')

app.get('/', (req, res) => {
  res.send('Basic Route Called')
})

app.use('/login', loginRoute)
app.use('/signup', signUpRoute)

app.listen(PORT, () => {
  console.log(`Server is Started At: ${PORT}`)
})
