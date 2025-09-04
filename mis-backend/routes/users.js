const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private/Admin
 */
router.get('/', protect, authorizeRoles('admin'), getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get single user by ID
 * @access Private/Admin
 */
router.get('/:id', protect, authorizeRoles('admin'), getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Update user by ID
 * @access Private/Admin
 */
router.put('/:id', protect, authorizeRoles('admin'), updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user by ID
 * @access Private/Admin
 */
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
