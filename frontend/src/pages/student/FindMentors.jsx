import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, GraduationCap, MessageSquare, MapPin,
  ChevronRight, X, CheckCircle2, Sparkles, Zap, Star, Cat
} from 'lucide-react';
import { userAPI, connectionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['All Mentors', 'Engineering', 'Product & Design', 'Business & Growth'];

// ─── AI MENTOR CARD (matches architect theme) ─────────────────────────────────
const AIMentorCard = ({ suggestion }) => {
  const navigate = useNavigate();
  const { user, matchScore, reason } = suggestion;
  if (!user) return null;

  const scoreColor =
    matchScore >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
    matchScore >= 60 ? 'text-[#e87315] border-[#e87315]/40 bg-[#e87315]/10' :
    'text-white/50 border-white/20 bg-white/5';

  return (
    <div
      onClick={() => navigate(`/dashboard/mentor/${user._id}`)}
      className="group relative bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 transition-all duration-500 overflow-hidden cursor-pointer"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315]/60 via-[#e87315]/20 to-transparent" />
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${user.name}&bold=true`;
                }}
                alt={user.name}
                className="w-12 h-12 object-cover border border-white/20 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-black text-white/90 uppercase tracking-tight group-hover:text-[#e87315] transition-colors truncate">
                {user.name}
              </p>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest truncate mt-0.5">
                {user.company || 'Freelancer'}
              </p>
            </div>
          </div>

          {/* Match Score */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-black uppercase tracking-wider flex-shrink-0 ${scoreColor}`}>
            <Zap size={11} />
            {matchScore}%
          </div>
        </div>

        {/* AI Reason */}
        <div className="relative bg-[#080808] border border-[#e87315]/20 p-3.5">
          <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]/60" />
          <p className="text-[10px] font-black text-[#e87315] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Sparkles size={10} /> AI Match Reason
          </p>
          <p className="text-[11px] text-white/70 font-medium leading-relaxed italic">
            "{reason}"
          </p>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5">
          {user.expertise?.slice(0, 3).map(s => (
            <span key={s} className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-[9px] font-black text-white/50 uppercase tracking-tighter">
              {s}
            </span>
          ))}
        </div>

        {/* Mentor Stats */}
        <div className="grid grid-cols-3 border border-white/10 bg-white/[0.02]">
          <div className="p-2.5 border-r border-white/10 text-center">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Rating</p>
            <span className="text-[12px] font-black text-white/90 italic flex items-center justify-center gap-0.5">
              <Star size={9} className="text-[#e87315]" fill="currentColor" />
              {user.rating || 'N/A'}
            </span>
          </div>
          <div className="p-2.5 border-r border-white/10 text-center">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Sessions</p>
            <span className="text-[12px] font-black text-white/90 italic">{user.sessionsHeld || 0}</span>
          </div>
          <div className="p-2.5 text-center">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Reply</p>
            <span className="text-[10px] font-black text-[#e87315] italic">{user.responseTime?.replace('< ', '') || '48h'}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest border-t border-white/10 pt-3">
          {user.location && (
            <span className="flex items-center gap-1"><MapPin size={10} /> {user.location.split(',')[0]}</span>
          )}
          <span className={`flex items-center gap-1 ${user.mentorStatus === 'Accepting Mentees' ? 'text-emerald-400' : 'text-[#e87315]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user.mentorStatus === 'Accepting Mentees' ? 'bg-emerald-400 animate-pulse' : 'bg-[#e87315]'}`} />
            {user.mentorStatus === 'Accepting Mentees' ? 'Available' : 'Limited'}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
    </div>
  );
};

