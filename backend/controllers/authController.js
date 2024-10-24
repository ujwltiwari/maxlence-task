const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User } = require("../models");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register User
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, image } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }
    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      image,
    }).catch((error) => {
      console.log("error", error);
    });
    // Send verification email
    const verificationToken = jwt.sign(
      { userId: user.id, type: "signup" }, // userId is encoded as unique identifier
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );
    const verificationUrl = `http://localhost:3000/api/auth/verify/${verificationToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking the link: <a href="${verificationUrl}">Verify Email</a></p>`,
    });

    res.status(201).json({
      message:
        "User registered. Please check your email for verification link.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token, type } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode userId from jwt
    const user = await User.findByPk(decoded.userId); // verify user using decoded userId
    console.log("verify user", decoded);
    if (user && decoded.type === "signup") {
      user.isVerified = true;
      await user.save();
      setCookieAndToken(user, res);
      // Redirect to user's profile page
      res.redirect(`http://localhost:5173`);
    } else if (user && decoded.type === "login") {
      setCookieAndToken(user, res);
      // Redirect to user's profile page
      res.redirect(`http://localhost:5173`);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    console.log("user", user);
    if (!user || !user.isVerified) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or email not verified." });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // generate token for login verification
    const verificationToken = jwt.sign(
      { userId: user.id, type: "login" },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const verificationUrl = `http://localhost:3000/api/auth/verify/${verificationToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Login Verification Link",
      html: `<p>Please verify your login by clicking the link: <a href="${verificationUrl}">Verify Login</a></p>`,
    });

    res.status(201).json({
      message: "Verification Email sent for Login",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyToken = (req, res) => {
  console.log("verifyToken called", req.headers.authorization?.split(" ")[1]);
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // if token doesn't exists => return from here
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is invalid, this line won't be reached
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Prepare user payload with userId and email
    const userPayload = {
      userId: decoded.userId, // Ensure that the correct key is used based on how the token was created
      email: decoded.email,
    };

    // Respond with user information
    res.status(200).json(userPayload);
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

const setCookieAndToken = (user, res) => {
  const accessToken = jwt.sign(
    { userId: user, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set access token in a cookie
  res.cookie("token", accessToken, {
    // httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
  });

  // Set refresh token in a separate cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true, // Set to true in production
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });
};