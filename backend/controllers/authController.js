const User = require('../models/User');
const mongoose = require('mongoose');
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
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // SAFE EXTRACTION - STANDARD FIELDS
    const role = req.body.role?.toLowerCase() || "student";
    const gender = req.body.gender?.toLowerCase();
    const college = req.body.college || "Not specified";
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [];

    // SAFE EXTRACTION - INVESTOR SPECIFIC FIELDS
    const firmName = req.body.firmName || "";
    const ticketSize = req.body.ticketSize || "";
    const sectorsOfInterest = Array.isArray(req.body.sectorsOfInterest) ? req.body.sectorsOfInterest : [];
    const investmentThesis = req.body.investmentThesis || "";
    const targetStages = Array.isArray(req.body.targetStages) ? req.body.targetStages : [];

    // FORCE IMAGE SET
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
        firmName,
        ticketSize,
        sectorsOfInterest,
        investmentThesis,
        targetStages,
        hasCompletedOnboarding: true,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Protocol Secured. Welcome to the Network.",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Onboarding Error:", error);
    next(error);
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user registered via Google/Github and has no password
    if (!user.password) {
      return res.status(400).json({ message: 'Account uses social login. Please login with Google/Github.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in database
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password successfully updated' });

  } catch (error) {
    console.error("Password Change Error:", error);
    next(error);
  }
};

// DELETE ACCOUNT (CASCADING SCRUB)
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // 1. Find user to ensure they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Dynamic model loading safely accesses your schemas without crashing if paths differ
    const Project = mongoose.models.Project;
    const Connection = mongoose.models.Connection;
    const Notification = mongoose.models.Notification;
    const Comment = mongoose.models.Comment;
    const Application = mongoose.models.Application;
    const Watchlist = mongoose.models.Watchlist;
    

    // 2. Delete all projects created by this user
    // & Remove user from other people's projects (Team Members array & Likes array)
    if (Project) {
      await Project.deleteMany({ creator: userId });
      await Project.updateMany(
        {},
        { 
          $pull: { 
            teamMembers: userId,
            likes: userId 
          } 
        }
      );
    }
    
    // 3. Delete all network connections/requests involving this user
    if (Connection) {
      await Connection.deleteMany({ $or: [{ from: userId }, { to: userId }] });
    }

    // 4. Delete all notifications involving this user
    if (Notification) {
      await Notification.deleteMany({ $or: [{ recipient: userId }, { sender: userId }] });
    }

    // 5. Delete all comments authored by this user
    if (Comment) {
      await Comment.deleteMany({ author: userId });
    }

    // 6. Delete all job/role applications submitted by this user
    if (Application) {
      await Application.deleteMany({ applicant: userId });
    }
    if (Watchlist) {
      await Watchlist.deleteMany({ investor: userId });
    }

    // 7. Finally, delete the User profile itself
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all associated platform data permanently deleted.' });
  } catch (error) {
    console.error("Cascading Delete Account Error:", error);
    next(error);
  }
};