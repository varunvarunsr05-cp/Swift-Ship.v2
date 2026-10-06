const mongoose = require('mongoose');

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trackingNumber: { type: String, required: true, unique: true, uppercase: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    sender: { type: partySchema, required: true },
    receiver: { type: partySchema, required: true },
    packageType: { type: String, default: 'Parcel' },
    weight: { type: Number, required: true },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    pickupDate: { type: Date, required: true },
    preferredTimeSlot: { type: String, default: '' },
    specialInstructions: { type: String, default: '' },
    status: {
      type: String,
      enum: ['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'booked',
    },
    estimatedDelivery: { type: Date },
    currentLocation: { type: String, default: '' },
  },
  { timestamps: true }
);

shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ userId: 1 });
shipmentSchema.index({ status: 1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
