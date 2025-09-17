// backend/routes/user.routes.js

const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile').put(protect, updateUserProfile);

module.exports = router;