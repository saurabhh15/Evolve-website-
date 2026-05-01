const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const applicationController = require('../controllers/applicationController');


router.get('/search', projectController.searchProjects);
router.get('/my-projects', auth, projectController.getMyProjects);
router.post('/', auth, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/:id/like', auth, projectController.toggleLike);
router.post('/:id/team', auth, projectController.addTeamMember);
router.delete('/:id/team/:userId', auth, projectController.removeTeamMember);

//applications

router.post('/:id/apply', auth, applicationController.apply);
router.get('/:id/applications', auth, applicationController.getApplications);


module.exports = router;