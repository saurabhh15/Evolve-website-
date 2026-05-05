const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { 
  register, 
  login, 
  getMe, 
  completeOnboarding,
  changePassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Dynamic Frontend URL check
const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

// signIn
router.post('/register', register);
// Login
router.post('/login', login);
// Get Current User (Session check)
router.get('/me', auth, getMe);

router.patch('/onboarding', auth, (req, res, next) => {
  console.log(" ROUTE HIT");
  next();
}, completeOnboarding);

// Change Password
router.put('/change-password', auth, changePassword);

// GOOGLE OAuth ROUTES 
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${CLIENT_URL}/get-started` 
  }),
  (req, res) => {
    console.log('Google callback hit, user:', req.user.email);
    
    // Generate JWT
    const token = jwt.sign(
      { userId: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Redirect to dynamic frontend with token
    const needsOnboarding = !req.user.hasCompletedOnboarding;
    res.redirect(`${CLIENT_URL}/auth/callback?token=${token}&onboarding=${needsOnboarding}`);
  }
);

// GITHUB OAuth ROUTES 
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    session: false, 
    failureRedirect: `${CLIENT_URL}/get-started` 
  }),
  (req, res) => {
    console.log('GitHub callback hit, user:', req.user.email);
    
    const token = jwt.sign(
      { userId: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    const needsOnboarding = !req.user.hasCompletedOnboarding;
    res.redirect(`${CLIENT_URL}/auth/callback?token=${token}&onboarding=${needsOnboarding}`);
  }
);

module.exports = router;