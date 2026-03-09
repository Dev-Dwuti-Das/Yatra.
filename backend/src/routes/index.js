const express = require('express');
const authRoutes = require('./authRoutes');
const listingRoutes = require('./listingRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API healthy' });
});

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);

module.exports = router;

