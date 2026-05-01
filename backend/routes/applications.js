const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

// Get own applications
router.get('/my', auth, applicationController.getMyApplications);

// Update application status
router.put('/:id', auth, applicationController.updateStatus);

module.exports = router;