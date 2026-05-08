const express = require("express");
const router = express.Router();
const { getEmbedding, cosineSimilarity, generateMatchReasons } = require("../services/gemini");
const Project = require("../models/Project");
const User = require("../models/User");

const buildProjectText = (p) => `${p.title} ${p.description} ${p.category} ${p.stage} ${(p.tags || []).join(" ")} ${(p.lookingFor || []).join(" ")}`;
const buildUserText = (u) => `${u.name} ${u.bio} ${(u.skills || []).join(" ")} ${(u.expertise || []).join(" ")} ${u.category || ""} ${u.role}`;

// Helper to ensure users have embeddings without crashing if schema is strict
async function getCandidatesWithEmbeddings(users) {
  return await Promise.all(users.map(async (user) => {
    let embedding = user.embedding;
    if (!embedding || embedding.length === 0) {
      const text = buildUserText(user);
      embedding = await getEmbedding(text);
      user.embedding = embedding;
      await user.save().catch(() => null); 
    }
    return { user, embedding };
  }));
}

// POST /api/ai/suggest-teammates/:projectId
router.post("/suggest-teammates/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const projText = buildProjectText(project);
    const projEmbedding = await getEmbedding(projText);

    const existingIds = [project.creator, ...(project.teamMembers || [])];
    const rawCandidates = await User.find({
      role: "student",
      _id: { $nin: existingIds }
    });

    const candidates = await getCandidatesWithEmbeddings(rawCandidates);

    const scored = candidates.map(c => {
      const score = cosineSimilarity(projEmbedding, c.embedding);
      return { user: c.user, score: Math.round(score * 100) };
    });

    scored.sort((a, b) => b.score - a.score);
    const top5 = scored.slice(0, 5);

    if (top5.length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    const reasons = await generateMatchReasons(project, top5, "teammate");
    const reasonMap = Object.fromEntries(reasons.map(r => [r.userId, r.reason]));

    const suggestions = top5.map(c => ({
      userId: c.user._id,
      user: c.user,
      matchScore: c.score,
      reason: reasonMap[c.user._id.toString()] || "Strong profile alignment with project needs."
    }));

    res.json({ success: true, suggestions });
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

    const projText = buildProjectText(project);
    const projEmbedding = await getEmbedding(projText);

    const rawCandidates = await User.find({ role: "mentor" });
    const candidates = await getCandidatesWithEmbeddings(rawCandidates);

    const scored = candidates.map(c => {
      const score = cosineSimilarity(projEmbedding, c.embedding);
      return { user: c.user, score: Math.round(score * 100) };
    });

    scored.sort((a, b) => b.score - a.score);
    const top5 = scored.slice(0, 5);

    if (top5.length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    const reasons = await generateMatchReasons(project, top5, "mentor");
    const reasonMap = Object.fromEntries(reasons.map(r => [r.userId, r.reason]));

    const suggestions = top5.map(c => ({
      userId: c.user._id,
      user: c.user,
      matchScore: c.score,
      reason: reasonMap[c.user._id.toString()] || "Strong expertise match for this sector."
    }));

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI suggestion failed", error: err.message });
  }
});

module.exports = router;