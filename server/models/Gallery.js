const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
    title: { type: String, default: '' },
    url: { type: String, required: true },
    type: { type: String, enum: ['banner', 'gallery', 'package', 'label', 'proof', 'other'], default: 'other' },
    caption: { type: String, default: '' },
    link: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'scheduled'], default: 'active' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
