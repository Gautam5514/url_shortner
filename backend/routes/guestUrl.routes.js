// backend/routes/guestUrl.routes.js

const express = require('express');
const router = express.Router();
const { createGuestShortUrl } = require('../controllers/guestUrl.controller');

// This is a public route, no 'protect' middleware is needed
router.post('/shorten', createGuestShortUrl);

module.exports = router;