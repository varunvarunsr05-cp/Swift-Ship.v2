const express = require('express');
const { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getGalleryItems);
router.post('/', protect, authorize('admin'), upload.single('image'), createGalleryItem);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);

module.exports = router;
