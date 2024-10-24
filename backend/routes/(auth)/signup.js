const express = require('express')
const User = require('../../models/userModel')
const router = express.Router()

router.get('/', async (req, res) => {
  res.send('login route')
})

// Create an User
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body

  try {
    const existingUser = await User.findOne({
      email,
    })

    if (existingUser) {
      return res.status(400).json('User already exists')
    }

    const userObj = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    })

    const result = await userObj.save()
    return res.status(200).json(result)
  } catch (err) {
    console.log('errorIs', err)
    return res.status(400).json(err.message)
  }
})

module.exports = router
