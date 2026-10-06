const express = require('express');
const {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
  updateShipmentStatus,
  addTrackingUpdate,
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getShipments);
router.get('/:id', protect, getShipmentById);
router.post('/', protect, createShipment);
router.put('/:id', protect, authorize('admin'), updateShipment);
router.delete('/:id', protect, authorize('admin'), deleteShipment);
router.patch('/:id/status', protect, authorize('admin'), updateShipmentStatus);
router.post('/:id/tracking', protect, authorize('admin'), addTrackingUpdate);

module.exports = router;
