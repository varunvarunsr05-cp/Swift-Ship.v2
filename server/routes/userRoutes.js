const express = require('express');
const { getUsers, toggleUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.patch('/:id/status', protect, authorize('admin'), toggleUserStatus);

module.exports = router;
