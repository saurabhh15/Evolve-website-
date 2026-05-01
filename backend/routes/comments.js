const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access projectId
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// @route   GET /api/projects/:id/comments
router.get('/', commentController.getComments);

// @route   POST /api/projects/:id/comments
router.post('/', auth, commentController.addComment);

// @route   PUT /api/comments/:commentId
router.put('/:commentId', auth, commentController.editComment);

// @route   DELETE /api/comments/:commentId
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;