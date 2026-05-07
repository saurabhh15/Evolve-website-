const express = require("express");
const router = express.Router();
const { getAISuggestions } = require("../services/gemini");
const Project = require("../models/Project");
const User = require("../models/User");

// POST /api/ai/suggest-teammates/:projectId
router.post("/suggest-teammates/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Get students not already on the team
    const existingIds = [project.creator, ...project.teamMembers];
    const candidates = await User.find({
      role: "student",
      _id: { $nin: existingIds }
    }).limit(50);  // cap for prompt size

    const suggestions = await getAISuggestions(project, candidates, "teammate");

    // Enrich with full user data
    const userMap = Object.fromEntries(candidates.map(u => [u._id.toString(), u]));
    const enriched = suggestions.map(s => ({
      ...s,
      user: userMap[s.userId] || null
    }));

    res.json({ success: true, suggestions: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI suggestion failed", error: err.message });
  }
});

// POST /api/ai/suggest-mentors/:projectId
router.post("/suggest-mentors/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const candidates = await User.find({ role: "mentor" }).limit(50);

    const suggestions = await getAISuggestions(project, candidates, "mentor");

    const userMap = Object.fromEntries(candidates.map(u => [u._id.toString(), u]));
    const enriched = suggestions.map(s => ({
      ...s,
      user: userMap[s.userId] || null
    }));

    res.json({ success: true, suggestions: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI suggestion failed", error: err.message });
  }
});

module.exports = router;