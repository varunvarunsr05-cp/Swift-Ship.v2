const asyncHandler = require('../middleware/asyncHandler');
const Gallery = require('../models/Gallery');

// @desc Get gallery/content items
// @route GET /api/gallery
// @access Public
const getGalleryItems = asyncHandler(async (req, res) => {
  const { type, status } = req.query;
  const query = {};
  if (type) query.type = type;
  if (status && status !== 'all') query.status = status;
  else if (!req.user || req.user.role !== 'admin') query.status = 'active';

  const items = await Gallery.find(query).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, data: items });
});

// @desc Upload/create a gallery or banner item
// @route POST /api/gallery
// @access Private/Admin
const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, url, type, caption, link, displayOrder, status } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : url;

  if (!imageUrl) {
    res.status(400);
    throw new Error('An image file or URL is required');
  }

  const item = await Gallery.create({
    title,
    url: imageUrl,
    type: type || 'other',
    caption,
    link,
    displayOrder: displayOrder || 0,
    status: status || 'active',
    uploadedBy: req.user._id,
  });

  res.status(201).json({ success: true, data: item });
});

// @desc Update a gallery item
// @route PUT /api/gallery/:id
// @access Private/Admin
const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Content item not found');
  }
  const editable = ['title', 'caption', 'link', 'displayOrder', 'status', 'type'];
  editable.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });
  if (req.file) item.url = `/uploads/${req.file.filename}`;
  await item.save();
  res.json({ success: true, data: item });
});

// @desc Delete a gallery item
// @route DELETE /api/gallery/:id
// @access Private/Admin
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Content item not found');
  }
  await item.deleteOne();
  res.json({ success: true, message: 'Content item deleted successfully' });
});

module.exports = { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem };
