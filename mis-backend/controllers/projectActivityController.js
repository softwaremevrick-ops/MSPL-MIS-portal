const ProjectActivity = require('../models/ProjectActivity');
const { validationResult } = require('express-validator');

/**
 * @desc Create a new project activity
 * @route POST /api/activities
 * @access Private
 */
const createActivity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { activityName, description, status, project, location } = req.body;

  try {
    const activity = await ProjectActivity.create({
      user: req.user._id, // Assuming user is authenticated and available in req.user
      activityName,
      description,
      status,
      project,
      location,
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all project activities for a user
 * @route GET /api/activities
 * @access Private
 */
const getActivities = async (req, res) => {
  try {
    const activities = await ProjectActivity.find({ user: req.user._id }).populate('user', 'username email');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get a single project activity by ID
 * @route GET /api/activities/:id
 * @access Private
 */
const getActivityById = async (req, res) => {
  try {
    const activity = await ProjectActivity.findById(req.params.id).populate('user', 'username email');
    if (activity && activity.user._id.toString() === req.user._id.toString()) {
      res.status(200).json(activity);
    } else if (activity) {
      res.status(403).json({ message: 'Not authorized to view this activity' });
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update a project activity
 * @route PUT /api/activities/:id
 * @access Private
 */
const updateActivity = async (req, res) => {
  const { activityName, description, status, project, location } = req.body;

  try {
    const activity = await ProjectActivity.findById(req.params.id);

    if (activity && activity.user._id.toString() === req.user._id.toString()) {
      activity.activityName = activityName || activity.activityName;
      activity.description = description || activity.description;
      activity.status = status || activity.status;
      activity.project = project || activity.project;
      activity.location = location || activity.location;

      const updatedActivity = await activity.save();
      res.status(200).json(updatedActivity);
    } else if (activity) {
      res.status(403).json({ message: 'Not authorized to update this activity' });
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete a project activity
 * @route DELETE /api/activities/:id
 * @access Private
 */
const deleteActivity = async (req, res) => {
  try {
    const activity = await ProjectActivity.findById(req.params.id);

    if (activity && activity.user._id.toString() === req.user._id.toString()) {
      await activity.deleteOne();
      res.status(200).json({ message: 'Activity removed' });
    } else if (activity) {
      res.status(403).json({ message: 'Not authorized to delete this activity' });
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
