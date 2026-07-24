const express = require('express');
const router = express.Router();
const { 
    getWeeklyPlan, 
    createWorkoutPlan, 
    toggleExercise, 
    addExercise, 
    deleteExercise, 
    deleteWorkoutPlan,
    getCheckpoints,
    createCheckpoint
} = require('../controllers/fitnessController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/weekly', getWeeklyPlan);
router.post('/plan', createWorkoutPlan);
router.delete('/plan/:plan_id', deleteWorkoutPlan);
router.put('/exercise/:exercise_id/toggle', toggleExercise);
router.post('/exercise', addExercise);
router.delete('/exercise/:exercise_id', deleteExercise);

router.get('/checkpoints', getCheckpoints);
router.post('/checkpoint', createCheckpoint);

module.exports = router;
