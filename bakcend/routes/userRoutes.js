// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");

router.use(verifyJWT);

// Only admins can access these routes
router.route("/")
  .get(verifyRoles('admin'), usersController.getAllUsers)
  .post(verifyRoles('admin'), usersController.addUser) // Add a new user
  .put(verifyRoles('admin'), usersController.updateUser) // Update an existing user
  .delete(verifyRoles('admin'), usersController.deleteUser); // Delete a user

module.exports = router;
