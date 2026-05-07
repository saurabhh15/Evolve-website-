// ============================================================
// SEED SCRIPT — run inside mongosh
// Usage:  mongosh "mongodb://localhost:27017/yourDB" seed.js
// Or paste the whole thing into the mongosh shell
// ============================================================

// ── 0. WIPE EXISTING DATA ───────────────────────────────────
db.users.deleteMany({});
db.projects.deleteMany({});
print(" Cleared users and projects collections");

// ── 1. HELPERS ──────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMany(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
function randInt(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function randFloat(min, max, decimals = 1) {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
}

// ── 2. LOOKUP DATA ──────────────────────────────────────────
const firstNames = [
  "Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Ayaan","Krishna","Ishaan",
  "Priya","Ananya","Sneha","Pooja","Riya","Nisha","Kavya","Divya","Meera","Shreya",
  "Rohan","Karan","Nikhil","Rahul","Amit","Vikram","Suresh","Deepak","Manish","Rajesh",
  "Anjali","Neha","Swati","Komal","Simran","Tanvi","Pallavi","Megha","Sonali","Shweta",
  "Harsh","Gaurav","Mohit","Tarun","Varun","Sachin","Piyush","Akash","Siddharth","Yash"
];
const lastNames = [
  "Sharma","Verma","Patel","Singh","Gupta","Kumar","Joshi","Mehta","Nair","Reddy",
  "Iyer","Rao","Bhat","Pillai","Menon","Chaudhary","Agarwal","Bansal","Malhotra","Kapoor"
];
const colleges = [
  "IIT Bombay","IIT Delhi","IIT Madras","IIT Kanpur","IIT Kharagpur",
  "NIT Trichy","NIT Surathkal","BITS Pilani","VIT Vellore","DTU Delhi",
  "IIIT Hyderabad","Amity University","Manipal Institute of Technology",
  "SRM Institute","Jadavpur University"
];
const locations = [
  "Mumbai, Maharashtra","Delhi, NCR","Bangalore, Karnataka","Hyderabad, Telangana",
  "Chennai, Tamil Nadu","Pune, Maharashtra","Kolkata, West Bengal","Ahmedabad, Gujarat",
  "Jaipur, Rajasthan","Noida, Uttar Pradesh","Chandigarh","Indore, Madhya Pradesh"
];
const allSkills = [
  "React","Node.js","Python","Machine Learning","TypeScript","MongoDB","PostgreSQL",
  "Docker","Kubernetes","AWS","Firebase","Flutter","Swift","Kotlin","Java","C++",
  "GraphQL","Redis","TailwindCSS","Next.js","Django","FastAPI","TensorFlow","PyTorch",
  "Figma","UI/UX Design","Product Management","Data Science","Blockchain","Solidity"
];
const mentorExpertise = [
  "System Design","Startup Strategy","Fundraising","Product-Market Fit","Growth Hacking",
  "Technical Architecture","Machine Learning","Mobile Development","Cloud Infrastructure",
  "Business Development","Marketing Strategy","UX Research","Agile Methodologies",
  "Venture Capital","Financial Modeling"
];
const companies = [
  "Google","Microsoft","Amazon","Flipkart","Razorpay","Zepto","CRED","PhonePe",
  "Meesho","Swiggy","Zomato","Ola","Paytm","InMobi","Freshworks","Infosys","TCS",
  "Wipro","HCL Technologies","Tech Mahindra","Byju's","Unacademy","Vedantu","Groww"
];
const responseTimes = ["< 1 hr","< 6 hrs","< 12 hrs","< 24 hrs","< 48 hrs","< 72 hrs"];
const gradYears = ["2018","2019","2020","2021","2022","2023","2024"];
const mentorCategories = ["Engineering","Product & Design","Business & Growth"];
const mentorStatuses = ["Accepting Mentees","Limited Capacity","Unavailable"];

// Project data
const projectTitles = [
  ["EduBot AI","SmartLearn Platform","QuizMaster Pro","StudyBuddy","CampusConnect"],
  ["HealthTrack","MediRemind","FitLife AI","NutriScan","WellnessHub"],
  ["FinFlow","CryptoVault","InvestIQ","SpendWise","TaxEase"],
  ["FarmSense IoT","AgriBot","CropMonitor","SoilSmart","IrrigateAI"],
  ["CodeCollab","DevMatch","HackTrack","BugBounty","OpenSource Hub"],
  ["TravelBuddy","TripPlanner AI","LocalGuide","RouteOptimizer","StayFinder"],
  ["EcoTrack","CarbonZero","GreenCommute","WasteSort","SolarMonitor"],
  ["ShopAI","RetailBot","InventoryPro","PriceWatch","ReviewAnalyzer"],
  ["MeetSync","TeamFlow","CollabSpace","RemoteWork Hub","AsyncComms"],
  ["SafeRoute","CrimeAlert","DisasterSOS","EmergencyNet","SafeCity"]
];
const taglines = [
  "Transforming education with personalized AI tutoring",
  "Your health companion powered by machine learning",
  "Making financial literacy accessible to everyone",
  "Smart agriculture for the next generation of farmers",
  "Where developers collaborate and grow together",
  "Discover hidden gems in every city you visit",
  "Track your carbon footprint, one step at a time",
  "AI-powered shopping for smarter purchasing decisions",
  "Seamless team collaboration for distributed teams",
  "Real-time safety alerts for smart cities"
];
const descriptions = [
  "Our platform leverages advanced AI to create personalized learning paths for students. Using adaptive algorithms, we identify knowledge gaps and deliver targeted content that improves retention by 40%. We integrate with existing LMS systems and provide detailed analytics for educators.",
  "A comprehensive health monitoring solution that uses ML to predict potential health issues before they become serious. Users can track vitals, medications, and lifestyle factors through a simple mobile interface, while our AI provides actionable insights and connects them with healthcare providers.",
  "We're democratizing financial education by providing gamified micro-learning modules on investing, budgeting, and tax planning. Our AI financial advisor gives personalized recommendations based on users' income, goals, and risk appetite — all for free.",
  "IoT-enabled precision agriculture platform that helps small farmers optimize crop yield using real-time soil sensors, weather data, and AI predictions. Reduces water usage by 30% and increases yield by 25% on average.",
  "A collaborative coding platform where developers can pair-program in real time, share code snippets, and get AI-assisted code reviews. Integrated with GitHub, Jira, and Slack for a seamless developer experience.",
  "Hyper-local travel app that curates authentic experiences based on your interests and budget. Uses community-driven reviews and AI to surface hidden gems while connecting you with local guides.",
  "Personal carbon footprint tracker that integrates with your bank account, commute data, and shopping habits to give you a real-time sustainability score. Suggests actionable ways to reduce your impact and earn green credits.",
  "AI-powered e-commerce assistant that analyzes price history, reviews, and alternatives to ensure you always get the best deal. Works as a browser extension and mobile app with 2M+ products indexed.",
  "Next-generation team collaboration tool designed for async-first remote teams. Features intelligent meeting summaries, smart task assignment, and a unified workspace that reduces context switching.",
  "Real-time safety network that aggregates crowd-sourced reports, CCTV feeds, and official alerts to provide hyperlocal safety scores and evacuation guidance during emergencies."
];
const projectCategories = ['AI/ML','Web Dev','Mobile App','IoT','Blockchain','HealthTech','EdTech','FinTech','Other'];
const projectStages = ['idea','prototype','mvp','launched'];
const lookingForOptions = ['mentor','co-founder','investor','feedback','team-member'];
const projectTagPool = [
  "ai","machine-learning","education","health","fintech","iot","blockchain",
  "react","nodejs","python","mobile","saas","b2b","b2c","open-source",
  "social-impact","productivity","automation","data","analytics"
];

// ── 3. CREATE 25 STUDENTS ───────────────────────────────────
const studentIds = [];
const studentDocs = [];

for (let i = 0; i < 25; i++) {
  const firstName = firstNames[i];
  const lastName  = pick(lastNames);
  const id        = new ObjectId();
  studentIds.push(id);

  studentDocs.push({
    _id: id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.com`,
    password: "$2b$10$hashedpassword1234567890abcdef",  // bcrypt placeholder
    role: "student",
    gender: i % 2 === 0 ? "male" : "female",
    bio: [
      `Passionate ${pick(["full-stack developer","ML enthusiast","mobile developer","product designer","blockchain developer"])} looking to build the next big thing.`,
      `Final year student at ${pick(colleges)} with a love for open-source and hackathons.`,
      `Building at the intersection of ${pick(["AI and education","health and technology","finance and blockchain","IoT and agriculture"])}.`,
      `${randInt(1,3)}x hackathon winner. Love turning ideas into working products.`,
      `Seeking mentors and co-founders to help scale my startup idea.`
    ][i % 5],
    skills: pickMany(allSkills, 3, 7),
    hasCompletedOnboarding: true,
    onboardingData: {
      interests: pickMany(["AI/ML","Web Dev","Mobile App","HealthTech","EdTech","FinTech"], 1, 3),
      goals: pick(["Build a startup","Land a job","Learn new skills","Find co-founder","Get mentorship"]),
      experience: pick(["Beginner","Intermediate","Advanced"])
    },
    college: pick(colleges),
    location: locations[i % locations.length],
    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
    coverImage: `https://picsum.photos/seed/${i + 100}/800/200`,
    linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randInt(100,999)}`,
    github: `https://github.com/${firstName.toLowerCase()}${randInt(10,99)}`,
    website: i % 3 === 0 ? `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev` : undefined,
    company: "FreeLancer",
    expertise: [],
    category: null,
    rating: 0,
    sessionsHeld: 0,
    responseTime: "< 48 hrs",
    isAlumni: false,
    gradYear: pick(gradYears),
    mentorStatus: "Accepting Mentees",
    createdAt: new Date(Date.now() - randInt(1, 365) * 86400000),
    updatedAt: new Date()
  });
}

