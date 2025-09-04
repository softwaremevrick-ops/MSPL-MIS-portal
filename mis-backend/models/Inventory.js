const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    index: true, // Add index to itemName
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  location: {
    type: String,
  },
  // Add other fields relevant to inventory based on frontend components
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
