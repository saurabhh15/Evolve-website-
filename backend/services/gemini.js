const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function getEmbedding(text) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function generateMatchReasons(project, topCandidates, mode) {
  const isMentor = mode === "mentor";
  const projectCreatorCollege = project.creator?.college || "Not specified";

  const candidateSummaries = topCandidates.map(c => ({
    id: c.user._id,
    name: c.user.name,
    skills: c.user.skills,
    expertise: c.user.expertise,
    college: c.user.college,
    bio: c.user.bio
  }));

  const prompt = `
You are an elite technical recruiter and AI matching system.

PROJECT CONTEXT:
Title: ${project.title}
Description: ${project.description}
Stage: ${project.stage}
Category: ${project.category}
Specific Roles Needed: ${project.lookingFor?.join(", ") || "General Team Members/Mentors"}
Tech Stack: ${project.tags?.join(", ")}
Creator College: ${projectCreatorCollege}

CANDIDATES:
${JSON.stringify(candidateSummaries, null, 2)}

TASK:
For each candidate, write exactly ONE short sentence explaining why they are a strong match for this project.

CRITICAL INSTRUCTIONS:
- Do NOT give generic answers. 
- Analyze the candidate's skills and explicitly state WHICH "Specific Role Needed" (e.g., Co-Founder, Backend Dev, Mentor) they fill based on the project data.
- If the candidate studies at the same college (${projectCreatorCollege}), you MUST mention that they are perfect for in-person collaboration.
- Example for Teammate: "Their deep knowledge of Rust and attendance at your college makes them an ideal Co-Founder for local sprints."
- Example for Mentor: "Their history scaling FinTech MVPs makes them the perfect mentor for your current growth stage."

Return ONLY a valid JSON array in this exact format:
[
  {
    "userId": "<id>",
    "reason": "<1 highly specific sentence reason>"
  }
]
`;

  const result = await flashModel.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

module.exports = { getEmbedding, cosineSimilarity, generateMatchReasons };