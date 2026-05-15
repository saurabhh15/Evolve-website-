const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const investorOnly = require('../middleware/investorOnly');
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  checkWatchlist,
  updateNotes,
} = require('../controllers/watchlistController');

// All watchlist routes are private + investor only
router.use(auth, investorOnly);

// GET    /api/watchlist             — get full watchlist
router.get('/', getWatchlist);

// GET    /api/watchlist/check/:projectId — is project saved?
router.get('/check/:projectId', checkWatchlist);

// POST   /api/watchlist/:projectId  — add to watchlist
router.post('/:projectId', addToWatchlist);

// PATCH  /api/watchlist/:projectId/notes — update private notes
router.patch('/:projectId/notes', updateNotes);

// DELETE /api/watchlist/:projectId  — remove from watchlist
router.delete('/:projectId', removeFromWatchlist);

module.exports = router;