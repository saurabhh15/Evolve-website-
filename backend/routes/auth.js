const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { 
  register, 
  login, 
  getMe, 
  completeOnboarding 
} = require('../controllers/authController');
const auth = require('../middleware/auth');
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


//  GOOGLE OAuth ROUTES 
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: 'http://localhost:5174/get-started' 
  }),
  (req, res) => {
    console.log('Google callback hit, user:', req.user.email);
    
    // Generate JWT
    const token = jwt.sign(
      { userId: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    const needsOnboarding = !req.user.hasCompletedOnboarding;
    res.redirect(`http://localhost:5174/auth/callback?token=${token}&onboarding=${needsOnboarding}`);
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
    failureRedirect: 'http://localhost:5174/get-started' 
  }),
  (req, res) => {
    console.log('GitHub callback hit, user:', req.user.email);
    
    const token = jwt.sign(
      { userId: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    const needsOnboarding = !req.user.hasCompletedOnboarding;
    res.redirect(`http://localhost:5174/auth/callback?token=${token}&onboarding=${needsOnboarding}`);
  }
);

module.exports = router;