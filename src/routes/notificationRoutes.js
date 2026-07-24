const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', getNotifications);
router.post('/:id/read', markRead);
router.post('/read-all', markAllRead);

module.exports = router;
