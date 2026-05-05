const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body; 

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
        hasCompletedOnboarding: user.hasCompletedOnboarding, 
        role: user.role,
        gender: user.gender,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    next(error);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
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
        hasCompletedOnboarding: user.hasCompletedOnboarding, 
        role: user.role,
        gender: user.gender,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    next(error);
  }
};

// GET ME
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); 
  } catch (error) {
    next(error);
  }
};

// COMPLETE ONBOARDING
exports.completeOnboarding = async (req, res, next) => {
  try {
    console.log(" ONBOARDING API HIT");
    console.log("BODY:", req.body);

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // SAFE EXTRACTION
    const role = req.body.role?.toLowerCase() || "student";
    const gender = req.body.gender?.toLowerCase();

    const college = req.body.college || "Not specified";
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [];

    console.log("EXTRACTED GENDER:", gender);

    //  FORCE IMAGE SET
    let profileImage = "";

    if (gender === "female") {
      profileImage = "/female.jpg";
    } else if (gender === "male") {
      profileImage = "/male.jpg";
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role,
        gender, 
        profileImage, 
        college,
        skills,
        hasCompletedOnboarding: true,
      },
      { new: true }
    ).select("-password");

    console.log("UPDATED USER IN DB:", updatedUser);

    res.json({
      message: "Protocol Secured. Welcome to the Network.",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Onboarding Error:", error);
    next(error);
  }
};