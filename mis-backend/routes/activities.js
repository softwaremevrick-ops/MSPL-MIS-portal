const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} = require('../controllers/projectActivityController');
const { body } = require('express-validator');

/**
 * @route POST /api/activities
 * @desc Create a new project activity
 * @access Private
 */
router.post(
  '/',
  protect,
  [
    body('activityName', 'Activity name is required').not().isEmpty(),
    body('status', 'Status is required').not().isEmpty().isIn(['pending', 'completed', 'in-progress', 'cancelled']), // Validate against enum values
  ],
  createActivity
);

/**
 * @route GET /api/activities
 * @desc Get all project activities for a user
 * @access Private
 */
router.get('/', protect, getActivities);

/**
 * @route GET /api/activities/:id
 * @desc Get a single project activity by ID
 * @access Private
 */
router.get('/:id', protect, getActivityById);

/**
 * @route PUT /api/activities/:id
 * @desc Update a project activity
 * @access Private
 */
router.put('/:id', protect, updateActivity);

/**
 * @route DELETE /api/activities/:id
 * @desc Delete a project activity
 * @access Private
 */
router.delete('/:id', protect, deleteActivity);

module.exports = router;
