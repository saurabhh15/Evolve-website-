const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

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

  const candidateSummaries = topCandidates.map(c => ({
    id: c.user._id,
    name: c.user.name,
    skills: c.user.skills,
    expertise: c.user.expertise,
    bio: c.user.bio
  }));

  const prompt = `
You are an AI matching system.

PROJECT DETAILS:
Title: ${project.title}
Description: ${project.description}
Stage: ${project.stage}
Category: ${project.category}
Looking For: ${project.lookingFor?.join(", ")}

CANDIDATES:
${JSON.stringify(candidateSummaries, null, 2)}

TASK:
For each candidate, write exactly ONE short sentence explaining why they are a strong ${isMentor ? "mentor" : "teammate"} match for this project.
Focus on their skills, expertise, and how it aligns with the project stage and needs.

Return ONLY a valid JSON array in this exact format:
[
  {
    "userId": "<id>",
    "reason": "<1 sentence reason>"
  }
]
`;

  const result = await flashModel.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

module.exports = { getEmbedding, cosineSimilarity, generateMatchReasons };