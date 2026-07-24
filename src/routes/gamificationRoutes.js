const express = require('express');
const router = express.Router();
const { getProgressionStats, awardXP } = require('../controllers/gamificationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/stats', getProgressionStats);
router.post('/award-xp', awardXP);

module.exports = router;
