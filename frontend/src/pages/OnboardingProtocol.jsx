import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const IdentityCard = ({ id, title, sub, num, onClick, isHovered, onHover }) => {
  return (
    <motion.button
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="relative h-[400px] w-full group overflow-hidden bg-[#0A0A0A] border border-white/5"
    >
      <div className={`absolute inset-0 z-10 transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>

      <motion.span
        animate={{ y: isHovered ? -20 : 0, opacity: isHovered ? 0.07 : 0.03 }}
        className="absolute -right-4 -bottom-10 text-[15rem] font-black italic leading-none pointer-events-none select-none text-white"
      >
        {num}
      </motion.span>

      <div className="relative z-20 h-full p-10 flex flex-col justify-between items-start text-left">
        <div className="space-y-2">
          <motion.div animate={{ x: isHovered ? 10 : 0 }} className="flex items-center gap-2">
            <div className={`h-1 w-6 transition-all duration-500 ${isHovered ? 'bg-orange-500 w-12' : 'bg-white/20'}`} />
            <span className="text-[10px] font-black tracking-[0.5em] text-orange-500 uppercase">{sub}</span>
          </motion.div>
          <h3 className={`text-6xl font-black italic transition-all duration-500 ${isHovered ? 'text-white translate-x-2' : 'text-white/40'}`}>
            {title}
          </h3>
        </div>

        <div className="w-full">
          <div className={`overflow-hidden transition-all duration-500 ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-400 text-sm font-medium mb-6 max-w-[200px]">
              Access the Evolve {title.toLowerCase()} protocol and initialize your dashboard.
            </p>
          </div>
          <div className={`flex items-center justify-between w-full border-t pt-4 transition-colors duration-500 ${isHovered ? 'border-orange-500/50' : 'border-white/10'}`}>
            <span className={`text-[10px] font-bold tracking-widest ${isHovered ? 'text-orange-500' : 'text-white/20'}`}>
              {isHovered ? 'READY_TO_PROCEED' : 'AWAITING_SELECTION'}
            </span>
            <div className={`transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
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

const InterestsView = ({ options, selected, toggle, onFinish, loading }) => (
  <div className="w-full max-w-3xl">
    <span className="text-orange-500 font-black tracking-widest text-xs uppercase mb-2 block">Focus Sectors</span>
    <h2 className="text-6xl font-black italic tracking-tighter mb-8 uppercase leading-none">
      Markets of <span className="text-orange-500">Choice?</span>
    </h2>
    <div className="flex flex-wrap gap-3 mb-12">
      {options.map((item) => (
        <button
          key={item}
          onClick={() => toggle(item)}
          className={`px-6 py-3 border-2 font-bold uppercase italic transition-all duration-300 ${selected.includes(item)
            ? 'bg-orange-500 border-orange-500 text-white shadow-[4px_4px_0px_white]'
            : 'border-white/10 text-gray-500 hover:border-white hover:text-white'
            }`}
        >
          {item}
        </button>
      ))}
    </div>
    <button
      onClick={onFinish}
      disabled={loading}
      className="bg-white text-black px-12 py-5 font-black uppercase italic hover:bg-orange-500 hover:text-white transition-all shadow-[6px_6px_0px_#ea580c] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'INITIALIZING...' : 'Initialize Dashboard'}
    </button>
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
  const [ticketSize, setTicketSize] = useState('');
  const [loading, setLoading] = useState(false);

  // --- THE UNIFIED FINALIZE FUNCTION ---
  const handleFinalize = async (additionalData = {}) => {
    setLoading(true);

    try {
      // Prepare payload matching your backend expectations
      const payload = {
        role: role, // 'student' -> 'Student'
        college: college || 'Not specified',
        location: '', // Optional - add if you have location input
        skills: selectedInterests, // Array of interests
        onboardingData: {
          ticketSize: ticketSize || null, // For investors
          needsPartner: additionalData.needsPartner || null, // For students
          ...additionalData
        }
      };

      // console.log('Sending onboarding data:', payload);

      // Send to backend (token already in axios defaults from AuthContext)
      const response = await axios.patch('https://evolve-website.onrender.com/api/auth/onboarding', payload);

      // console.log('Backend response:', response.data);

      // Update user in AuthContext
      setUser(response.data.user);

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error) {
      // console.error('Onboarding failed:', error);
      alert(error.response?.data?.message || 'Failed to complete onboarding');
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
    <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center p-8 overflow-hidden relative font-sans">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ea580c10,transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* GO BACK BUTTON */}
      <AnimatePresence>
        {step > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={prevStep}
            className="absolute top-10 left-10 z-[100] flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/30 hover:text-orange-500 transition-colors uppercase border-b border-transparent hover:border-orange-500 pb-1"
          >
            ← [ Go Back ]
          </motion.button>
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
            <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
              <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
                Who are <br /> <span className="text-orange-500">You.</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                isHovered={hoveredRole === 'investor'}
                onHover={setHoveredRole}
                onClick={() => { setRole('investor'); setStep(1); }}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 1: ROLE-SPECIFIC QUESTIONS */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center"
          >
            {/* STUDENT: College Input */}
            {role === 'student' && (
              <div className="w-full max-w-2xl text-left">
                <span className="text-orange-500 font-black tracking-widest text-xs uppercase mb-2 block underline underline-offset-4 decoration-2">
                  Institutional Identity
                </span>
                <h2 className="text-6xl font-black italic tracking-tighter mb-10 uppercase leading-none">
                  Where do you <span className="text-orange-500">Study?</span>
                </h2>
                <input
                  type="text"
                  placeholder="Campus name..."
                  onChange={(e) => setCollege(e.target.value)}
                  value={college}
                  className="w-full bg-transparent border-b-8 border-white py-4 text-5xl font-black italic outline-none focus:border-orange-500 transition-all mb-12 placeholder:text-white/5 uppercase"
                />
                <div className="flex gap-6 items-center">
                  <button
                    onClick={nextStep}
                    disabled={!college.trim()}
                    className="bg-white text-black px-12 py-5 font-black uppercase italic text-xl hover:bg-orange-500 hover:text-white transition-all shadow-[6px_6px_0px_#ea580c] disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* INVESTOR: Ticket Size */}
            {role === 'investor' && (
              <div className="w-full max-w-2xl text-left">
                <span className="text-orange-500 font-black tracking-widest text-xs uppercase mb-2 block underline underline-offset-4 decoration-2">
                  Portfolio Strategy
                </span>
                <h2 className="text-6xl font-black italic tracking-tighter mb-10 uppercase leading-none">
                  Ticket <span className="text-orange-500">Size?</span>
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {['$5k - $25k', '$25k - $100k', '$100k - $500k', '$500k+'].map(size => (
                    <button
                      key={size}
                      onClick={() => { setTicketSize(size); nextStep(); }}
                      className="p-8 border-4 border-white/10 font-black italic text-2xl uppercase hover:border-orange-500 hover:bg-orange-500/5 hover:text-orange-500 transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setTicketSize('Private'); nextStep(); }}
                  className="text-gray-500 font-black hover:text-white transition-colors uppercase text-xs tracking-[0.2em]"
                >
                  Private Disclosure
                </button>
              </div>
            )}

            {/* MENTOR: Go straight to interests */}
            {role === 'mentor' && (
              <InterestsView
                options={interestOptions}
                selected={selectedInterests}
                toggle={toggleInterest}
                onFinish={() => handleFinalize({})}
                loading={loading}
              />
            )}
          </motion.div>
        )}

        {/* STEP 2: INTERESTS (Student & Investor) */}
        {step === 2 && (role === 'student' || role === 'investor') && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex justify-center"
          >
            <InterestsView
              options={interestOptions}
              selected={selectedInterests}
              toggle={toggleInterest}
              onFinish={role === 'investor' ? () => handleFinalize({}) : nextStep}
              loading={loading}
            />
          </motion.div>
        )}

        {/* STEP 3: PARTNER (Student Only) */}
        {step === 3 && role === 'student' && (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-3xl text-center"
          >
            <h2 className="text-8xl font-black italic uppercase mb-12 tracking-tighter leading-none">
              Need a <span className="text-orange-500">TeamMate?</span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => handleFinalize({ needsPartner: true })}
                disabled={loading}
                className="bg-white text-black p-10 font-black italic text-3xl uppercase hover:bg-orange-500 hover:text-white transition-all shadow-[8px_8px_0px_#ea580c] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'LOADING...' : 'YES'}
              </button>
              <button
                onClick={() => handleFinalize({ needsPartner: false })}
                disabled={loading}
                className="border-4 border-white/10 p-10 font-black italic text-3xl uppercase text-white/20 hover:text-white hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'LOADING...' : 'NO'}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Onboarding;