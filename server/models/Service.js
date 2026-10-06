const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Service name is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    deliveryTime: { type: String, required: [true, 'Delivery time is required'] },
    estimatedDays: { type: Number, default: 3 },
    basePrice: { type: Number, default: 0 },
    weightLimit: { type: Number, default: 20 },
    icon: { type: String, default: 'package' },
    image: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive', 'under_review'], default: 'active' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
