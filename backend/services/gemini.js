const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @param {Object} project  - the project document
 * @param {Array}  users    - candidate users from DB
 * @param {String} mode     - "teammate" | "mentor"
 */
async function getAISuggestions(project, users, mode) {
  const isMentor = mode === "mentor";

  // Build a lean user list to send (don't send full docs)
  const userSummaries = users.map(u => ({
    id: u._id,
    name: u.name,
    skills: u.skills,
    expertise: u.expertise,        // mentors
    category: u.category,          // mentors
    bio: u.bio,
    rating: u.rating,              // mentors
    sessionsHeld: u.sessionsHeld,  // mentors
    location: u.location,
    college: u.college,
    role: u.role,
  }));

  const prompt = `
You are an AI that recommends the best ${isMentor ? "mentors" : "teammates"} for a project.

PROJECT DETAILS:
- Title: ${project.title}
- Category: ${project.category}
- Stage: ${project.stage}
- Description: ${project.description}
- Tags: ${project.tags?.join(", ")}
- Looking For: ${project.lookingFor?.join(", ")}
- Current Team Size: ${project.teamSize}

CANDIDATES (JSON array):
${JSON.stringify(userSummaries, null, 2)}

TASK:
Pick the TOP 5 best ${isMentor ? "mentors" : "teammates"} from the candidates.
${isMentor
  ? "Prioritize: matching category/expertise, high rating, experience with this project stage."
  : "Prioritize: complementary skills the project needs, matching tech stack, similar interests."
}

Return ONLY a valid JSON array (no markdown, no explanation) in this format:
[
  {
    "userId": "<id>",
    "name": "<name>",
    "matchScore": <0-100>,
    "reason": "<1 sentence why they are a great match>"
  }
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

module.exports = { getAISuggestions };