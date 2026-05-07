const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// GOOGLE 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://evolve-website.onrender.com/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile); // Debug log

        // Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          console.log('Existing user found:', user.email);
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'oauth_user_' + Math.random().toString(36).substring(7),
          profileImage: profile.photos[0]?.value,
          hasCompletedOnboarding: false,
        });

        await user.save();
        console.log('New user created:', user.email);
        done(null, user);
      } catch (err) {
        console.error('Google OAuth Error:', err);
        done(err, null);
      }
    }
  )
);

// GITHUB 
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://evolve-website.onrender.com/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub Profile:', profile);

        const email = profile.emails?.[0]?.value || `${profile.username}@github.oauth`;
        
        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName || profile.username,
          email: email,
          password: 'oauth_user_' + Math.random().toString(36).substring(7),
          profileImage: profile.photos[0]?.value,
          github: profile.profileUrl,
          hasCompletedOnboarding: false,
        });

        await user.save();
        done(null, user);
      } catch (err) {
        console.error('GitHub OAuth Error:', err);
        done(err, null);
      }
    }
  )
);

module.exports = passport;