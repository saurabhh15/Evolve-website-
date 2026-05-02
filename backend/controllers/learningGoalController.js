const LearningGoal = require('../models/LearningGoal');
const Project = require('../models/Project');

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await LearningGoal.find({ user: req.user.userId });
    
    // Get user's projects to calculate progress
    const projects = await Project.find({ creator: req.user.userId });
    
    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => {
      const projectsWithSkill = projects.filter(p =>
        p.tags.some(tag => tag.toLowerCase() === goal.skill.toLowerCase())
      ).length;
      
      return {
        _id: goal._id,
        skill: goal.skill,
        target: goal.target,
        current: projectsWithSkill,
        progress: Math.min(Math.round((projectsWithSkill / goal.target) * 100), 100),
        completed: projectsWithSkill >= goal.target,
        createdAt: goal.createdAt
      };
    });
    
    res.json(goalsWithProgress);
  } catch (error) {
    next(error);
  }
};

exports.addGoal = async (req, res, next) => {
  try {
    const { skill, target } = req.body;
    
    if (!skill || !target) {
      return res.status(400).json({ message: 'Skill and target are required' });
    }

    // Check if goal already exists
    const existing = await LearningGoal.findOne({
      user: req.user.userId,
      skill: { $regex: new RegExp(`^${skill}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({ message: 'Goal for this skill already exists' });
    }

    const goal = new LearningGoal({
      user: req.user.userId,
      skill: skill.trim(),
      target: parseInt(target)
    });

    await goal.save();

    // Calculate progress immediately
    const projects = await Project.find({ creator: req.user.userId });
    const projectsWithSkill = projects.filter(p =>
      p.tags.some(tag => tag.toLowerCase() === skill.toLowerCase())
    ).length;

    res.status(201).json({
      _id: goal._id,
      skill: goal.skill,
      target: goal.target,
      current: projectsWithSkill,
      progress: Math.min(Math.round((projectsWithSkill / goal.target) * 100), 100),
      completed: projectsWithSkill >= goal.target,
      createdAt: goal.createdAt
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await LearningGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
};