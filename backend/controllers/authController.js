const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Keep registration simple

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
  
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedOnboarding: user.hasCompletedOnboarding, // NEW: Needed for Gatekeeper
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedOnboarding: user.hasCompletedOnboarding, // NEW: Needed for Gatekeeper
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ME (Used to verify session on refresh)
exports.getMe = async (req, res) => {
  try {
    // req.user.userId comes from your auth middleware
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); // This will naturally include hasCompletedOnboarding now
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeOnboarding = async (req, res) => {
  try {
    const { role, onboardingData, college, location, skills } = req.body;

    console.log('Completing onboarding for user:', req.user.userId);
    console.log('Received data:', { role, college, location, skills, onboardingData });

    // Find user and update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        role,
        onboardingData,
        college,
        location,
        skills,
        hasCompletedOnboarding: true // ← THE KEY FLAG
      },
      { new: true } 
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser.email);

    res.json({
      message: "Protocol Secured. Welcome to the Network.",
      user: updatedUser
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Failed to complete protocol' });
  }
};