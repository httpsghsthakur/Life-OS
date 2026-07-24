const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, logHours, addSkill, addXP } = require('../controllers/devController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/log-hours', logHours);
router.post('/skills', addSkill);
router.post('/skills/:skill_id/xp', addXP);

module.exports = router;
