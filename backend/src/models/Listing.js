const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    image: {
      key: { type: String, default: null },
      url: { type: String, default: null }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    coordinate: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number]
      }
    }
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
