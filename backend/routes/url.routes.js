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


router.route('/')
  .post(protect, createShortUrl) 
  .get(protect, getUserUrls);   

router.route('/:id')
  .get(protect, getUrlDetails)
  .put(protect, updateUrl)
  .delete(protect, deleteUrl);

router.get('/:id/stats', protect, getUrlStats); 

module.exports = router;