// ─── AI MENTOR PANEL ──────────────────────────────────────────────────────────
const AIMentorPanel = ({ projectId, onClose }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ai/suggest-mentors/${projectId}`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('AI mentor suggestion failed:', err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [projectId]);

  return (
    <div className="relative bg-[#080808] border border-[#e87315]/30 overflow-hidden mt-8">
      {/* Header accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#e87315]/40 bg-[#e87315]/10 flex items-center justify-center">
            <Sparkles size={18} className="text-[#e87315]" />
          </div>
          <div>
            <h4 className="text-[12px] font-black text-white/90 uppercase tracking-[0.4em] italic">
              AI Mentor Matches
            </h4>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-0.5">
              Ranked by expertise + project alignment
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-[#e87315]/20 animate-ping" />
              <div className="absolute inset-0 border-2 border-t-[#e87315] border-[#e87315]/10 rounded-full animate-spin" />
              <div className="absolute inset-3 border border-[#e87315]/30 rotate-45 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-black text-[#e87315] uppercase tracking-[0.4em] italic animate-pulse">Matching Mentors...</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5">AI scanning expertise & category fit</p>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[2px] h-4 bg-[#e87315]" />
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">
                {suggestions.length} Best Mentors Found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {suggestions.map((s, i) => <AIMentorCard key={i} suggestion={s} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-16 border border-dashed border-white/10">
            <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em] italic">No Mentor Matches</p>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2">Try a project with more category/tag detail</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20" />
    </div>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isAvailable = status === 'Accepting Mentees';
  return (
    <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-l-2 transition-all duration-500 ${isAvailable ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-[#e87315]/10 border-[#e87315] text-[#e87315]'}`}>
      <div className="relative flex h-2 w-2">
        {isAvailable && <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-30"></span>}
        <span className={`relative inline-flex h-2 w-2 ${isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#e87315]'}`}></span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] italic">{status}</span>
      <div className={`ml-1 w-1.5 h-1.5 opacity-40 ${isAvailable ? 'bg-emerald-500' : 'bg-[#e87315]'}`} />
    </div>
  );
};

