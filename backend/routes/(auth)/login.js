const express = require('express')
const User = require('../../models/userModel')
const sendEmail = require('../../utils/email/email')
const router = express.Router()

router.get('/', async (req, res) => {
  sendEmail()
  res.send('login route')
})

// Create an User
router.post('/', async (req, res) => {
  const { email, password } = req.body
  // Check => If User Exists
  const existingUser = await User.findOne({ email })
  // If User Doesn't Exists => then return message
  if (!existingUser) {
    return res.status(401).json("User Doesn't Exists")
  }

  // If User Exists => then compare the password using method created in Schema
  const isMatch = await existingUser.comparePassword(password)
  if (!isMatch) {
    return res.status(401).json('Inavlid Password')
  }

  // If Password is matched then create the JWT token
  const token = existingUser.generateAuthToken()
  res.json({ token })
})

module.exports = router
