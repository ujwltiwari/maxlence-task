const express = require("express");
const {
  register,
  verifyEmail,
  login,
  verifyToken,
} = require("../../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.get("/verifyToken", verifyToken);

module.exports = router;
