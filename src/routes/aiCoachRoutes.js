const express = require('express');
const router = express.Router();
const { getBriefing, queryCoach } = require('../controllers/aiCoachController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/briefing', getBriefing);
router.post('/query', queryCoach);

module.exports = router;
