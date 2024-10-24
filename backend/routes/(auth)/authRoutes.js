const express = require("express");
const {
  register,
  verifyEmail,
  login,
  verifyToken,
} = require("../../controllers/authController");
const {
  handlePasswordReset,
} = require("../../controllers/passwordResetController");
const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.get("/verifyToken", verifyToken);
router.post("/reset-password", handlePasswordReset);

module.exports = router;
