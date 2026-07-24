const express = require('express');
const router = express.Router();
const { 
    createChallenge, 
    getChallenges, 
    getChallenge, 
    deleteChallenge,
    addMilestone,
    deleteMilestone
} = require('../controllers/challengeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Protect all routes

router.post('/', createChallenge);
router.get('/', getChallenges);
router.get('/:id', getChallenge);
router.delete('/:id', deleteChallenge);
router.post('/milestone', addMilestone);
router.delete('/milestone/:id', deleteMilestone);

module.exports = router;
