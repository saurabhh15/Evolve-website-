const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET /api/users/search
router.get('/search', userController.searchUsers);
// @route   GET /api/users/mentors
router.get('/mentors', userController.getMentors);
// @route   GET /api/users/investors (NEW)
router.get('/investors', userController.getInvestors);
// @route   PUT /api/users/profile (update own profile)
router.put('/profile', auth, userController.updateProfile);
// @route   GET /api/users/:id/projects
router.get('/:id/projects', userController.getUserProjects);
// @route   GET /api/users/:id (get user by ID)
router.get('/:id', userController.getUserById);

module.exports = router;