db.users.insertMany(studentDocs);
print(` Inserted 25 students`);

// ── 4. CREATE 25 MENTORS ────────────────────────────────────
const mentorIds = [];
const mentorDocs = [];

for (let i = 0; i < 25; i++) {
  const firstName = firstNames[25 + i];
  const lastName  = pick(lastNames);
  const id        = new ObjectId();
  mentorIds.push(id);
  const cat       = mentorCategories[i % 3];

  mentorDocs.push({
    _id: id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@mentor.com`,
    password: "$2b$10$hashedpassword1234567890abcdef",
    role: "mentor",
    gender: i % 2 === 0 ? "male" : "female",
    bio: [
      `${randInt(5,15)} years of experience in ${pick(["product management","engineering leadership","startup scaling","venture capital","growth marketing"])}. Love helping early-stage founders.`,
      `Ex-${pick(companies)} engineer turned startup mentor. I've been through 2 exits and want to share what I've learned.`,
      `Angel investor and advisor to ${randInt(5,20)} startups. Specializing in ${cat}.`,
      `Former CTO with deep expertise in ${pick(["distributed systems","ML infrastructure","mobile platforms","cloud architecture"])}. Here to help you avoid the mistakes I made.`,
      `Serial entrepreneur (${randInt(2,4)} startups). Currently mentoring founders on ${pick(["GTM strategy","fundraising","team building","product-market fit"])}.`
    ][i % 5],
    skills: pickMany(allSkills, 4, 8),
    hasCompletedOnboarding: true,
    onboardingData: {
      yearsOfExperience: randInt(4, 18),
      currentRole: pick(["CTO","VP Engineering","Product Director","Founder","Principal Engineer"]),
      mentorFocus: pickMany(["Technical guidance","Career advice","Fundraising","Product strategy"], 1, 3)
    },
    college: pick(colleges),
    location: locations[i % locations.length],
    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=mentor${firstName}`,
    coverImage: `https://picsum.photos/seed/${i + 200}/800/200`,
    linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-mentor`,
    github: i % 2 === 0 ? `https://github.com/${firstName.toLowerCase()}mentor` : undefined,
    website: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.com`,
    company: pick(companies),
    expertise: pickMany(mentorExpertise, 2, 5),
    category: cat,
    rating: randFloat(3.5, 5.0, 1),
    sessionsHeld: randInt(10, 200),
    responseTime: pick(responseTimes),
    isAlumni: Math.random() > 0.5,
    gradYear: pick(["2005","2007","2009","2011","2013","2015","2017"]),
    mentorStatus: mentorStatuses[i % 3],
    createdAt: new Date(Date.now() - randInt(30, 730) * 86400000),
    updatedAt: new Date()
  });
}

db.users.insertMany(mentorDocs);
print(` Inserted 25 mentors`);

// ── 5. CREATE 2 PROJECTS PER STUDENT (50 total) ─────────────
const projectDocs = [];
const allUserIds  = [...studentIds, ...mentorIds];

for (let s = 0; s < 25; s++) {
  for (let p = 0; p < 2; p++) {
    const titleGroup = projectTitles[(s * 2 + p) % projectTitles.length];
    const title      = titleGroup[p % titleGroup.length] + (s > 4 ? ` v${s % 3 + 1}` : "");
    const catIndex   = (s + p) % projectCategories.length;
    const stageIndex = (s * 2 + p) % projectStages.length;

    // vary team size and collaborators based on stage
    const stage    = projectStages[stageIndex];
    const teamSize = stage === "idea" ? 1
                   : stage === "prototype" ? randInt(1, 3)
                   : stage === "mvp"       ? randInt(2, 4)
                   : randInt(3, 6);

    // pick some random team members (not the creator)
    const otherUsers = allUserIds.filter(id => !id.equals(studentIds[s]));
    const teamMembers = teamSize > 1
      ? pickMany(otherUsers, 1, Math.min(teamSize - 1, 4)).slice(0, teamSize - 1)
      : [];

    // likes — random subset
    const likes = pickMany(allUserIds, 0, 15);

    projectDocs.push({
      _id: new ObjectId(),
      title,
      tagline: taglines[(s + p) % taglines.length],
      description: descriptions[(s + p) % descriptions.length],
      category: projectCategories[catIndex],
      stage,
      teamSize,
      lookingFor: pickMany(lookingForOptions, 1, stage === "launched" ? 2 : 4),
      tags: pickMany(projectTagPool, 3, 7),
      demoUrl:   stage === "mvp" || stage === "launched"
                   ? `https://demo-${title.toLowerCase().replace(/\s+/g,"-")}.vercel.app`
                   : undefined,
      githubUrl: Math.random() > 0.3
                   ? `https://github.com/user/${title.toLowerCase().replace(/\s+/g,"-")}`
                   : undefined,
      images: [
        `https://picsum.photos/seed/${s * 10 + p}/800/450`,
        `https://picsum.photos/seed/${s * 10 + p + 1}/800/450`
      ],
      creator: studentIds[s],
      teamMembers,
      likes,
      viewCount:   randInt(10, 2000),
      weeklyViews: randInt(0, 300),
      weeklyLikes: randInt(0, 50),
      createdAt: new Date(Date.now() - randInt(1, 180) * 86400000),
      updatedAt: new Date()
    });
  }
}

db.projects.insertMany(projectDocs);
print(` Inserted ${projectDocs.length} projects`);

// ── 6. SUMMARY ──────────────────────────────────────────────
print("\n📊 Final counts:");
print(`   Users    : ${db.users.countDocuments()}`);
print(`   Students : ${db.users.countDocuments({ role: "student" })}`);
print(`   Mentors  : ${db.users.countDocuments({ role: "mentor" })}`);
print(`   Projects : ${db.projects.countDocuments()}`);
print("\n🎉 Seeding complete!");