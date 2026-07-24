const express = require('express');
const router = express.Router();
const { getPenaltyAuditLog, triggerMissPenalty, applyGraceDayToken } = require('../controllers/penaltyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/audit-log', getPenaltyAuditLog);
router.post('/trigger-penalty', triggerMissPenalty);
router.post('/grace-token', applyGraceDayToken);

module.exports = router;
