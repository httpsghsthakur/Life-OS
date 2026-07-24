const express = require('express');
const router = express.Router();
const { getNotes, createNote, getGraphData } = require('../controllers/knowledgeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/notes', getNotes);
router.post('/notes', createNote);
router.get('/graph', getGraphData);

module.exports = router;
