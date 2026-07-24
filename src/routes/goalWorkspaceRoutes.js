const express = require('express');
const router = express.Router();
const { 
    getGoalWorkspace, 
    updateGoalWorkspace, 
    getGoalAnalytics, 
    generateAIRoadmap 
} = require('../controllers/goalWorkspaceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/:goalId', getGoalWorkspace);
router.put('/:goalId', updateGoalWorkspace);
router.get('/:goalId/analytics', getGoalAnalytics);
router.post('/ai-roadmap', generateAIRoadmap);

module.exports = router;
