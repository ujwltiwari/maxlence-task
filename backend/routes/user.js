const express = require("express");
const { User } = require("../models");
const paginate = require("../utils/pagination");
const router = express.Router();
const { Op } = require("sequelize");
const argon2 = require("argon2");
const { setCookieAndToken } = require("../controllers/authController");
const { fetchCache } = require("../redis/cache");

// Fetch all users with pagination
router.get("/", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    // const result = await paginate(User, {}, page, pageSize);
    const result = await fetchCache(
      "users",
      () => paginate(User, {}, page, pageSize),
      3600,
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching users", error });
  }
});

// Search users by name
router.get("/search", async (req, res) => {
  const { name, page = 1, pageSize = 10 } = req.query;

  try {
    const result = await fetchCache(name, () =>
      paginate(
        User,
        {
          where: {
            fullName: {
              [Op.startsWith]: `%${name}%`,
            },
          },
        },
        page,
        pageSize,
      ),
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching users by name:", error);
    return res
      .status(500)
      .json({ message: "Error while searching users", error });
  }
});

// Filter users by role
router.get("/role", async (req, res) => {
  const { role, page = 1, pageSize = 10 } = req.query;

  try {
    const result = await paginate(
      User,
      {
        where: { role },
      },
      page,
      pageSize,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error filtering users by role:", error);
    return res
      .status(500)
      .json({ message: "Error while filtering users", error });
  }
});

// Filter users by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findByPk(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error filtering users by role:", error);
    return res
      .status(500)
      .json({ message: "Error while filtering users", error });
  }
});

// Fetch users with pagination by page number (alternative route)
router.get("/page/:pageNumber", async (req, res) => {
  const pageSize = 10;
  const pageNumber = parseInt(req.params.pageNumber);

  try {
    const result = await paginate(User, {}, pageNumber, pageSize);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching paginated users", error });
  }
});

router.put("/:id", async (req, res) => {
  const { fullName, email, password, image } = req.body; // Extract fields from request body
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user fields only if they are provided in the request body
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = await argon2.hash(password);
    if (password !== undefined) user.image = image;

    await user.save(); // Save changes to the database
    setCookieAndToken(user, res);
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res
      .status(500)
      .json({ message: "Error while updating user profile", error });
  }
});

router.delete("/:id", async (req, res) => {
  console.log("delete called", req.params.id);
  const userId = req.params.id;
  try {
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
