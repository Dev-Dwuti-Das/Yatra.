const Joi = require('joi');
const Listing = require('../models/Listing');
require('../models/Review');
const ApiError = require('../utils/apiError');
const { createStorageService } = require('../services/storage');

const storage = createStorageService();

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').default(''),
  price: Joi.number().positive().required(),
  location: Joi.string().required(),
  country: Joi.string().required()
});

async function createListing(req, res) {
  const { error, value } = listingSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  let image = { key: null, url: null };

  if (req.file) {
    const uploaded = await storage.upload({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname
    });
    image = { key: uploaded.key, url: uploaded.url };
  }

  const listing = await Listing.create({
    ...value,
    image,
    owner: req.user.id
  });

  return res.status(201).json({
    success: true,
    message: 'Listing created',
    data: listing
  });
}

async function listListings(_req, res) {
  const listings = await Listing.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: listings });
}

async function getListing(req, res) {
  const listing = await Listing.findById(req.params.id)
    .populate('owner', 'username email')
    .populate({
      path: 'review',
      populate: { path: 'author', select: 'username email' }
    });

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  return res.status(200).json({ success: true, data: listing });
}

module.exports = { createListing, listListings, getListing };
