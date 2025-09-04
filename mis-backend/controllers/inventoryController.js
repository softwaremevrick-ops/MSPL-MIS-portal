const Inventory = require('../models/Inventory');
const { validationResult } = require('express-validator');

/**
 * @desc Create a new inventory item
 * @route POST /api/inventory
 * @access Private/Admin
 */
const createInventoryItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { itemName, quantity, unit, category, location } = req.body;

  try {
    const inventoryItem = await Inventory.create({
      itemName,
      quantity,
      unit,
      category,
      location,
    });
    res.status(201).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all inventory items
 * @route GET /api/inventory
 * @access Private/Admin
 */
const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({});
    res.status(200).json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get a single inventory item by ID
 * @route GET /api/inventory/:id
 * @access Private/Admin
 */
const getInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);
    if (inventoryItem) {
      res.status(200).json(inventoryItem);
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update an inventory item
 * @route PUT /api/inventory/:id
 * @access Private/Admin
 */
const updateInventoryItem = async (req, res) => {
  const { itemName, quantity, unit, category, location } = req.body;

  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (inventoryItem) {
      inventoryItem.itemName = itemName || inventoryItem.itemName;
      inventoryItem.quantity = quantity || inventoryItem.quantity;
      inventoryItem.unit = unit || inventoryItem.unit;
      inventoryItem.category = category || inventoryItem.category;
      inventoryItem.location = location || inventoryItem.location;

      const updatedInventoryItem = await inventoryItem.save();
      res.status(200).json(updatedInventoryItem);
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete an inventory item
 * @route DELETE /api/inventory/:id
 * @access Private/Admin
 */
const deleteInventoryItem = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (inventoryItem) {
      await inventoryItem.deleteOne();
      res.status(200).json({ message: 'Inventory item removed' });
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInventoryItem,
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
};
