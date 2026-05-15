const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const applicationController = require('../controllers/applicationController');

router.get('/search', projectController.searchProjects);
router.get('/my-projects', auth, projectController.getMyProjects);

// NOTE: Specific routes MUST come before dynamic ID routes (/:id)
// otherwise Express will think "pipeline" is an ID
router.get('/pipeline', auth, projectController.getVenturePipeline);

router.post('/', auth, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/:id/like', auth, projectController.toggleLike);
router.post('/:id/team', auth, projectController.addTeamMember);
router.delete('/:id/team/:userId', auth, projectController.removeTeamMember);
router.post('/:id/invite', auth, projectController.inviteTeammate);

// Applications
router.post('/:id/apply', auth, applicationController.apply);
router.get('/:id/applications', auth, applicationController.getApplications);

module.exports = router;