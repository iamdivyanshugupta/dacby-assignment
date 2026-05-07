const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/auth/me', protect, getMe);

router.post('/auth/register', register);
router.post('/auth/login', login);

module.exports = router;