const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { singleImage } = require('../middleware/upload');
const {
  createListing,
  listListings,
  getListing
} = require('../controllers/listingController');

const router = express.Router();

router.get('/', asyncHandler(listListings));
router.get('/:id', asyncHandler(getListing));
router.post('/', requireAuth, singleImage('image'), asyncHandler(createListing));

module.exports = router;
