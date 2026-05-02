import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// --- INVESTOR LOCKED CARD ---
const InvestorLockedCard = ({ onBack }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="w-full max-w-md mx-auto"
  >
    <div className="relative bg-[#0A0A0A] border border-white/10 p-8 sm:p-12 text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      <span className="text-orange-500 font-black tracking-widest text-xs uppercase block mb-3">Coming Soon</span>
      <h3 className="text-3xl sm:text-4xl font-black italic uppercase text-white mb-4 leading-tight">
        Investor <br /> Protocol
      </h3>
      <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-2">
        The Investor portal is currently under development. We're building powerful tools for deal flow, portfolio tracking, and founder discovery.
      </p>
      <p className="text-orange-500/70 text-xs font-bold uppercase tracking-widest mb-8">
        Early access launching soon.
      </p>
      <button
        onClick={onBack}
        className="flex items-center gap-2 mx-auto text-xs font-black tracking-[0.3em] text-white/40 hover:text-orange-500 transition-colors uppercase border-b border-transparent hover:border-orange-500 pb-1"
      >
        ← Choose Another Role
      </button>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
    </div>
  </motion.div>
);

// --- IDENTITY CARD ---
const IdentityCard = ({ id, title, sub, num, onClick, isHovered, onHover, locked }) => {
  return (
    <motion.button
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] w-full group overflow-hidden bg-[#0A0A0A] border border-white/5"
    >
      <div className={`absolute inset-0 z-10 transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>
      <motion.span
        animate={{ y: isHovered ? -20 : 0, opacity: isHovered ? 0.07 : 0.03 }}
        className="absolute -right-2 -bottom-6 text-[6rem] sm:text-[9rem] lg:text-[15rem] font-black italic leading-none pointer-events-none select-none text-white"
      >
        {num}
      </motion.span>
      <div className="relative z-20 h-full p-5 sm:p-7 lg:p-10 flex flex-col justify-between items-start text-left">
        <div className="space-y-1 sm:space-y-2">
          <motion.div animate={{ x: isHovered ? 10 : 0 }} className="flex items-center gap-2">
            <div className={`h-1 transition-all duration-500 ${isHovered ? 'bg-orange-500 w-10' : 'bg-white/20 w-5'}`} />
            <span className="text-[9px] sm:text-[10px] font-black tracking-[0.4em] sm:tracking-[0.5em] text-orange-500 uppercase">{sub}</span>
          </motion.div>
          <h3 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic transition-all duration-500 ${isHovered ? 'text-white translate-x-2' : 'text-white/40'}`}>
            {title}
          </h3>
          {locked && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-orange-500/60 uppercase">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Coming Soon
            </span>
          )}
        </div>
        <div className="w-full">
          <div className={`overflow-hidden transition-all duration-500 ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 max-w-[200px]">
              {locked ? 'This feature is coming soon. Tap to learn more.' : `Access the Evolve ${title.toLowerCase()} protocol and initialize your dashboard.`}
            </p>
          </div>
          <div className={`flex items-center justify-between w-full border-t pt-3 sm:pt-4 transition-colors duration-500 ${isHovered ? 'border-orange-500/50' : 'border-white/10'}`}>
            <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest ${isHovered ? 'text-orange-500' : 'text-white/20'}`}>
              {isHovered ? (locked ? 'VIEW_DETAILS' : 'READY_TO_PROCEED') : 'AWAITING_SELECTION'}
            </span>
            <div className={`transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// --- INTERESTS VIEW ---
const InterestsView = ({ options, selected, toggle, onFinish, onSkip, loading }) => (
  <div className="w-full max-w-3xl px-2 sm:px-0">
    <span className="text-orange-500 font-black tracking-widest text-xs uppercase mb-2 block">Focus Sectors</span>
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter mb-6 sm:mb-8 uppercase leading-none">
      Markets of <span className="text-orange-500">Choice?</span>
    </h2>
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12">
      {options.map((item) => (
        <button
          key={item}
          onClick={() => toggle(item)}
          className={`px-4 sm:px-6 py-2 sm:py-3 border-2 font-bold uppercase italic text-sm sm:text-base transition-all duration-300 ${
            selected.includes(item)
              ? 'bg-orange-500 border-orange-500 text-white shadow-[4px_4px_0px_white]'
              : 'border-white/10 text-gray-500 hover:border-white hover:text-white'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
      <button
        onClick={onFinish}
        disabled={loading}
        className="bg-white text-black px-8 sm:px-12 py-4 sm:py-5 font-black uppercase italic text-base sm:text-lg hover:bg-orange-500 hover:text-white transition-all shadow-[6px_6px_0px_#ea580c] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'INITIALIZING...' : 'Initialize Dashboard →'}
      </button>
      <button
        onClick={onSkip}
        disabled={loading}
        className="text-gray-500 font-black hover:text-white transition-colors uppercase text-xs tracking-[0.2em] disabled:opacity-50"
      >
        Skip Protocol
      </button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const Onboarding = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [role, setRole] = useState(null);
  const [college, setCollege] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInvestorCard, setShowInvestorCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // THE REAL FIX — calls backend, sets user properly
  const handleFinalize = async (skipInterests = false) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        role,
        college: college || 'Not specified',
        skills: skipInterests ? [] : selectedInterests,
        onboardingData: {}
      };

      const response = await axios.patch(
        'https://evolve-website.onrender.com/api/auth/onboarding',
        payload
      );

      // Update AuthContext — this gives user hasCompletedOnboarding: true + role
      // so ProtectedRoute and Dashboard both work immediately
      setUser(response.data.user);

      // Navigate — ProtectedRoute will now let this through because
      // user.hasCompletedOnboarding is true and user.role is set
      navigate('/dashboard');

    } catch (err) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = ["AI & ML", "SaaS", "FinTech", "Web3", "EdTech", "Design", "Hardware"];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const containerVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-hidden relative font-sans">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ea580c10,transparent)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-[200] bg-red-500/20 border border-red-500/50 text-red-300 text-sm font-bold px-6 py-3 rounded-xl backdrop-blur-xl"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GO BACK BUTTON */}
      <AnimatePresence>
        {step > 0 && !showInvestorCard && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={prevStep}
            className="absolute top-5 left-4 sm:top-10 sm:left-10 z-[100] flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/30 hover:text-orange-500 transition-colors uppercase border-b border-transparent hover:border-orange-500 pb-1"
          >
            ← [ Go Back ]
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* INVESTOR LOCKED CARD */}
        {showInvestorCard && (
          <motion.div
            key="investor-locked"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center px-2"
          >
            <InvestorLockedCard onBack={() => { setShowInvestorCard(false); setRole(null); }} />
          </motion.div>
        )}

        {/* STEP 0: ROLE SELECTION */}
        {step === 0 && !showInvestorCard && (
          <motion.div
            key="selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-7xl"
          >
            <div className="flex items-end justify-between mb-6 sm:mb-10 lg:mb-12 border-b border-white/5 pb-5 sm:pb-8">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
                Who are <br /> <span className="text-orange-500">You.</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <IdentityCard
                id="student"
                title="STUDENT"
                sub="BUILDER"
                num="01"
                isHovered={hoveredRole === 'student'}
                onHover={setHoveredRole}
                onClick={() => { setRole('student'); setStep(1); }}
              />
              <IdentityCard
                id="mentor"
                title="MENTOR"
                sub="EXPERT"
                num="02"
                isHovered={hoveredRole === 'mentor'}
                onHover={setHoveredRole}
                onClick={() => { setRole('mentor'); setStep(1); }}
              />
              <IdentityCard
                id="investor"
                title="INVESTOR"
                sub="CAPITAL"
                num="03"
                locked
                isHovered={hoveredRole === 'investor'}
                onHover={setHoveredRole}
                onClick={() => setShowInvestorCard(true)}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 1 */}
        {step === 1 && !showInvestorCard && (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center px-2 sm:px-0"
          >
            {/* STUDENT: College */}
            {role === 'student' && (
              <div className="w-full max-w-2xl text-left">
                <span className="text-orange-500 font-black tracking-widest text-xs uppercase mb-2 block underline underline-offset-4 decoration-2">
                  Institutional Identity
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter mb-8 sm:mb-10 uppercase leading-none">
                  Where do you <span className="text-orange-500">Study?</span>
                </h2>
                <div className="relative mb-10 sm:mb-12">
                  <input
                    type="text"
                    placeholder="CAMPUS NAME..."
                    onChange={(e) => setCollege(e.target.value)}
                    value={college}
                    className="w-full bg-transparent border-b-4 border-white/30 focus:border-orange-500 py-3 sm:py-4 text-2xl sm:text-3xl lg:text-4xl font-black italic outline-none transition-colors duration-300 placeholder:text-white/10 uppercase tracking-tight caret-orange-500"
                  />
                  <div className={`absolute bottom-0 left-0 h-[4px] bg-orange-500 transition-all duration-500 ${college ? 'w-full' : 'w-0'}`} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  <button
                    onClick={nextStep}
                    disabled={!college.trim()}
                    className="bg-white text-black px-8 sm:px-12 py-4 sm:py-5 font-black uppercase italic text-base sm:text-xl hover:bg-orange-500 hover:text-white transition-all shadow-[6px_6px_0px_#ea580c] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Next Phase →
                  </button>
                  <button
                    onClick={() => { setCollege('Not specified'); nextStep(); }}
                    className="text-gray-500 font-black hover:text-white transition-colors uppercase text-xs tracking-[0.2em]"
                  >
                    Skip Protocol
                  </button>
                </div>
              </div>
            )}

            {/* MENTOR: Interests */}
            {role === 'mentor' && (
              <InterestsView
                options={interestOptions}
                selected={selectedInterests}
                toggle={toggleInterest}
                onFinish={() => handleFinalize(false)}
                onSkip={() => handleFinalize(true)}
                loading={loading}
              />
            )}
          </motion.div>
        )}

        {/* STEP 2: INTERESTS — Student only */}
        {step === 2 && role === 'student' && !showInvestorCard && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center px-2 sm:px-0"
          >
            <InterestsView
              options={interestOptions}
              selected={selectedInterests}
              toggle={toggleInterest}
              onFinish={() => handleFinalize(false)}
              onSkip={() => handleFinalize(true)}
              loading={loading}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Onboarding;