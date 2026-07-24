const express = require('express');
const router = express.Router();
const { 
    getCalendarEvents, 
    createCalendarEvent, 
    toggleCalendarEvent, 
    logFocusSession 
} = require('../controllers/calendarController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/events', getCalendarEvents);
router.post('/events', createCalendarEvent);
router.put('/events/:id/toggle', toggleCalendarEvent);
router.post('/focus-session', logFocusSession);

module.exports = router;
