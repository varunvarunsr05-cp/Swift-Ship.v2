const asyncHandler = require('../middleware/asyncHandler');
const Shipment = require('../models/Shipment');
const TrackingUpdate = require('../models/TrackingUpdate');

// @desc Public tracking lookup by tracking number
// @route GET /api/tracking/:trackingNumber
// @access Public
const trackByNumber = asyncHandler(async (req, res) => {
  const trackingNumber = req.params.trackingNumber.toUpperCase().trim();
  const shipment = await Shipment.findOne({ trackingNumber }).populate('serviceId', 'name deliveryTime');

  if (!shipment) {
    res.status(404);
    throw new Error('No shipment found with this tracking number');
  }

  const history = await TrackingUpdate.find({ shipmentId: shipment._id }).sort({ timestamp: -1 });

  res.json({ success: true, data: { shipment, history } });
});

// @desc Admin: list all tracking updates (joined with shipment summary) with filters
// @route GET /api/tracking
// @access Private/Admin
const listTrackingUpdates = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const shipmentQuery = {};
  if (status && status !== 'all') shipmentQuery.status = status;
  if (search) {
    shipmentQuery.$or = [
      { trackingNumber: { $regex: search, $options: 'i' } },
      { 'receiver.name': { $regex: search, $options: 'i' } },
      { currentLocation: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [shipments, total] = await Promise.all([
    Shipment.find(shipmentQuery).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Shipment.countDocuments(shipmentQuery),
  ]);

  res.json({
    success: true,
    data: shipments,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 },
  });
});

module.exports = { trackByNumber, listTrackingUpdates };
