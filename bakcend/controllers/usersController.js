const bcrypt = require('bcrypt'); // or 'bcryptjs' if you're using bcryptjs// controllers/usersController.js
const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

// Add a new user (Admin only)
const addUser = async (req, res) => {
  const { first_name, last_name, email, password, roles } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email }).exec();
  if (foundUser) {
    return res.status(401).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    roles: roles || ["user"], // Default to "user" role
  });

  res.status(201).json({ message: 'User created successfully', user });
};

// Update a user (Admin only)
const updateUser = async (req, res) => {
  const { id, first_name, last_name, email, roles } = req.body;

  if (!id || !first_name || !last_name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.first_name = first_name;
  user.last_name = last_name;
  user.email = email;
  user.roles = roles || user.roles;

  await user.save();

  res.json({ message: 'User updated successfully', user });
};

// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params; // Extract id from URL params, not from body

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.json({ message: 'User deleted successfully' });
};


module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};