// backend/routes/url.routes.js

const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getUserUrls,
  getUrlDetails,
  updateUrl,
  deleteUrl,
  getUrlStats,
} = require('../controllers/url.controller');
const { protect } = require('../middleware/auth.middleware');

// All these routes are protected and require a valid JWT
router.route('/')
  .post(protect, createShortUrl) // Create a new short URL
  .get(protect, getUserUrls);   // Get all URLs for the logged-in user

router.route('/:id')
  .get(protect, getUrlDetails)  // Get details for a specific URL
  .put(protect, updateUrl)      // Update a URL
  .delete(protect, deleteUrl);  // Delete a URL

router.get('/:id/stats', protect, getUrlStats); // Get detailed stats for a URL

module.exports = router;