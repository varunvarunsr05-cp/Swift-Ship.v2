const asyncHandler = require('../middleware/asyncHandler');
const Service = require('../models/Service');

// @desc Get all services (public: active only unless admin)
// @route GET /api/services
// @access Public
const getServices = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const query = {};

  const isAdmin = req.user && req.user.role === 'admin';
  if (!isAdmin) query.isActive = true;
  if (isAdmin && status && status !== 'all') query.status = status;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const services = await Service.find(query).sort({ createdAt: -1 });
  res.json({ success: true, data: services });
});

// @desc Get single service
// @route GET /api/services/:id
// @access Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, data: service });
});

// @desc Create a service
// @route POST /api/services
// @access Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { name, description, deliveryTime, estimatedDays, basePrice, weightLimit, icon, image, status } = req.body;
  if (!name || !description || !deliveryTime) {
    res.status(400);
    throw new Error('Name, description and delivery time are required');
  }
  const service = await Service.create({
    name,
    description,
    deliveryTime,
    estimatedDays,
    basePrice,
    weightLimit,
    icon,
    image,
    status: status || 'active',
    isActive: (status || 'active') === 'active',
  });
  res.status(201).json({ success: true, data: service });
});

// @desc Update a service
// @route PUT /api/services/:id
// @access Private/Admin
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  const editable = ['name', 'description', 'deliveryTime', 'estimatedDays', 'basePrice', 'weightLimit', 'icon', 'image', 'status'];
  editable.forEach((f) => {
    if (req.body[f] !== undefined) service[f] = req.body[f];
  });
  if (req.body.status) service.isActive = req.body.status === 'active';
  await service.save();
  res.json({ success: true, data: service });
});

// @desc Delete a service
// @route DELETE /api/services/:id
// @access Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted successfully' });
});

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
