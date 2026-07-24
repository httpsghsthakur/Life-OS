const express = require('express');
const router = express.Router();
const { submitForReview, submitReview, getPendingReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/submit', submitForReview);
router.post('/evaluate/:request_id', submitReview);
router.get('/pending', getPendingReviews);

module.exports = router;
