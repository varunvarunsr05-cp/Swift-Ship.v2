const asyncHandler = require('../middleware/asyncHandler');
const Shipment = require('../models/Shipment');
const TrackingUpdate = require('../models/TrackingUpdate');
const generateTrackingNumber = require('../utils/generateTrackingNumber');

// @desc Get shipments (admin: all with filters/pagination; customer: own only)
// @route GET /api/shipments
// @access Private
const getShipments = asyncHandler(async (req, res) => {
  const { status, serviceId, search, page = 1, limit = 10, dateFrom, dateTo } = req.query;
  const query = {};

  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }
  if (status && status !== 'all') query.status = status;
  if (serviceId && serviceId !== 'all') query.serviceId = serviceId;
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }
  if (search) {
    query.$or = [
      { trackingNumber: { $regex: search, $options: 'i' } },
      { 'receiver.name': { $regex: search, $options: 'i' } },
      { 'receiver.city': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [shipments, total] = await Promise.all([
    Shipment.find(query)
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Shipment.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: shipments,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 },
  });
});

// @desc Get single shipment by id
// @route GET /api/shipments/:id
// @access Private
const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).populate('serviceId', 'name deliveryTime');
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }
  if (req.user.role !== 'admin' && String(shipment.userId) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to view this shipment');
  }
  const trackingHistory = await TrackingUpdate.find({ shipmentId: shipment._id }).sort({ timestamp: -1 });
  res.json({ success: true, data: { shipment, trackingHistory } });
});

// @desc Create shipment request
// @route POST /api/shipments
// @access Private
const createShipment = asyncHandler(async (req, res) => {
  const { serviceId, sender, receiver, packageType, weight, dimensions, pickupDate, preferredTimeSlot, specialInstructions } = req.body;

  if (!serviceId || !sender || !receiver || !weight || !pickupDate) {
    res.status(400);
    throw new Error('Missing required shipment fields');
  }

  let trackingNumber = generateTrackingNumber();
  // eslint-disable-next-line no-await-in-loop
  while (await Shipment.findOne({ trackingNumber })) {
    trackingNumber = generateTrackingNumber();
  }

  const shipment = await Shipment.create({
    userId: req.user._id,
    trackingNumber,
    serviceId,
    sender,
    receiver,
    packageType,
    weight,
    dimensions,
    pickupDate,
    preferredTimeSlot,
    specialInstructions,
    status: 'booked',
    currentLocation: sender.city || '',
  });

  await TrackingUpdate.create({
    shipmentId: shipment._id,
    status: 'booked',
    location: sender.city || 'Origin',
    description: 'Shipment booked and awaiting pickup.',
  });

  res.status(201).json({ success: true, data: shipment });
});

// @desc Update shipment details
// @route PUT /api/shipments/:id
// @access Private/Admin
const updateShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  const editable = ['sender', 'receiver', 'packageType', 'weight', 'dimensions', 'pickupDate', 'preferredTimeSlot', 'specialInstructions', 'serviceId', 'estimatedDelivery'];
  editable.forEach((f) => {
    if (req.body[f] !== undefined) shipment[f] = req.body[f];
  });

  await shipment.save();
  res.json({ success: true, data: shipment });
});

// @desc Delete a shipment
// @route DELETE /api/shipments/:id
// @access Private/Admin
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }
  await TrackingUpdate.deleteMany({ shipmentId: shipment._id });
  await shipment.deleteOne();
  res.json({ success: true, message: 'Shipment deleted successfully' });
});

// @desc Update shipment status directly
// @route PATCH /api/shipments/:id/status
// @access Private/Admin
const updateShipmentStatus = asyncHandler(async (req, res) => {
  const { status, location, remarks } = req.body;
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }
  shipment.status = status;
  if (location) shipment.currentLocation = location;
  await shipment.save();

  await TrackingUpdate.create({
    shipmentId: shipment._id,
    status,
    location: location || shipment.currentLocation || 'Unknown',
    remarks,
  });

  res.json({ success: true, data: shipment });
});

// @desc Add a tracking update to a shipment (also syncs shipment.status)
// @route POST /api/shipments/:id/tracking
// @access Private/Admin
const addTrackingUpdate = asyncHandler(async (req, res) => {
  const { status, location, description, remarks, timestamp } = req.body;
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }
  if (!status || !location) {
    res.status(400);
    throw new Error('Status and location are required for a tracking update');
  }

  const update = await TrackingUpdate.create({
    shipmentId: shipment._id,
    status,
    location,
    description,
    remarks,
    timestamp: timestamp || Date.now(),
  });

  if (['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
    shipment.status = status;
  }
  shipment.currentLocation = location;
  await shipment.save();

  res.status(201).json({ success: true, data: update });
});

module.exports = {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
  updateShipmentStatus,
  addTrackingUpdate,
};
