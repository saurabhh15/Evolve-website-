import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, GraduationCap, MessageSquare, MapPin,
  ChevronRight, X, CheckCircle2, Zap, Star, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { userAPI, connectionAPI, projectAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['All Mentors', 'Engineering', 'Product & Design', 'Business & Growth'];

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isAvailable = status === 'Accepting Mentees';
  return (
    <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-l-2 transition-all duration-500 ${isAvailable ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-[#e87315]/10 border-[#e87315] text-[#e87315]'}`}>
      <div className="relative flex h-2 w-2">
        {isAvailable && <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-30" />}
        <span className={`relative inline-flex h-2 w-2 ${isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#e87315]'}`} />
      </div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] italic">{status}</span>
      <div className={`ml-1 w-1.5 h-1.5 opacity-40 ${isAvailable ? 'bg-emerald-500' : 'bg-[#e87315]'}`} />
    </div>
  );
};

// ── Mentor Card (Updated to support AI Match Info) ────────────────────────────
const MentorCard = ({ mentor, isAccepted, isPending, matchScore, aiReason, rank }) => {
  const [connecting, setConnecting] = useState(false);
  const [localPending, setLocalPending] = useState(isPending);
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (isAccepted || localPending || connecting) return;
    setConnecting(true);
    try {
      await connectionAPI.send({ to: mentor._id, type: 'mentor-request', message: `Hi ${mentor.name}, I'd love to connect and learn from your expertise!` });
      setLocalPending(true);
    } catch (err) { console.error(err); }
    finally { setConnecting(false); }
  };

  const scoreColor =
    matchScore >= 75 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
    matchScore >= 50 ? 'text-[#e87315] border-[#e87315]/40 bg-[#e87315]/10' :
    'text-white/50 border-white/20 bg-white/[0.04]';

  return (
    <motion.div 
      initial={matchScore ? { opacity: 0, y: 20 } : false}
      animate={matchScore ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4, delay: rank ? rank * 0.08 : 0 }}
      onClick={() => navigate(`/dashboard/mentor/${mentor._id}`)} 
      className={`group relative flex flex-col bg-[#0c0c0c] border hover:border-[#e87315]/50 transition-all duration-500 cursor-pointer shadow-2xl ${matchScore ? 'border-white/10' : 'border-white/20 animate-evolve-in'}`}
    >
      {/* AI Mode Accent Line */}
      {matchScore && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/20 to-transparent z-10" />
      )}

      {/* AI Mode Rank Watermark */}
      {rank !== undefined && (
        <span className="absolute top-3 right-4 text-[40px] font-black text-white/[0.03] leading-none select-none pointer-events-none z-10">
          {String(rank + 1).padStart(2, '0')}
        </span>
      )}

      <div className="absolute top-0 right-0 w-24 h-24 bg-[#e87315]/5 clip-path-poly opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative h-48 sm:h-56 overflow-hidden border-b border-white/10 flex-shrink-0">
        <img src={mentor.profileImage} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${mentor.name || 'U'}&bold=true`; }} alt={mentor.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
        <div className="absolute top-0 left-0"><StatusBadge status={mentor.mentorStatus} /></div>
        {mentor.isAlumni && (
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#e87315] rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-black text-white/90 uppercase tracking-[0.3em] italic bg-black/80 px-2.5 py-1.5 border border-white/20">ALUMNI // CLASS {mentor.gradYear}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 sm:p-8 gap-5 sm:gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-white/90 group-hover:text-[#e87315] transition-colors leading-none uppercase italic tracking-tighter truncate pr-2">{mentor.name}</h3>
            {matchScore ? (
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[11px] font-black uppercase tracking-wider flex-shrink-0 ${scoreColor}`}>
                <Zap size={11} /> {matchScore}%
              </div>
            ) : (
              mentor.rating >= 4.9 && <Star size={18} className="text-[#e87315] flex-shrink-0" fill="currentColor" />
            )}
          </div>
          <p className="text-[11px] sm:text-[12px] font-bold text-white/60 uppercase tracking-[0.4em] italic truncate">{mentor.role}</p>
        </div>

        {/* AI Match Reason Block */}
        {aiReason && (
          <div className="relative bg-[#080808] border-l-2 border-[#e87315]/40 px-3.5 py-3">
            <p className="text-[9px] font-black text-[#e87315]/70 uppercase tracking-[0.3em] mb-1.5 flex items-center gap-1.5">
              <Sparkles size={10} /> AI Reason
            </p>
            <p className="text-[11px] sm:text-[12px] text-white/65 font-medium leading-relaxed italic">"{aiReason}"</p>
          </div>
        )}

        <div className="grid grid-cols-3 border border-white/10 bg-white/[0.02]">
          <div className="p-3 sm:p-4 border-r border-white/10 text-center"><p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Score</p><span className="text-[13px] sm:text-[14px] font-black text-white/90 italic">{mentor.rating || 'N/A'}</span></div>
          <div className="p-3 sm:p-4 border-r border-white/10 text-center"><p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Units</p><span className="text-[13px] sm:text-[14px] font-black text-white/90 italic">{mentor.sessionsHeld || 0}</span></div>
          <div className="p-3 sm:p-4 text-center"><p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Reply</p><span className="text-[13px] sm:text-[14px] font-black text-[#e87315] italic">{mentor.responseTime?.replace('< ', '') || '48 hrs'}</span></div>
        </div>
        
        {!aiReason && (
          <p className="text-[11px] sm:text-[12px] font-medium text-white/50 leading-relaxed italic line-clamp-2 uppercase tracking-tight">"{mentor.bio}"</p>
        )}

        <div className="flex flex-wrap gap-2.5">{mentor.expertise?.slice(0, 3).map((skill, i) => <span key={i} className="px-3 sm:px-4 py-1.5 bg-white/[0.05] border border-white/10 text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-tighter italic group-hover:border-white/30 group-hover:text-white/80 transition-colors">{skill}</span>)}</div>
        
        <button onClick={(e) => { e.stopPropagation(); isAccepted ? navigate('/dashboard/messages') : handleConnect(); }} disabled={localPending || connecting} className={`w-full group/btn relative flex items-center justify-center gap-3 py-5 sm:py-5.5 text-[11px] sm:text-[12px] font-black tracking-[0.4em] transition-all duration-500 overflow-hidden uppercase italic border-l-4 mt-auto ${isAccepted ? 'bg-[#e87315] text-black border-black/20' : localPending ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 cursor-default' : connecting ? 'bg-[#0c0c0c] text-white/50 border-white/20 cursor-wait' : 'bg-white/10 text-white/90 border-transparent hover:bg-[#e87315] hover:text-black'}`}>
          {!localPending && !connecting && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none" />}
          {isAccepted ? <><MessageSquare size={18} strokeWidth={2.5} className="relative z-10" /><span className="relative z-10">INITIATE CONTACT</span></> : localPending ? <div className="flex items-center gap-2"><CheckCircle2 size={18} strokeWidth={2.5} className="animate-pulse" /><span>REQUEST Sent</span></div> : connecting ? <div className="flex items-center gap-4"><div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-1.5 h-3.5 bg-[#e87315] animate-bounce" style={{animationDelay:`${i*0.1}s`}}/>)}</div><span className="text-white/60 tracking-widest">SYNCING DATA...</span></div> : <><MessageSquare size={18} strokeWidth={2.5} className="relative z-10 transition-transform group-hover/btn:scale-110" /><span className="relative z-10">SEND REQUEST</span><div className="absolute right-6"><ChevronRight size={18} className="opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500 text-black" strokeWidth={3}/></div></>}
        </button>
      </div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const FindMentors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Mentors');
  const [alumniOnly, setAlumniOnly] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectedMentors, setConnectedMentors] = useState(new Set());
  const [acceptedMentors, setAcceptedMentors] = useState(new Set());
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_LIMIT = 9;

  // AI Matching State
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [aiMode, setAiMode] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mentorsRes, sentRes, networkRes] = await Promise.all([userAPI.getMentors(), connectionAPI.getSent(), connectionAPI.getNetwork()]);
        setMentors(Array.isArray(mentorsRes.data) ? mentorsRes.data : []);
        setConnectedMentors(new Set((sentRes.data||[]).filter(c=>c.type==='mentor-request'&&c.status==='pending').map(c=>c.to?._id)));
        setAcceptedMentors(new Set((networkRes.data||[]).filter(u=>u.role==='mentor').map(u=>u._id?.toString())));
      } catch (err) { setError(err.response?.data?.message||'Failed to load mentors.'); setMentors([]); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) return;
    projectAPI.getMyProjects()
      .then(res => { const d = res.data; setUserProjects(Array.isArray(d) ? d : d.projects || d.data || []); })
      .catch(() => setUserProjects([]));
  }, [user]);

  useEffect(() => { setPage(1); }, [searchTerm, activeCategory, alumniOnly]);

  const filteredMentors = useMemo(() => {
    if (!Array.isArray(mentors)) return [];
    
    // Clean the user's college string for safe comparison
    const myCollege = user?.college?.toLowerCase().trim();

    return mentors.filter(m => {
      // 1. Search Filter
      const matchesSearch = searchTerm === '' || 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (m.expertise || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) || 
        m.role?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category Filter
      const matchesCategory = activeCategory === 'All Mentors' || m.category === activeCategory;
      
      // 3. STRICT ALUMNI FILTER
      let matchesAlumni = true;
      if (alumniOnly) {
        const mentorCollege = m.college?.toLowerCase().trim();
        // It's a match ONLY if the user has a college, the mentor has a college, and they are exactly the same
        matchesAlumni = Boolean(myCollege && mentorCollege && myCollege === mentorCollege);
      }

      return matchesSearch && matchesCategory && matchesAlumni;
    });
  }, [searchTerm, activeCategory, alumniOnly, mentors, user?.college]);

  const visibleMentors = filteredMentors.slice(0, page * PAGE_LIMIT);
  const hasMore = visibleMentors.length < filteredMentors.length && !aiMode;
  const hasActiveFilters = searchTerm!==''||activeCategory!=='All Mentors'||alumniOnly;
  
  const clearAll = () => { setSearchTerm(''); setActiveCategory('All Mentors'); setAlumniOnly(false); setPage(1); };
  
  const handleLoadMore = () => { setLoadingMore(true); setTimeout(()=>{ setPage(p=>p+1); setLoadingMore(false); },600); };

  const handleFindMentors = async () => {
    if (!selectedProjectId) return;
    setAiMode(true);
    setIsAILoading(true);
    setAiError(null);
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseURL = isLocalhost ? 'http://localhost:5000' : 'https://evolve-website.onrender.com';
      const token = localStorage.getItem('token');

      const res = await axios.post(`${baseURL}/api/ai/suggest-mentors/${selectedProjectId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        withCredentials: true
      });
      setAiSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error('AI mentor suggestion failed:', err);
      setAiError('AI engine failed to rank mentors. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  const cancelAIMode = () => {
    setAiMode(false);
    setAiSuggestions([]);
    setSelectedProjectId('');
    setAiError(null);
  };

  if (loading) return <div className="w-full min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin" /></div>;
  if (error) return <div className="w-full min-h-screen flex items-center justify-center"><p className="text-red-400 font-semibold">{error}</p></div>;

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-16 bg-[#050505] min-h-screen text-white">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10 pb-16 border-b border-white/10">
        <div className="relative">
          <div className="absolute -left-6 top-0 w-[2px] h-full bg-[#e87315] hidden md:block" />
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white/90 mb-4 tracking-tighter italic uppercase leading-[0.8]">Find Mentors<span className="text-[#e87315]">.</span></h1>
          <div className="flex items-center gap-4"><div className="w-12 h-[2px] bg-[#e87315]/60" /><p className="text-white/60 font-bold tracking-[0.2em] uppercase text-[11px] sm:text-[12px] italic">Access the Evolve Expert Network.</p></div>
          <p className="mt-6 text-white/50 font-medium tracking-wide uppercase text-[14px] sm:text-[15px] max-w-xl leading-relaxed">Accelerate your startup journey with personalized guidance from Evolve's experts and alumni.</p>
        </div>
        {!aiMode && (
          <div className="relative w-full md:w-[450px] flex-shrink-0 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-[#e87315] transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Skill / Name / Company" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full bg-[#0c0c0c] border border-white/20 group-hover:border-white/40 focus:border-[#e87315]/50 rounded-none pl-16 pr-8 py-5 sm:py-6 text-[12px] sm:text-[13px] font-black text-white/90 placeholder-white/30 focus:outline-none transition-all uppercase tracking-widest italic" />
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/30" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/30" />
          </div>
        )}
      </header>

      {/* AI Finder Control Panel */}
      {user?.role === 'student' && !aiMode && (
        <div className="relative border border-white/10 bg-[#080808] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/40 to-transparent" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#e87315]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#e87315]/40" />

          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-9 h-9 border border-[#e87315]/40 bg-[#e87315]/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={16} className="text-[#e87315]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-[12px] font-black text-white/80 uppercase tracking-[0.5em] italic">AI Mentor Finder</h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-[#e87315]/20 bg-[#e87315]/[0.06]">
                    <span className="w-1.5 h-1.5 bg-[#e87315] rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-[#e87315]/70 uppercase tracking-[0.2em]">Gemini AI</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mt-1">Select a project · AI ranks mentors by expertise + embedding similarity</p>
              </div>
            </div>

            <div className="h-px bg-white/[0.06] mb-5" />

            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block">Your Project</label>
                <div className="relative">
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-white/15 hover:border-white/30 focus:border-[#e87315]/40 text-[11px] font-black text-white/70 uppercase tracking-wider px-4 py-3.5 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0c0c0c]">Select a project...</option>
                    {userProjects.length > 0
                      ? userProjects.map(p => <option key={p._id} value={p._id} className="bg-[#0c0c0c]">{p.title} · {p.category} [{p.stage}]</option>)
                      : <option disabled className="bg-[#0c0c0c] text-white/30">No projects yet</option>
                    }
                  </select>
                  <div className="absolute right-3.5 top-1/2 pointer-events-none w-2 h-2 border-r border-b border-white/30 rotate-45 -translate-y-[60%]" />
                </div>
              </div>

              <button
                onClick={handleFindMentors}
                disabled={!selectedProjectId}
                className={`group/find relative flex items-center gap-2.5 px-7 py-3.5 border overflow-hidden transition-all duration-400 flex-shrink-0 ${selectedProjectId ? 'border-[#e87315]/60 bg-[#e87315]/[0.08] text-[#e87315] hover:text-black cursor-pointer' : 'border-white/[0.08] bg-transparent text-white/20 cursor-not-allowed'}`}
              >
                {selectedProjectId && <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/find:translate-y-0 transition-transform duration-300 ease-out" />}
                <Sparkles size={14} className="relative z-10 flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic relative z-10 whitespace-nowrap">Find Mentors</span>
              </button>
            </div>

            {userProjects.length === 0 && (
              <div className="mt-4 flex items-center gap-3 px-4 py-3 border border-white/[0.06] bg-white/[0.01]">
                <div className="w-0.5 h-4 bg-[#e87315]/40" />
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                  Create a project first to use AI matching.
                  <button onClick={() => navigate('/dashboard/project/create')} className="ml-2 text-[#e87315]/60 hover:text-[#e87315] transition-colors underline underline-offset-2">Create one</button>
                </p>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#e87315]/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10" />
        </div>
      )}

      {/* Filters (Hidden in AI Mode) */}
      {!aiMode && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-6 sm:py-8 border-y border-white/10 bg-white/[0.02] px-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide flex-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`relative px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex-shrink-0 group ${activeCategory===cat?'text-black':'text-white/50 hover:text-white/90 bg-transparent'}`}>
                {activeCategory===cat&&<div className="absolute inset-0 bg-white animate-in fade-in zoom-in duration-300"/>}
                <div className={`absolute bottom-0 left-0 h-[2px] bg-[#e87315] transition-all duration-500 ${activeCategory===cat?'w-full':'w-0 group-hover:w-full'}`}/>
                <span className="relative z-10 italic">{cat}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <button 
              onClick={() => {
                if (!user?.college) {
                  alert("Please update your profile with your College name to find Alumni mentors!");
                  return navigate('/dashboard/profile'); // Or wherever your profile edit page is
                }
                setAlumniOnly(!alumniOnly);
              }} 
              className={`group relative flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-500 border ${alumniOnly ? 'bg-[#e87315] border-[#e87315] text-black' : 'bg-transparent border-white/20 text-white/50 hover:border-white/40'}`}
            >
              <GraduationCap size={16} strokeWidth={2.5} className={alumniOnly ? 'text-black' : 'text-[#e87315]'}/>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] italic">Alumni Filter</span>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${alumniOnly ? 'bg-black' : 'bg-[#e87315]'}`}/>
            </button>
            {hasActiveFilters && (
              <button onClick={clearAll} className="relative group p-3.5 sm:p-4 bg-white/10 border border-white/20 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300" title="Clear Filters">
                <X size={18} strokeWidth={3} className="text-white/40 group-hover:text-red-500 transition-colors"/>
                <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t border-r border-white/30 group-hover:border-red-500/60"/>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[2px] h-4 bg-[#e87315]" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
            {aiMode 
              ? `AI Ranked Matches · Top ${aiSuggestions.length} Found` 
              : `All Mentors · ${filteredMentors.length} Found`}
          </p>
        </div>
        {aiMode && (
          <button 
            onClick={cancelAIMode}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/30 hover:bg-red-500/[0.08] text-white/40 hover:text-red-400 transition-all text-[11px] font-black uppercase tracking-widest"
          >
            <X size={14} /> Clear AI Match
          </button>
        )}
      </div>

      {/* Main Grid Content */}
      {aiMode ? (
        // AI MODE VIEW
        isAILoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 border border-white/5 bg-white/[0.01]">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border border-[#e87315]/15 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 border-2 border-t-[#e87315] border-r-[#e87315]/20 border-b-[#e87315]/10 border-l-[#e87315]/30 rounded-full animate-spin" />
              <div className="absolute inset-[5px] border border-[#e87315]/20 rotate-45 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={16} className="text-[#e87315]/60" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[12px] font-black text-[#e87315] uppercase tracking-[0.5em] italic animate-pulse">Running AI Vectors...</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Scanning mentor expertise & computing project alignment</p>
            </div>
          </div>
        ) : aiError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 border border-dashed border-red-500/20">
            <X size={32} className="text-red-500/50" />
            <p className="text-[11px] font-black text-red-400/70 uppercase tracking-widest italic">{aiError}</p>
          </div>
        ) : aiSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
            {aiSuggestions.map((suggestion, index) => (
              <MentorCard 
                key={suggestion.userId || index} 
                mentor={suggestion.user} 
                isAccepted={acceptedMentors.has(suggestion.user?._id?.toString())} 
                isPending={connectedMentors.has(suggestion.user?._id?.toString())} 
                matchScore={suggestion.matchScore}
                aiReason={suggestion.reason}
                rank={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-[12px] font-black text-white/50 uppercase tracking-[0.5em] italic">No Strong AI Matches</p>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-3">Try editing your project to include more specific tags or description</p>
          </div>
        )
      ) : (
        // STANDARD VIEW
        visibleMentors?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
              {visibleMentors.map(mentor => (
                <MentorCard key={mentor._id} mentor={mentor} isAccepted={acceptedMentors.has(mentor._id?.toString())} isPending={connectedMentors.has(mentor._id?.toString())} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-16 pb-24">
                <button onClick={handleLoadMore} disabled={loadingMore} className={`group relative flex items-center justify-center gap-6 px-10 sm:px-12 py-5 sm:py-6 border transition-all duration-500 overflow-hidden ${loadingMore?'bg-white/10 border-white/20 cursor-wait':'bg-[#0c0c0c] border-white/20 hover:border-[#e87315] cursor-pointer'}`}>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10"/>
                  {loadingMore ? (
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-1.5 h-3.5 bg-[#e87315] animate-pulse" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
                      <span className="text-[11px] sm:text-[12px] font-black text-[#e87315] uppercase tracking-[0.5em]">Synchronizing...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10 text-[11px] sm:text-[12px] font-black text-white/60 group-hover:text-white uppercase tracking-[0.5em] transition-colors bg-[#0c0c0c] px-4 group-hover:bg-transparent">Fetch Next Data Batch</span>
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 bg-[#080808] group-hover:bg-[#e87315] flex items-center justify-center transition-all duration-500 border border-white/20 group-hover:border-[#e87315]">
                        <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-white/60 group-hover:border-black rotate-45 mb-1"/>
                      </div>
                      <div className="absolute inset-0 bg-[#e87315]/[0.04] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"/>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="relative border border-dashed border-white/20 bg-[#0c0c0c] py-32 px-10 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e87315_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none"/>
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-[#080808] border border-white/20 flex items-center justify-center shadow-2xl">
                <Search size={32} className="text-[#e87315] opacity-60" strokeWidth={2}/>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#e87315]"/>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#e87315]"/>
              </div>
            </div>
            <div className="text-center space-y-3 mb-10 relative z-10">
              <h3 className="text-3xl sm:text-4xl font-black text-white/90 uppercase italic tracking-tighter">Zero Results Found</h3>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-12 bg-[#e87315]/50"/>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">Database Query Returned Null</p>
                <div className="h-[1px] w-12 bg-[#e87315]/50"/>
              </div>
            </div>
            <button onClick={clearAll} className="group relative px-10 py-4 bg-[#0c0c0c] border border-[#e87315] overflow-hidden transition-all">
              <span className="relative z-10 text-[11px] font-black text-[#e87315] uppercase tracking-[0.3em] group-hover:text-black transition-colors">Clear All Filters</span>
              <div className="absolute inset-0 bg-[#e87315] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"/>
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default FindMentors;