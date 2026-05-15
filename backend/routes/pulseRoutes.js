// routes/pulseRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pulseController = require('../controllers/pulseController');

// ---------------------------------------------
// Pulse Posts Routes
// ---------------------------------------------
router.get('/', pulseController.getGlobalFeed);
router.get('/stats', pulseController.getStats);
router.get('/:postId', pulseController.getPostById);
router.post('/', auth, pulseController.createPost);
router.put('/:postId', auth, pulseController.updatePost);
router.delete('/:postId', auth, pulseController.deletePost);

// ---------------------------------------------
// Post Actions Routes
// ---------------------------------------------
router.post('/:postId/upvote', auth, pulseController.toggleUpvote);
router.post('/:postId/resolve', auth, pulseController.resolvePost);

// ---------------------------------------------
// Replies Routes
// ---------------------------------------------
router.post('/:postId/replies', auth, pulseController.addReply);
router.put('/:postId/replies/:replyId', auth, pulseController.updateReply);
router.delete('/:postId/replies/:replyId', auth, pulseController.deleteReply);
router.post('/:postId/replies/:replyId/accept', auth, pulseController.acceptReply);

module.exports = router;