const express = require("express");
const router = express.Router();
const { User } = require("../../models");
router.get("/", async (req, res) => {
  res.send("login route");
});

// Create an User
router.post("/", async (req, res) => {
  const { fullName, email, password, role, image } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json("User already exists");
  }
  const result = await User.create({
    fullName,
    email,
    password,
    role,
    image,
  }).catch((error) => {
    console.log("error", error);
  });
  console.log("result", result);
  return res.status(201).json({ result });
});

module.exports = router;
