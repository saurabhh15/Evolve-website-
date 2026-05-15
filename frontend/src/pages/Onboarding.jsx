import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Target, BookOpen, Hexagon, Network, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// --- CORE SKILLS DATASET ---
const CORE_SKILLS = [
  "Frontend (React/Next.js)", 
  "Backend (Node.js/Python)", 
  "Full Stack Development",
  "AI / Machine Learning", 
  "UI / UX Design", 
  "Mobile Dev (React Native/Flutter)",
  "Cloud / DevOps (AWS/GCP)", 
  "Data Science & Analytics", 
  "Blockchain / Web3",
  "Product Management", 
  "Marketing & Growth", 
  "System Architecture"
];

const INVESTOR_SECTORS = [
  "AI / Machine Learning",
  "SaaS & Enterprise",
  "FinTech",
  "HealthTech & Bio",
  "EdTech",
  "Web3 / Blockchain",
  "DeepTech & Hardware",
  "Consumer & Social",
  "Cleantech / Climate"
];

const INVESTOR_STAGES = [
  "Idea / Pre-Product",
  "Prototype",
  "MVP",
  "Launched / Early Users",
  "Revenue Generating"
];

const TICKET_SIZES = [
  "$5k - $25k",
  "$25k - $100k",
  "$100k - $500k",
  "$500k+"
];

// --- GENDER IMAGES ---
const GENDER_IMAGES = {
  male: '/male.jpg',
  female: '/female.jpg',
};

const containerVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// --- IDENTITY CARD ---
const IdentityCard = ({ id, title, sub, num, onClick, isActive, onHover }) => {
  return (
    <motion.button
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative h-[280px] sm:h-[340px] lg:h-[400px] w-full group overflow-hidden bg-[#0A0A0A] border transition-colors duration-500 ${isActive ? 'border-[#e87315]' : 'border-white/10'}`}
    >
      <div className={`absolute inset-0 z-10 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
      </div>
      <motion.span
        animate={{ y: isActive ? -20 : 0, opacity: isActive ? 0.07 : 0.03 }}
        className="absolute -right-2 -bottom-6 text-[8rem] sm:text-[10rem] lg:text-[14rem] font-black italic leading-none pointer-events-none select-none text-white"
      >
        {num}
      </motion.span>
      <div className="relative z-20 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-start text-left">
        <div className="space-y-2">
          <motion.div animate={{ x: isActive ? 10 : 0 }} className="flex items-center gap-2">
            <div className={`h-1 transition-all duration-500 ${isActive ? 'bg-[#e87315] w-10' : 'bg-white/30 w-5'}`} />
            <span className="text-xs sm:text-sm font-black tracking-[0.4em] sm:tracking-[0.5em] text-[#e87315] uppercase">{sub}</span>
          </motion.div>
          <h3 className={`text-4xl sm:text-5xl lg:text-6xl font-black italic transition-all duration-500 ${isActive ? 'text-white translate-x-2' : 'text-white/50'}`}>
            {title}
          </h3>
        </div>
        <div className="w-full">
          <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-300 text-sm sm:text-base font-medium mb-4 sm:mb-6 max-w-[220px]">
              Access the Evolve {title.toLowerCase()} protocol and initialize your dashboard.
            </p>
          </div>
          <div className={`flex items-center justify-between w-full border-t pt-4 transition-colors duration-500 ${isActive ? 'border-[#e87315]/50' : 'border-white/20'}`}>
            <span className={`text-xs sm:text-sm font-bold tracking-widest ${isActive ? 'text-[#e87315]' : 'text-white/40'}`}>
              {isActive ? 'READY_TO_PROCEED' : 'AWAITING_SELECTION'}
            </span>
            <div className={`transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// --- GENDER CARD ---
const GenderCard = ({ id, title, sub, image, onClick, isHovered, onHover, selected }) => {
  return (
    <motion.button
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative h-[280px] sm:h-[340px] md:h-[400px] w-full group overflow-hidden bg-[#0A0A0A] border transition-all duration-500 ${selected ? 'border-[#e87315]' : 'border-white/10'}`}
    >
      <div className={`absolute inset-0 z-10 transition-all duration-700 ${isHovered || selected ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
      </div>

      <div className={`absolute inset-0 transition-all duration-700 ${isHovered || selected ? 'opacity-40' : 'opacity-20'}`}>
        <img src={image} alt={title} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
      </div>

      {selected && (
        <div className="absolute top-4 right-4 z-30 w-8 h-8 bg-[#e87315] flex items-center justify-center rounded-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className="relative z-20 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-start text-left">
        <div className="space-y-2">
          <motion.div animate={{ x: isHovered || selected ? 10 : 0 }} className="flex items-center gap-2">
            <div className={`h-1 transition-all duration-500 ${isHovered || selected ? 'bg-[#e87315] w-10' : 'bg-white/30 w-5'}`} />
            <span className="text-xs sm:text-sm font-black tracking-[0.4em] sm:tracking-[0.5em] text-[#e87315] uppercase">{sub}</span>
          </motion.div>
          <h3 className={`text-4xl sm:text-5xl lg:text-6xl font-black italic transition-all duration-500 ${isHovered || selected ? 'text-white translate-x-2' : 'text-white/50'}`}>
            {title}
          </h3>
        </div>
        <div className="w-full">
          <div className={`flex items-center justify-between w-full border-t pt-4 transition-colors duration-500 ${isHovered || selected ? 'border-[#e87315]/50' : 'border-white/20'}`}>
            <span className={`text-xs sm:text-sm font-bold tracking-widest ${isHovered || selected ? 'text-[#e87315]' : 'text-white/40'}`}>
              {selected ? 'SELECTED' : isHovered ? 'SELECT_THIS' : 'AWAITING_SELECTION'}
            </span>
            <div className={`transition-all duration-500 ${isHovered || selected ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// --- CORE SKILLS VIEW (Student & Mentor) ---
const CoreSkillsView = ({ options, selected, toggle, onFinish, loading }) => {
  const hasSkills = selected.length > 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10 sm:mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#e87315]/20 rounded-full blur-[50px] pointer-events-none" />
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic relative z-10">
          Your Core <span className="text-[#e87315]">Arsenal</span>
        </h2>
        <p className="text-sm sm:text-base font-bold tracking-[0.1em] text-white/60 mt-4 max-w-lg mx-auto">
          Select your primary expertise. This data feeds directly into the AI Matching Engine.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {options.map(skill => {
          const isSelected = selected.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => toggle(skill)}
              className={`relative px-5 sm:px-6 py-4 sm:py-5 transition-all duration-300 text-left overflow-hidden group rounded-lg border ${
                isSelected ? 'border-[#e87315] bg-[#e87315]/10 shadow-[0_0_20px_rgba(232,115,21,0.2)]' : 'border-white/20 bg-[#161616] hover:border-white/50 hover:bg-[#202020]'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className={`text-sm sm:text-base font-bold tracking-widest ${
                  isSelected ? 'text-[#e87315]' : 'text-white/70 group-hover:text-white'
                }`}>
                  {skill}
                </span>
                {isSelected && <div className="w-2 h-2 bg-[#e87315] rotate-45" />}
              </div>
              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#e87315]" />}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onFinish}
          disabled={!hasSkills || loading}
          className={`group relative px-10 sm:px-14 py-4 sm:py-5 overflow-hidden transition-all duration-300 border-2 w-full sm:w-auto rounded-xl ${
            hasSkills ? 'border-[#e87315] bg-[#0c0c0c] text-[#e87315] hover:text-black cursor-pointer shadow-[0_0_30px_rgba(232,115,21,0.3)]' : 'border-white/20 bg-[#161616] text-white/30 cursor-not-allowed'
          }`}
        >
          {hasSkills && !loading && (
            <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          )}
          <span className="relative z-10 text-sm sm:text-base font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />Initializing...</>
            ) : hasSkills ? (
              <>Complete Setup <Zap size={18} /></>
            ) : (
              'Select at least 1 skill'
            )}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

// --- INVESTOR DETAILS VIEW (Step 2) ---
const InvestorDetailsView = ({ firmName, setFirmName, ticketSize, setTicketSize, onNext }) => {
  return (
    <div className="w-full max-w-3xl text-left">
      <span className="text-[#e87315] font-black tracking-widest text-sm uppercase mb-3 block underline underline-offset-4 decoration-2">
        Capital Identity
      </span>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter mb-10 uppercase leading-none">
        Firm or <span className="text-[#e87315]">Syndicate?</span>
      </h2>
      
      <div className="relative mb-14">
        <input
          type="text"
          placeholder="ENTER FIRM / ANGEL NAME..."
          onChange={(e) => setFirmName(e.target.value)}
          value={firmName}
          className="w-full bg-transparent border-b-4 border-white/30 focus:border-[#e87315] py-4 sm:py-5 text-2xl sm:text-3xl lg:text-4xl font-black italic outline-none transition-colors duration-300 placeholder:text-white/20 uppercase tracking-tight caret-[#e87315]"
        />
        <div className={`absolute bottom-0 left-0 h-[4px] bg-[#e87315] transition-all duration-500 ${firmName ? 'w-full' : 'w-0'}`} />
      </div>

      <div className="mb-14">
        <span className="text-white/70 font-bold tracking-[0.15em] text-sm uppercase mb-5 block">Standard Ticket Size</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TICKET_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setTicketSize(size)}
              className={`py-5 px-3 text-center border-2 font-black tracking-widest text-sm sm:text-base rounded-xl transition-all duration-300 ${
                ticketSize === size 
                  ? 'bg-[#e87315] text-black border-[#e87315] shadow-[0_0_20px_rgba(232,115,21,0.3)]' 
                  : 'bg-[#161616] text-white/70 border-white/20 hover:border-white/50 hover:bg-[#202020] hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
        <button
          onClick={onNext}
          disabled={!ticketSize}
          className="bg-white text-black px-10 sm:px-14 py-4 sm:py-5 rounded-xl font-black uppercase italic text-base sm:text-xl hover:bg-[#e87315] hover:text-white transition-all shadow-[6px_6px_0px_#e87315] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Next Phase 
        </button>
      </div>
    </div>
  );
};

// --- INVESTOR PREFERENCES VIEW (Step 3) ---
const InvestorPreferencesView = ({ sectors, setSectors, stages, setStages, onFinish, loading }) => {
  const toggleSector = (item) => {
    setSectors(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const toggleStage = (item) => {
    setStages(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const isReady = sectors.length > 0 && stages.length > 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#e87315]/20 rounded-full blur-[60px] pointer-events-none" />
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic relative z-10">
          Investment <span className="text-[#e87315]">Thesis</span>
        </h2>
        <p className="text-sm sm:text-base font-bold tracking-[0.1em] text-white/60 mt-4 max-w-lg mx-auto">
          Select target parameters to calibrate your deal flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 mb-12">
        {/* Sectors */}
        <div>
          <h3 className="text-[#e87315] text-sm font-black tracking-[0.2em] uppercase mb-5 border-b border-white/20 pb-3">Sectors of Interest</h3>
          <div className="flex flex-wrap gap-3">
            {INVESTOR_SECTORS.map(sector => {
              const isSelected = sectors.includes(sector);
              return (
                <button
                  key={sector}
                  onClick={() => toggleSector(sector)}
                  className={`px-5 py-3 border-2 text-sm font-bold tracking-widest transition-all rounded-lg ${
                    isSelected ? 'border-[#e87315] bg-[#e87315]/10 text-[#e87315] shadow-[0_0_15px_rgba(232,115,21,0.2)]' : 'border-white/20 bg-[#161616] text-white/70 hover:border-white/50 hover:bg-[#202020] hover:text-white'
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stages */}
        <div>
          <h3 className="text-[#e87315] text-sm font-black tracking-[0.2em] uppercase mb-5 border-b border-white/20 pb-3">Target Stages</h3>
          <div className="flex flex-col gap-3">
            {INVESTOR_STAGES.map(stage => {
              const isSelected = stages.includes(stage);
              return (
                <button
                  key={stage}
                  onClick={() => toggleStage(stage)}
                  className={`w-full text-left px-5 py-4 border-2 text-sm sm:text-base font-bold tracking-widest transition-all rounded-xl ${
                    isSelected ? 'border-[#e87315] bg-[#e87315] text-black shadow-[0_0_15px_rgba(232,115,21,0.3)]' : 'border-white/20 bg-[#161616] text-white/70 hover:border-white/50 hover:bg-[#202020] hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onFinish}
          disabled={!isReady || loading}
          className={`group relative px-10 sm:px-14 py-4 sm:py-5 overflow-hidden transition-all duration-300 border-2 w-full sm:w-auto rounded-xl ${
            isReady ? 'border-[#e87315] bg-[#0c0c0c] text-[#e87315] hover:text-black cursor-pointer shadow-[0_0_30px_rgba(232,115,21,0.3)]' : 'border-white/20 bg-[#161616] text-white/30 cursor-not-allowed'
          }`}
        >
          {isReady && !loading && (
            <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          )}
          <span className="relative z-10 text-sm sm:text-base font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />Calibrating...</>
            ) : isReady ? (
              <>Initialize Dashboard <Target size={18} /></>
            ) : (
              'Select Sectors & Stages'
            )}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const Onboarding = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [hoveredGender, setHoveredGender] = useState(null);
  const [role, setRole] = useState(null);
  const [gender, setGender] = useState(null);
  
  // Student / Mentor state
  const [college, setCollege] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Investor state
  const [firmName, setFirmName] = useState('');
  const [ticketSize, setTicketSize] = useState('');
  const [sectorsOfInterest, setSectorsOfInterest] = useState([]);
  const [targetStages, setTargetStages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = role === 'investor' ? 4 : (role === 'student' ? 4 : 3);

  const handleFinalize = async () => {
    setLoading(true);
    setError('');

    if (!gender) {
      setError('Identity protocol incomplete.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role,
        gender: gender.toLowerCase(),
        college: college || 'Not specified',
        skills: selectedSkills,
        firmName: firmName || 'Independent Angel',
        ticketSize,
        sectorsOfInterest,
        targetStages
      };

      console.log("FINAL PAYLOAD:", payload);

      const response = await authAPI.completeOnboarding(payload);
      const updatedUser = response.data.user;
      console.log("UPDATED USER FROM API:", updatedUser); 

      // FORCE UPDATE
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // DELAY NAVIGATION
      setTimeout(() => {
        if (role === 'student') navigate('/dashboard');
        else if (role === 'mentor') navigate('/mentor/dashboard');
        else navigate('/investor');
      }, 100);

    } catch (err) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Protocol failure. Retrying Connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const identityCards = [
    { id: 'student', title: 'STUDENT', sub: 'BUILDER', num: '01' },
    { id: 'mentor', title: 'MENTOR', sub: 'ARCHITECT', num: '02' },
    { id: 'investor', title: 'INVESTOR', sub: 'OVERSEER', num: '03' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-32 sm:pt-40 lg:pt-32 overflow-x-hidden relative font-sans">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ea580c10,transparent)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* --- FIXED TOP NAVIGATION BAR --- */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 py-5 sm:py-6 shadow-2xl">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center relative px-4">
          
          {/* GO BACK BUTTON */}
          <AnimatePresence>
            {step > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={prevStep}
                className="absolute left-4 sm:left-8 flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-[0.2em] text-white/40 hover:text-[#e87315] transition-colors uppercase border-b border-transparent hover:border-[#e87315] pb-1"
              >
                <span className="hidden sm:inline">- [ Go Back ]</span>
                <span className="sm:hidden">&larr; Back</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="w-full max-w-[200px] sm:max-w-md px-2 sm:px-6 mt-2">
            <div className="flex justify-between mb-2 sm:mb-3 relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10" />
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 bg-[#050505] px-1 sm:px-3">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 flex items-center justify-center ${
                    step > i ? 'bg-[#e87315]' : step === i ? 'border-2 border-[#e87315] bg-[#e87315]/20 shadow-[0_0_10px_rgba(232,115,21,0.5)]' : 'bg-white/20'
                  }`}>
                    {step > i && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
              Phase 0{step + 1} // 0{totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-red-500/20 border border-red-500/50 text-red-300 text-[11px] sm:text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl backdrop-blur-xl shadow-2xl"
          >
            [ ERROR ] {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* STEP 0: ROLE SELECTION */}
        {step === 0 && (
          <motion.div
            key="selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-7xl"
          >
            <div className="text-center mb-16 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#e87315]/20 rounded-full blur-[60px] pointer-events-none" />
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic relative z-10">
                Identify <span className="text-[#e87315]">Class</span>
              </h1>
              <p className="text-sm sm:text-base font-bold tracking-[0.2em] text-white/60 uppercase mt-4">
                Select your primary operational directive.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {identityCards.map((card) => (
                <motion.div variants={itemVariants} key={card.id}>
                  <IdentityCard
                    id={card.id}
                    title={card.title}
                    sub={card.sub}
                    num={card.num}
                    onClick={() => setRole(card.id)}
                    isActive={hoveredRole === card.id || role === card.id}
                    onHover={setHoveredRole}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="mt-16 flex justify-center">
              <button
                onClick={() => setStep(1)}
                disabled={!role}
                className={`group relative px-12 sm:px-16 py-4 sm:py-5 overflow-hidden transition-all duration-300 border-2 rounded-xl ${
                  role ? 'border-[#e87315] bg-transparent text-[#e87315] hover:text-black cursor-pointer shadow-[0_0_20px_rgba(232,115,21,0.3)]' : 'border-white/20 bg-[#161616] text-white/30 cursor-not-allowed'
                }`}
              >
                {role && <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
                <span className="relative z-10 text-sm sm:text-base font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  Proceed <ArrowRight size={18} className={role ? 'group-hover:translate-x-1 transition-transform' : ''} />
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 1: GENDER SELECTION */}
        {step === 1 && (
          <motion.div
            key="gender"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl"
          >
            <div className="flex items-end justify-between mb-8 sm:mb-12 border-b border-white/20 pb-6 sm:pb-8">
              <div>
                <span className="text-[#e87315] font-black tracking-widest text-sm uppercase mb-3 block">Identity Protocol</span>
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
                  GENDER<br /> <span className="text-[#e87315]">...</span>
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
              <GenderCard
                id="male"
                title="MALE"
                sub="IDENTITY"
                image={GENDER_IMAGES.male}
                isHovered={hoveredGender === 'male'}
                onHover={setHoveredGender}
                selected={gender === 'male'}
                onClick={() => setGender('male')}
              />
              <GenderCard
                id="female"
                title="FEMALE"
                sub="IDENTITY"
                image={GENDER_IMAGES.female}
                isHovered={hoveredGender === 'female'}
                onHover={setHoveredGender}
                selected={gender === 'female'}
                onClick={() => setGender('female')}
              />
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={nextStep}
                disabled={!gender}
                className="bg-white text-black px-10 sm:px-14 py-4 sm:py-5 rounded-xl font-black uppercase italic text-base sm:text-xl hover:bg-[#e87315] hover:text-white transition-all shadow-[6px_6px_0px_#e87315] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Next Phase
              </button>
              {!gender && (
                <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                  Select to continue
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2: COLLEGE (Student) / SKILLS (Mentor) / DETAILS (Investor) */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center px-2 sm:px-0"
          >
            {role === 'student' && (
              <div className="w-full max-w-2xl text-left">
                <span className="text-[#e87315] font-black tracking-widest text-sm uppercase mb-3 block underline underline-offset-4 decoration-2">
                  Institutional Identity
                </span>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter mb-10 uppercase leading-none">
                  Where do you <span className="text-[#e87315]">Study?</span>
                </h2>
                <div className="relative mb-14">
                  <input
                    type="text"
                    placeholder="CAMPUS NAME..."
                    onChange={(e) => setCollege(e.target.value)}
                    value={college}
                    className="w-full bg-transparent border-b-4 border-white/30 focus:border-[#e87315] py-4 sm:py-5 text-3xl sm:text-4xl lg:text-5xl font-black italic outline-none transition-colors duration-300 placeholder:text-white/20 uppercase tracking-tight caret-[#e87315]"
                  />
                  <div className={`absolute bottom-0 left-0 h-[4px] bg-[#e87315] transition-all duration-500 ${college ? 'w-full' : 'w-0'}`} />
                </div>
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
                  <button
                    onClick={nextStep}
                    disabled={!college.trim()}
                    className="bg-white text-black px-10 sm:px-14 py-4 sm:py-5 rounded-xl font-black uppercase italic text-base sm:text-xl hover:bg-[#e87315] hover:text-white transition-all shadow-[6px_6px_0px_#e87315] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Next Phase 
                  </button>
                  <button
                    onClick={() => { setCollege('Not specified'); nextStep(); }}
                    className="text-white/50 font-black hover:text-[#e87315] transition-colors uppercase text-sm tracking-[0.1em]"
                  >
                    Skip Protocol
                  </button>
                </div>
              </div>
            )}

            {role === 'mentor' && (
              <CoreSkillsView
                options={CORE_SKILLS}
                selected={selectedSkills}
                toggle={toggleSkill}
                onFinish={handleFinalize}
                loading={loading}
              />
            )}

            {role === 'investor' && (
              <InvestorDetailsView
                firmName={firmName}
                setFirmName={setFirmName}
                ticketSize={ticketSize}
                setTicketSize={setTicketSize}
                onNext={nextStep}
              />
            )}
          </motion.div>
        )}

        {/* STEP 3: SKILLS (Student) / PREFERENCES (Investor) */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center px-2 sm:px-0"
          >
            {role === 'student' && (
              <CoreSkillsView
                options={CORE_SKILLS}
                selected={selectedSkills}
                toggle={toggleSkill}
                onFinish={handleFinalize}
                loading={loading}
              />
            )}

            {role === 'investor' && (
              <InvestorPreferencesView
                sectors={sectorsOfInterest}
                setSectors={setSectorsOfInterest}
                stages={targetStages}
                setStages={setTargetStages}
                onFinish={handleFinalize}
                loading={loading}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Onboarding;