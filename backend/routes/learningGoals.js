const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/learningGoalController');

router.get('/', auth, controller.getGoals);
router.post('/', auth, controller.addGoal);
router.delete('/:id', auth, controller.deleteGoal);

module.exports = router;