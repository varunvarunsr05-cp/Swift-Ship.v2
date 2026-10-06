const mongoose = require('mongoose');

const trackingUpdateSchema = new mongoose.Schema(
  {
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    status: {
      type: String,
      enum: ['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'exception'],
      required: true,
    },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    remarks: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

trackingUpdateSchema.index({ shipmentId: 1, timestamp: -1 });

module.exports = mongoose.model('TrackingUpdate', trackingUpdateSchema);
