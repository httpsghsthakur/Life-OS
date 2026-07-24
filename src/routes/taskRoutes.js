const express = require('express');
const router = express.Router();
const { toggleTask, updateTask, createTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', createTask);
router.put('/:id/toggle', toggleTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
