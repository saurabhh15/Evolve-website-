const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackController');

// ---------------------------------------------
// GET /api/feedback/project/:projectId
// Returns all feedback for a specific project
// Public - anyone can read feedback on a project
// ---------------------------------------------
router.get('/project/:projectId', feedbackController.getProjectFeedback);

// ---------------------------------------------
// POST /api/feedback/project/:projectId
// Add feedback to a project
// Auth required - mentors and investors primarily,
// but any authenticated user can leave feedback
// ---------------------------------------------
router.post('/project/:projectId', auth, feedbackController.addFeedback);

// ---------------------------------------------
// PUT /api/feedback/:feedbackId
// Edit your own feedback
// ---------------------------------------------
router.put('/:feedbackId', auth, feedbackController.updateFeedback);

// ---------------------------------------------
// DELETE /api/feedback/:feedbackId
// Author or project owner can delete feedback
// ---------------------------------------------
router.delete('/:feedbackId', auth, feedbackController.deleteFeedback);

module.exports = router;