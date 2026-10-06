const express = require('express');
const { trackByNumber, listTrackingUpdates } = require('../controllers/trackingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), listTrackingUpdates);
router.get('/:trackingNumber', trackByNumber);

module.exports = router;
