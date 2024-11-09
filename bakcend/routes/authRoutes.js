const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User authentication routes
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/refresh').get(authController.refresh);
router.route('/logout').post(authController.logout);

// Password reset routes
router.route('/request-reset-password').post(authController.requestPasswordReset);
router.route('/reset-password/:token').put(authController.resetPassword); // Changed from POST to PUT

module.exports = router;
