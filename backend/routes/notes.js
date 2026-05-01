const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/noteController');

router.get('/:menteeId', auth, controller.getNotes);
router.post('/:menteeId', auth, controller.addNote);
router.put('/:id', auth, controller.editNote);
router.delete('/:id', auth, controller.deleteNote);

module.exports = router;