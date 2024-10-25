const express = require("express");
const {
  register,
  verifyEmail,
  login,
  verifyToken,
  logout,
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
router.post("/logout", logout);

module.exports = router;
