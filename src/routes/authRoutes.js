const express = require('express');
const router = express.Router();
const { register, login, getProfile, syncProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/sync-profile', syncProfile);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
