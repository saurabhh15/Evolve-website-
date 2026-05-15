const express = require("express");
const router = express.Router();
const { getEmbedding, cosineSimilarity, generateMatchReasons } = require("../services/gemini");
const Project = require("../models/Project");
const User = require("../models/User");

// Text builders 
const buildProjectText = (p) =>
  `${p.title} ${p.description} ${p.category} ${p.stage} ${(p.tags || []).join(" ")} ${(p.lookingFor || []).join(" ")}`;

const buildUserText = (u) =>
  `${u.name} ${u.bio || ""} ${(u.skills || []).join(" ")} ${(u.expertise || []).join(" ")} ${u.category || ""} ${u.role} ${u.college || ""} ${u.company || ""}`;

// Get/generate embeddings for a list of users
async function getCandidatesWithEmbeddings(users) {
  const results = [];

  for (const user of users) {
    try {
      let embedding = user.embedding;

      if (!embedding || embedding.length === 0) {
        const text = buildUserText(user);
        embedding = await getEmbedding(text);

        // updateOne bypasses Mongoose strict mode
        await User.updateOne({ _id: user._id }, { $set: { embedding } });
        user.embedding = embedding;
      }

      if (embedding && embedding.length > 0) {
        results.push({ user, embedding });
      }
    } catch (err) {
      console.error(`Skipping user ${user.name} (${user._id}) - embedding error:`, err.message);
    }
  }

  return results;
}

// Robust reason lookup
function buildReasonMap(reasons, top5) {
  const map = {};
  reasons.forEach((r, i) => {
    if (r.userId) map[r.userId.toString()] = r.reason;
    if (top5[i]) map[`pos_${i}`] = r.reason;
  });
  return map;
}

function getReason(reasonMap, user, index, defaultText) {
  const idStr = user._id.toString();
  return (
    reasonMap[idStr] ||
    reasonMap[`pos_${index}`] ||
    defaultText
  );
}

// POST /api/ai/suggest-teammates/:projectId
router.post("/suggest-teammates/:projectId", async (req, res) => {
  try {
    // Populate creator to get the 'Home College' for the boost logic
    const project = await Project.findById(req.params.projectId).populate("creator", "college");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const creatorCollege = project.creator?.college?.toLowerCase().trim();

    // Build project embedding
    const projText = buildProjectText(project);
    const projEmbedding = await getEmbedding(projText);

    // Fetch candidate students
    const existingIds = [project.creator._id, ...(project.teamMembers || [])];
    const rawCandidates = await User.find({
      role: "student",
      _id: { $nin: existingIds },
    }).select("+embedding");

    if (rawCandidates.length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    // Generate missing embeddings
    const candidates = await getCandidatesWithEmbeddings(rawCandidates);

    if (candidates.length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    // Score by cosine similarity WITH College Proximity Boost
    const scored = candidates.map((c) => {
      const rawSim = cosineSimilarity(projEmbedding, c.embedding);
      let score = Math.max(Math.round(rawSim * 100), 10);

      // Check if candidate is from the same college
      const candidateCollege = c.user.college?.toLowerCase().trim();
      const isSameCollege = Boolean(creatorCollege && candidateCollege && creatorCollege === candidateCollege);

      // Apply a +15 point boost for same college, capped at 99
      if (isSameCollege) {
        score = Math.min(score + 15, 99);
      }

      return { user: c.user, score, isSameCollege };
    });

    scored.sort((a, b) => b.score - a.score);
    const top5 = scored.slice(0, 5);

    // Generate reasons via Gemini Flash
    let reasonMap = {};
    try {
      const reasons = await generateMatchReasons(project, top5, "teammate");
      reasonMap = buildReasonMap(reasons, top5);
    } catch (err) {
      console.error("Reason generation failed (non-fatal):", err.message);
    }

    const suggestions = top5.map((c, i) => ({
      userId: c.user._id,
      user: c.user,
      matchScore: c.score,
      isSameCollege: c.isSameCollege,
      reason: getReason(reasonMap, c.user, i, "Their profile strongly aligns with the specific roles your team is looking for."),
    }));

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("suggest-teammates error:", err);
    res.status(500).json({ message: "AI suggestion failed", error: err.message });
  }
});

// POST /api/ai/suggest-mentors/:projectId
router.post("/suggest-mentors/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("creator", "college");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const creatorCollege = project.creator?.college?.toLowerCase().trim();

    // Build project embedding
    const projText = buildProjectText(project);
    const projEmbedding = await getEmbedding(projText);

    // Fetch all mentors
    const rawCandidates = await User.find({ role: "mentor" }).select("+embedding");

    if (rawCandidates.length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    // Generate missing embeddings
    const candidates = await getCandidatesWithEmbeddings(rawCandidates);

    if (candidates.length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    // Score by cosine similarity WITH slight College Proximity Boost
    const scored = candidates.map((c) => {
      const rawSim = cosineSimilarity(projEmbedding, c.embedding);
      let score = Math.max(Math.round(rawSim * 100), 10);
      
      const candidateCollege = c.user.college?.toLowerCase().trim();
      const isSameCollege = Boolean(creatorCollege && candidateCollege && creatorCollege === candidateCollege);

      if (isSameCollege) {
         score = Math.min(score + 10, 99); 
      }

      return { user: c.user, score, isSameCollege };
    });

    scored.sort((a, b) => b.score - a.score);
    const top5 = scored.slice(0, 5);

    // Generate reasons via Gemini Flash
    let reasonMap = {};
    try {
      const reasons = await generateMatchReasons(project, top5, "mentor");
      reasonMap = buildReasonMap(reasons, top5);
    } catch (err) {
      console.error("Reason generation failed (non-fatal):", err.message);
    }

    const suggestions = top5.map((c, i) => ({
      userId: c.user._id,
      user: c.user,
      matchScore: c.score,
      isSameCollege: c.isSameCollege,
      reason: getReason(reasonMap, c.user, i, "Expertise and mentorship style aligns with your project stage."),
    }));

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("suggest-mentors error:", err);
    res.status(500).json({ message: "AI suggestion failed", error: err.message });
  }
});

module.exports = router;