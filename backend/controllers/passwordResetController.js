const { User } = require("../models");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.handlePasswordReset = async (req, res) => {
  try {
    const { email, newPassword, token } = req.body;

    // 1. Password Reset Request (when email is provided)
    if (email && !newPassword && !token) {
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(404).send("User not found");

      // Create JWT token with expiration of 10 minutes
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        },
      );

      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

      // Send password reset email
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });

      return res.send("Password reset link sent to your email.");
    }

    // 2. Password Reset Update (when token and newPassword are provided)
    if (token && newPassword) {
      console.log("inside password update", token);
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token
      const user = await User.findByPk(decoded.userId);
      if (!user) return res.status(404).send("User not found");

      // Update the user's password
      user.password = await argon2.hash(newPassword); // Hash the new password before saving
      await user.save();

      return res.send("Password has been successfully reset.");
    }

    // If neither of the above conditions are met, return a bad request
    return res.status(400).send("Invalid request. Please provide valid data.");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .send("Token has expired. Please request a new password reset.");
    }
    console.error("Error handling password reset:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
};
