const jwt = require("jsonwebtoken");

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // If token is valid, redirect user to the profile page
      return res.redirect(`/profile/${decoded.userId}`);
    } catch (error) {
      // If token verification fails (expired or invalid), continue to login/signup
      next();
    }
  } else {
    // If no token, allow access to login/signup
    next();
  }
};

module.exports = redirectIfAuthenticated;
