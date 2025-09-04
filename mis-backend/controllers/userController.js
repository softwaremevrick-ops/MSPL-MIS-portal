const User = require('../models/User');

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get single user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update user by ID
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
const updateUser = async (req, res) => {
  const { username, email, role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;

      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete user by ID
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.status(200).json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
