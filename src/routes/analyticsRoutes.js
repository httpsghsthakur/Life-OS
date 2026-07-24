const express = require('express');
const router = express.Router();
const { getSummary, getHeatmap, getLeaderboard, getBadges, backfillDummyData, getTimeSeriesData } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/timeseries', getTimeSeriesData);
router.get('/heatmap', getHeatmap);
router.get('/leaderboard', getLeaderboard);
router.get('/badges', getBadges);
router.post('/backfill', backfillDummyData);

module.exports = router;
