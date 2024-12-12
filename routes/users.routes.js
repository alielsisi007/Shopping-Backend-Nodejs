import express from "express";
import bcrypt from "bcrypt";
import Users from "../models/users.model.js";
import generateToken from "../utils/Token.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
const usersRoutes = express.Router();

// Register route
usersRoutes.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "buyer", image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required (name, email, password)",
        success: false,
      });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      role,
      image,
    });
    await newUser.save();

    res.status(201).json({
      message: "Registered successfully",
      success: true,
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Login route
usersRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await Users.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, role: user.role },
  });
});

// Delete User (only for admins)
usersRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"), // تحقق من أن المستخدم لديه دور "admin"
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid ID format", success: false });
      }

      const deletedUser = await Users.findByIdAndDelete(id);

      if (!deletedUser) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      res.status(200).json({
        message: "User deleted successfully",
        success: true,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", success: false });
    }
  }
);

export default usersRoutes;