// ─── MENTOR CARD ──────────────────────────────────────────────────────────────
const MentorCard = ({ mentor, isAccepted, isPending }) => {
  const [connecting, setConnecting] = useState(false);
  const [localPending, setLocalPending] = useState(isPending);
  const [localAccepted] = useState(isAccepted);
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (isAccepted || localPending || connecting) return;
    setConnecting(true);
    try {
      await connectionAPI.send({
        to: mentor._id,
        type: 'mentor-request',
        message: `Hi ${mentor.name}, I'd love to connect and learn from your expertise!`
      });
      setLocalPending(true);
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/dashboard/mentor/${mentor._id}`)}
      className="group relative flex flex-col bg-[#0c0c0c] border border-white/20 hover:border-[#e87315]/50 transition-all duration-500 cursor-pointer animate-evolve-in shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#e87315]/5 clip-path-poly opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative h-48 sm:h-56 overflow-hidden border-b border-white/10">
        <img
          src={mentor.profileImage}
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${mentor.name || 'U'}&bold=true`; }}
          alt={mentor.name}
          className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
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
            <h3 className="text-2xl sm:text-3xl font-black text-white/90 group-hover:text-[#e87315] transition-colors leading-none uppercase italic tracking-tighter truncate">{mentor.name}</h3>
            {mentor.rating >= 4.9 && <Sparkles size={18} className="text-[#e87315]" />}
          </div>
          <p className="text-[11px] sm:text-[12px] font-bold text-white/60 uppercase tracking-[0.4em] italic truncate">{mentor.role}</p>
        </div>

        <div className="grid grid-cols-3 border border-white/10 bg-white/[0.02]">
          <div className="p-3 sm:p-4 border-r border-white/10 text-center">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Score</p>
            <span className="text-[13px] sm:text-[14px] font-black text-white/90 italic">{mentor.rating}</span>
          </div>
          <div className="p-3 sm:p-4 border-r border-white/10 text-center">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Units</p>
            <span className="text-[13px] sm:text-[14px] font-black text-white/90 italic">{mentor.sessionsHeld}</span>
          </div>
          <div className="p-3 sm:p-4 text-center">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Reply</p>
            <span className="text-[13px] sm:text-[14px] font-black text-[#e87315] italic">{mentor.responseTime?.replace('< ', '') || '48 hrs'}</span>
          </div>
        </div>

        <p className="text-[11px] sm:text-[12px] font-medium text-white/50 leading-relaxed italic line-clamp-2 uppercase tracking-tight">"{mentor.bio}"</p>

        <div className="flex flex-wrap gap-2.5">
          {mentor.expertise?.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-3 sm:px-4 py-1.5 bg-white/[0.05] border border-white/10 text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-tighter italic group-hover:border-white/30 group-hover:text-white/80 transition-colors">{skill}</span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isAccepted) { navigate('/dashboard/messages'); } else { handleConnect(); }
          }}
          disabled={localPending || connecting}
          className={`w-full group/btn relative flex items-center justify-center gap-3 py-5 sm:py-5.5 text-[11px] sm:text-[12px] font-black tracking-[0.4em] transition-all duration-500 overflow-hidden uppercase italic border-l-4 mt-auto ${isAccepted ? 'bg-[#e87315] text-black border-black/20' : localPending ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 cursor-default' : connecting ? 'bg-[#0c0c0c] text-white/50 border-white/20 cursor-wait' : 'bg-white/10 text-white/90 border-transparent hover:bg-[#e87315] hover:text-black'}`}
        >
          {!localPending && !connecting && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none" />
          )}
          {isAccepted ? (
            <><MessageSquare size={18} strokeWidth={2.5} className="relative z-10 sm:w-5 sm:h-5" /><span className="relative z-10">INITIATE CONTACT</span></>
          ) : localPending ? (
            <div className="flex items-center gap-2"><CheckCircle2 size={18} strokeWidth={2.5} className="animate-pulse sm:w-5 sm:h-5" /><span>REQUEST Sent</span></div>
          ) : connecting ? (
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">{[0, 1, 2].map((i) => (<div key={i} className="w-1.5 h-3.5 bg-[#e87315] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />))}</div>
              <span className="text-white/60 tracking-widest">SYNCING DATA...</span>
            </div>
          ) : (
            <><MessageSquare size={18} strokeWidth={2.5} className="relative z-10 transition-transform group-hover/btn:scale-110 sm:w-5 sm:h-5" /><span className="relative z-10">SEND REQUEST</span><div className="absolute right-6 flex items-center"><ChevronRight size={18} className="opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500 text-black" strokeWidth={3} /></div></>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
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

  // ── AI State ──────────────────────────────────────────────
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiKey, setAiKey] = useState(0); // remount panel on new project selection

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mentorsRes, sentRes, networkRes] = await Promise.all([
          userAPI.getMentors(),
          connectionAPI.getSent(),
          connectionAPI.getNetwork()
        ]);

        setMentors(Array.isArray(mentorsRes.data) ? mentorsRes.data : []);

        const alreadySent = new Set(
          (sentRes.data || []).filter(c => c.type === 'mentor-request' && c.status === 'pending').map(c => c.to?._id)
        );
        const alreadyAccepted = new Set(
          (networkRes.data || []).filter(u => u.role === 'mentor').map(u => u._id?.toString())
        );

        setAcceptedMentors(alreadyAccepted);
        setConnectedMentors(alreadySent);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load mentors.');
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch user's own projects for the AI dropdown
  useEffect(() => {
    if (!user?._id) return;
    fetch(`/api/projects?creator=${user._id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUserProjects(Array.isArray(data) ? data : data.projects || []))
      .catch(() => setUserProjects([]));
  }, [user?._id]);

  const filteredMentors = useMemo(() => {
    if (!Array.isArray(mentors)) return [];
    return mentors.filter(mentor => {
      const matchesSearch = searchTerm === '' ||
        mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.expertise || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mentor.role?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All Mentors' || mentor.category === activeCategory;
      const matchesAlumni = !alumniOnly || mentor.isAlumni;
      return matchesSearch && matchesCategory && matchesAlumni;
    });
  }, [searchTerm, activeCategory, alumniOnly, mentors]);

  const hasActiveFilters = searchTerm !== '' || activeCategory !== 'All Mentors' || alumniOnly;

  const clearAll = () => {
    setSearchTerm('');
    setActiveCategory('All Mentors');
    setAlumniOnly(false);
  };

  const handleFindMentors = () => {
    if (!selectedProjectId) return;
    setAiKey(prev => prev + 1); // remount to re-fetch
    setShowAIPanel(true);
  };

  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <p className="text-red-400 font-semibold">{error}</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-16 bg-[#050505] min-h-screen text-white">

      {/* ── Header Architecture ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10 pb-16 border-b border-white/10">
        <div className="relative">
          <div className="absolute -left-6 top-0 w-[2px] h-full bg-[#e87315] hidden md:block" />
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white/90 mb-4 tracking-tighter italic uppercase leading-[0.8]">
            Find Mentors<span className="text-[#e87315]">.</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-[2px] bg-[#e87315]/60" />
            <p className="text-white/60 font-bold tracking-[0.2em] uppercase text-[11px] sm:text-[12px] italic">Access the Evolve Expert Network.</p>
          </div>
          <p className="mt-6 text-white/50 font-medium tracking-wide uppercase text-[14px] sm:text-[15px] max-w-xl leading-relaxed">
            Accelerate your startup journey with personalized guidance from Evolve's experts and alumni.
          </p>
        </div>

        {/* Search Module */}
        <div className="relative w-full md:w-[450px] flex-shrink-0 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-[#e87315] transition-colors z-10" size={20} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Skill / Name / Company"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c0c0c] border border-white/20 group-hover:border-white/40 focus:border-[#e87315]/50 rounded-none pl-16 pr-8 py-5 sm:py-6 text-[12px] sm:text-[13px] font-black text-white/90 placeholder-white/30 focus:outline-none transition-all uppercase tracking-widest italic"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/30" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/30" />
        </div>
      </header>

      {/* ── AI MENTOR FINDER MODULE ── */}
      {user?.role === 'student' && (
        <div className="relative border border-[#e87315]/20 bg-[#080808] overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/30 to-transparent" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#e87315]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#e87315]" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 border border-[#e87315]/40 bg-[#e87315]/10 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-[#e87315]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-[13px] font-black text-white/90 uppercase tracking-[0.4em] italic">
                    AI Mentor Finder
                  </h2>
                  {/* Live badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-[#e87315]/30 bg-[#e87315]/10">
                    <span className="w-1.5 h-1.5 bg-[#e87315] rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-[#e87315] uppercase tracking-widest">Powered by Gemini</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mt-1">
                  Select a project → AI scans all mentors and ranks by expertise match
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 my-5" />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              {/* Project selector */}
              <div className="flex-1 relative group/select">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 block">
                  Select Your Project
                </label>
                <div className="relative">
                  <select
                    value={selectedProjectId}
                    onChange={e => {
                      setSelectedProjectId(e.target.value);
                      setShowAIPanel(false); // hide old results on change
                    }}
                    className="w-full bg-[#0c0c0c] border border-white/20 hover:border-white/40 focus:border-[#e87315]/50 text-[11px] font-black text-white/80 uppercase tracking-wider px-4 py-4 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0c0c0c]">Choose a project...</option>
                    {userProjects.length > 0 ? (
                      userProjects.map(p => (
                        <option key={p._id} value={p._id} className="bg-[#0c0c0c]">
                          {p.title} — {p.category} [{p.stage}]
                        </option>
                      ))
                    ) : (
                      <option disabled className="bg-[#0c0c0c] text-white/40">No projects found — create one first</option>
                    )}
                  </select>
                  {/* Custom arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r border-b border-white/40 rotate-45 -translate-y-0.5" />
                  </div>
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30 group-focus-within/select:border-[#e87315]" />
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30 group-focus-within/select:border-[#e87315]" />
                </div>
              </div>

              {/* Find button */}
              <button
                onClick={handleFindMentors}
                disabled={!selectedProjectId}
                className={`group relative flex items-center gap-3 px-8 py-4 border overflow-hidden transition-all duration-500 flex-shrink-0 ${selectedProjectId
                  ? 'border-[#e87315] bg-[#e87315]/10 text-[#e87315] hover:bg-[#e87315] hover:text-black'
                  : 'border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed'
                }`}
              >
                {/* Hover fill */}
                {selectedProjectId && (
                  <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                )}
                <Sparkles size={16} className="relative z-10 flex-shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] italic relative z-10">
                  Find AI Mentors
                </span>
              </button>

              {/* Close AI panel button */}
              {showAIPanel && (
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="flex items-center gap-2 px-5 py-4 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all flex-shrink-0"
                >
                  <X size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Close</span>
                </button>
              )}
            </div>

            {userProjects.length === 0 && (
              <div className="mt-4 flex items-center gap-3 px-4 py-3 border border-white/10 bg-white/[0.02]">
                <div className="w-1 h-4 bg-[#e87315]/60" />
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  You need at least one project to use AI Mentor Finder.
                  <button onClick={() => navigate('/dashboard/project/create')} className="ml-2 text-[#e87315] hover:underline">Create one →</button>
                </p>
              </div>
            )}
          </div>

          {/* AI Results Panel */}
          {showAIPanel && selectedProjectId && (
            <div className="border-t border-white/10">
              <AIMentorPanel
                key={aiKey}
                projectId={selectedProjectId}
                onClose={() => setShowAIPanel(false)}
              />
            </div>
          )}

          {/* Bottom corner */}
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#e87315]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#e87315]" />
        </div>
      )}

      {/* ── Filters Row ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-6 sm:py-8 border-y border-white/10 bg-white/[0.02] px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex-shrink-0 group ${activeCategory === cat ? 'text-black' : 'text-white/50 hover:text-white/90 bg-transparent'}`}
            >
              {activeCategory === cat && <div className="absolute inset-0 bg-white animate-in fade-in zoom-in duration-300" />}
              <div className={`absolute bottom-0 left-0 h-[2px] bg-[#e87315] transition-all duration-500 ${activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              <span className="relative z-10 italic">{cat}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <button
            onClick={() => setAlumniOnly(!alumniOnly)}
            className={`group relative flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-500 border ${alumniOnly ? 'bg-[#e87315] border-[#e87315] text-black' : 'bg-transparent border-white/20 text-white/50 hover:border-white/40'}`}
          >
            <GraduationCap size={16} strokeWidth={2.5} className={alumniOnly ? 'text-black' : 'text-[#e87315]'} />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] italic">Alumni Filter</span>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${alumniOnly ? 'bg-black' : 'bg-[#e87315]'}`} />
          </button>

          {hasActiveFilters && (
            <button onClick={clearAll} className="relative group p-3.5 sm:p-4 bg-white/10 border border-white/20 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300" title="Clear Filters">
              <X size={18} strokeWidth={3} className="text-white/40 group-hover:text-red-500 transition-colors sm:w-5 sm:h-5" />
              <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t border-r border-white/30 group-hover:border-red-500/60" />
            </button>
          )}
        </div>
      </div>

      {/* ── Mentor Grid header ── */}
      <div className="flex items-center gap-4">
        <div className="w-[2px] h-4 bg-[#e87315]" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
          All Mentors — {filteredMentors.length} Found
        </p>
      </div>

      {/* ── Mentor Grid ── */}
      {filteredMentors?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor._id}
              mentor={mentor}
              isAccepted={acceptedMentors.has(mentor._id?.toString())}
              isPending={connectedMentors.has(mentor._id?.toString())}
            />
          ))}
        </div>
      ) : (
        <div className="relative border border-dashed border-white/20 bg-[#0c0c0c] py-32 px-10 animate-evolve-in flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e87315_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />
          <div className="relative mb-8 sm:mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#080808] border border-white/20 flex items-center justify-center shadow-2xl">
              <Search size={32} className="text-[#e87315] opacity-60 sm:w-10 sm:h-10" strokeWidth={2} />
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#e87315]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#e87315]" />
            </div>
          </div>
          <div className="text-center space-y-3 mb-10 sm:mb-12 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black text-white/90 uppercase italic tracking-tighter">Zero Results Found</h3>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 sm:w-12 bg-[#e87315]/50" />
              <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-[0.4em]">Database Query Returned Null</p>
              <div className="h-[1px] w-8 sm:w-12 bg-[#e87315]/50" />
            </div>
          </div>
          <button onClick={clearAll} className="group relative px-10 sm:px-12 py-4 sm:py-5 bg-[#0c0c0c] border border-[#e87315] overflow-hidden transition-all">
            <span className="relative z-10 text-[11px] sm:text-[12px] font-black text-[#e87315] uppercase tracking-[0.3em] group-hover:text-black transition-colors">Clear All Filters</span>
            <div className="absolute inset-0 bg-[#e87315] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FindMentors;