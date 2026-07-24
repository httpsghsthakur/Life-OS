const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const examController = require('../controllers/examModeController');

// All exam routes require authentication
router.use(authMiddleware);

// Activate & Deactivate & New Exam
router.post('/activate', examController.activateExamMode);
router.post('/deactivate', examController.deactivateExamMode);
router.post('/new-session', examController.startNewExamSession);

// Dashboard
router.get('/dashboard', examController.getDashboard);

// CRUD
router.post('/subjects', examController.createSubject);
router.put('/subjects/:subjectId/complete', examController.completeSubject);
router.post('/topics', examController.createTopic);
router.put('/topics/:topicId/toggle', examController.toggleTopic);
router.post('/study-logs', examController.logStudySession);
router.post('/mock-tests', examController.logMockTest);

module.exports = router;
