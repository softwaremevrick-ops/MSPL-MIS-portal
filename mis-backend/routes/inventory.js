const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createInventoryItem,
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');
const { body } = require('express-validator');

/**
 * @route POST /api/inventory
 * @desc Create a new inventory item
 * @access Private/Admin
 */
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  [
    body('itemName', 'Item name is required').not().isEmpty(),
    body('quantity', 'Quantity must be a number').isNumeric(),
    body('unit', 'Unit is required').not().isEmpty(),
  ],
  createInventoryItem
);

/**
 * @route GET /api/inventory
 * @desc Get all inventory items
 * @access Private/Admin
 */
router.get('/', protect, authorizeRoles('admin', 'userType1', 'userType2'), getInventoryItems);

/**
 * @route GET /api/inventory/:id
 * @desc Get a single inventory item by ID
 * @access Private/Admin
 */
router.get('/:id', protect, authorizeRoles('admin', 'userType1', 'userType2'), getInventoryItemById);

/**
 * @route PUT /api/inventory/:id
 * @desc Update an inventory item
 * @access Private/Admin
 */
router.put('/:id', protect, authorizeRoles('admin'), updateInventoryItem);

/**
 * @route DELETE /api/inventory/:id
 * @desc Delete an inventory item
 * @access Private/Admin
 */
router.delete('/:id', protect, authorizeRoles('admin'), deleteInventoryItem);

module.exports = router;
