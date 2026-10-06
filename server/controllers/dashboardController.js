const asyncHandler = require('../middleware/asyncHandler');
const Shipment = require('../models/Shipment');
const User = require('../models/User');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');

// @desc Admin dashboard summary stats + 7-day overview + recent shipments
// @route GET /api/dashboard
// @access Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [total, delivered, inTransit, pickedUp, cancelled, outForDelivery, booked, customers, totalServices, activeServices, totalImages] =
    await Promise.all([
      Shipment.countDocuments(),
      Shipment.countDocuments({ status: 'delivered' }),
      Shipment.countDocuments({ status: 'in_transit' }),
      Shipment.countDocuments({ status: 'picked_up' }),
      Shipment.countDocuments({ status: 'cancelled' }),
      Shipment.countDocuments({ status: 'out_for_delivery' }),
      Shipment.countDocuments({ status: 'booked' }),
      User.countDocuments({ role: 'customer' }),
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Gallery.countDocuments(),
    ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const overviewAgg = await Shipment.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
        inTransit: { $sum: { $cond: [{ $eq: ['$status', 'in_transit'] }, 1, 0] } },
        pickedUp: { $sum: { $cond: [{ $eq: ['$status', 'picked_up'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const recentShipments = await Shipment.find().sort({ createdAt: -1 }).limit(5).select('trackingNumber receiver status createdAt');

  res.json({
    success: true,
    data: {
      stats: {
        totalShipments: total,
        delivered,
        inTransit,
        pickedUp,
        cancelled,
        outForDelivery,
        booked,
        customers,
        totalServices,
        activeServices,
        totalImages,
      },
      overview: overviewAgg.map((d) => ({ date: d._id, delivered: d.delivered, inTransit: d.inTransit, pickedUp: d.pickedUp })),
      recentShipments,
    },
  });
});

module.exports = { getDashboardStats };
