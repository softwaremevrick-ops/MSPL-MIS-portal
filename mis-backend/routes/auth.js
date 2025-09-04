const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('username', 'Please enter a username with 3 or more characters').isLength({ min: 3 }),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    body('role', 'Role is required').not().isEmpty(),
  ],
  registerUser
);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').not().isEmpty(),
  ],
  loginUser
);

/**
 * @route GET /api/auth/me
 * @desc Get current user data
 * @access Private
 */
router.get('/me', protect, getMe);

module.exports = router;
