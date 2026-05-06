import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, GraduationCap, MessageSquare, Briefcase,
  MapPin, Clock, Users, ChevronRight, Star, X,
  CheckCircle2, Sparkles
} from 'lucide-react';
import { userAPI, connectionAPI } from '../../services/api';

const CATEGORIES = ['All Mentors', 'Engineering', 'Product & Design', 'Business & Growth'];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const isAvailable = status === 'Accepting Mentees';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 border-l-2 transition-all duration-500 ${isAvailable
        ? 'bg-emerald-500/5 border-emerald-500 text-emerald-400'
        : 'bg-[#e87315]/5 border-[#e87315] text-[#e87315]'
      }`}>
      {/* State Signal */}
      <div className="relative flex h-2 w-2">
        {isAvailable && (
          <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-20"></span>
        )}
        <span className={`relative inline-flex h-2 w-2 ${isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#e87315]'
          }`}></span>
      </div>

      {/* Logic Label */}
      <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">
        {status}
      </span>

      {/* Technical Decal */}
      <div className={`ml-1 w-1 h-1 opacity-30 ${isAvailable ? 'bg-emerald-500' : 'bg-[#e87315]'}`} />
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
      className="group relative flex flex-col bg-[#080808] border border-white/10 hover:border-[#e87315] transition-all duration-500 cursor-pointer animate-evolve-in shadow-2xl"
    >
      {/* ── Background Geometric Accent ── */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#e87315]/5 clip-path-poly opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* ── Profile Module ── */}
      <div className="relative h-48 overflow-hidden border-b border-white/5">
        <img
          src={mentor.profileImage}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${mentor.name || 'U'}&bold=true`;
          }}
          alt={mentor.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

        {/* Status Overlay */}
        <div className="absolute top-0 left-0">
          <StatusBadge status={mentor.mentorStatus} />
        </div>

        {/* Alumni Indicator */}
        {mentor.isAlumni && (
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#e87315] rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] italic bg-black/80 px-2 py-1 border border-white/10">
              ALUMNI // CLASS {mentor.gradYear}
            </span>
          </div>
        )}
      </div>

      {/* ── Content Architecture ── */}
      <div className="flex flex-col flex-1 p-8 gap-6">

        {/* Identity Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-white group-hover:text-[#e87315] transition-colors leading-none uppercase italic tracking-tighter">
              {mentor.name}
            </h3>
            {mentor.rating >= 4.9 && <Sparkles size={16} className="text-[#e87315]" />}
          </div>
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.4em] italic">
            {mentor.role}
          </p>
        </div>

        {/* Stats Grid - Sharp Borders */}
        <div className="grid grid-cols-3 border border-white/5 bg-white/[0.01]">
          <div className="p-4 border-r border-white/5 text-center">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Score</p>
            <span className="text-sm font-black text-white italic">{mentor.rating}</span>
          </div>
          <div className="p-4 border-r border-white/5 text-center">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Units</p>
            <span className="text-sm font-black text-white italic">{mentor.sessionsHeld}</span>
          </div>
          <div className="p-4 text-center">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Reply</p>
            <span className="text-sm font-black text-[#e87315] italic">{mentor.responseTime?.replace('< ', '') || '48 hrs'}</span>
          </div>
        </div>

        {/* Dossier Bio */}
        <p className="text-[11px] font-medium text-white/40 leading-relaxed italic line-clamp-2 uppercase tracking-tight">
          "{mentor.bio}"
        </p>

        {/* Expertise Specs */}
        <div className="flex flex-wrap gap-2">
          {mentor.expertise?.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-tighter italic group-hover:border-white/30 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* ── Action Trigger ── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isAccepted) { navigate('/dashboard/messages'); } else { handleConnect(); }
          }}
          disabled={localPending || connecting}
          className={`w-full group/btn relative flex items-center justify-center gap-3 py-5 text-[11px] font-black tracking-[0.4em] transition-all duration-500 overflow-hidden uppercase italic border-l-4 ${isAccepted
            ? 'bg-[#e87315] text-black border-black/20'
            : localPending
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 cursor-default'
              : connecting
                ? 'bg-white/5 text-white/10 border-white/5 cursor-wait'
                : 'bg-white text-black border-transparent hover:bg-[#e87315] hover:text-white'
            }`}
        >
          {/* ── Scanning Light Leak Effect (Only on Hover) ── */}
          {!localPending && !connecting && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none" />
          )}

          {/* ── Content Logic ── */}
          {isAccepted ? (
            <>
              <MessageSquare size={16} strokeWidth={3} className="relative z-10" />
              <span className="relative z-10">INITIATE CONTACT</span>
            </>
          ) : localPending ? (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} strokeWidth={3} className="animate-pulse" />
                <span>REQUEST Sent</span>
              </div>
            </>
          ) : connecting ? (
            <div className="flex items-center gap-4">
              {/* Structural Loader */}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-3 bg-[#e87315] animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-white/40">SYNCING DATA...</span>
            </div>
          ) : (
            <>
              <MessageSquare size={16} strokeWidth={3} className="relative z-10 transition-transform group-hover/btn:scale-110" />
              <span className="relative z-10">SECURE SESSION</span>

              {/* Architectural Chevron */}
              <div className="absolute right-6 flex items-center">
                <ChevronRight
                  size={16}
                  className="opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500 text-black group-hover/btn:text-white"
                  strokeWidth={4}
                />
              </div>
            </>
          )}

        </button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const FindMentors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Mentors');
  const [alumniOnly, setAlumniOnly] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectedMentors, setConnectedMentors] = useState(new Set());
  const [acceptedMentors, setAcceptedMentors] = useState(new Set());
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mentorsRes, sentRes, networkRes] = await Promise.all([
          userAPI.getMentors(),
          connectionAPI.getSent(),
          connectionAPI.getNetwork()
        ]);
        
        // Safety check to ensure mentorsRes.data is always an array
        setMentors(Array.isArray(mentorsRes.data) ? mentorsRes.data : []);

        // Build a set of already-connected mentor IDs with empty array fallbacks
        const alreadySent = new Set(
          (sentRes.data || [])
            .filter(c => c.type === 'mentor-request' && c.status === 'pending')
            .map(c => c.to?._id)
        );
        const alreadyAccepted = new Set(
          (networkRes.data || [])
            .filter(u => u.role === 'mentor')
            .map(u => u._id?.toString())
        );

        setAcceptedMentors(alreadyAccepted);
        setConnectedMentors(alreadySent);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load mentors.');
        // Ensure state remains an array even on API error
        setMentors([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMentors = useMemo(() => {
    if (!Array.isArray(mentors)) return [];
    
    return mentors.filter(mentor => {
      const matchesSearch =
        searchTerm === '' ||
        mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.expertise || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mentor.role?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategory === 'All Mentors' || mentor.category === activeCategory;

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
    <div className="w-full space-y-8 px-4 md:px-8 pb-16 bg-black min-h-screen text-white">

      {/* ── Header Architecture ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10 pb-16 border-b border-white/5">
        <div className="relative">
          {/* Vertical Technical Accent */}
          <div className="absolute -left-6 top-0 w-[2px] h-full bg-[#e87315] hidden md:block" />

          <h1 className="text-7xl md:text-8xl font-black text-white mb-4 tracking-tighter italic uppercase leading-[0.8]">
            Find Mentors<span className="text-[#e87315]">.</span>
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[#e87315]/30" />
            <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-[12px] italic">
              Access the Evolve Expert Network.
            </p>
          </div>

          <p className="mt-6 text-white/20 font-medium tracking-wide uppercase text-[15px] max-w-xl leading-relaxed">
            Accelerate your startup journey with personalized guidance
            from Evolve's experts and alumni.
          </p>
        </div>

        {/* Search Module */}
        <div className="relative w-full md:w-[450px] flex-shrink-0 group">
          {/* Top Label */}

          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#e87315] transition-colors z-10"
            size={18}
            strokeWidth={3}
          />

          <input
            type="text"
            placeholder="Skill / Name / Company"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 group-hover:border-white/20 focus:border-[#e87315] rounded-none pl-16 pr-8 py-6 text-[13px] font-black text-white placeholder-white/10 focus:outline-none transition-all uppercase tracking-widest italic"
          />

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700" />

          {/* Corner Decals */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
        </div>
      </header>

      {/* ── Filters Row ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-8 border-y border-white/5 bg-white/[0.01] px-4">
        {/* ── Category Selection Engine ── */}
        <div className="flex items-center gap-1 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex-shrink-0 group ${activeCategory === cat
                ? 'text-black'
                : 'text-white/30 hover:text-white bg-transparent'
                }`}
            >
              {/* Active Background Slide */}
              {activeCategory === cat && (
                <div className="absolute inset-0 bg-white animate-in fade-in zoom-in duration-300" />
              )}

              {/* Hover Border Accent */}
              <div className={`absolute bottom-0 left-0 h-[2px] bg-[#e87315] transition-all duration-500 ${activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />

              <span className="relative z-10 italic">{cat}</span>
            </button>
          ))}
        </div>

        {/* ── Technical Toggle Modules ── */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Alumni Toggle */}
          <button
            onClick={() => setAlumniOnly(!alumniOnly)}
            className={`group relative flex items-center gap-3 px-8 py-4 transition-all duration-500 border ${alumniOnly
              ? 'bg-[#e87315] border-[#e87315] text-black'
              : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
              }`}
          >
            <GraduationCap
              size={14}
              strokeWidth={3}
              className={alumniOnly ? 'text-black' : 'text-[#e87315]'}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
              Alumni Filter
            </span>

            {/* Visual Status Indicator */}
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${alumniOnly ? 'bg-black' : 'bg-[#e87315]'
              }`} />
          </button>

          {/* System Reset */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="relative group p-4 bg-white/5 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300"
              title="Clear Filters"
            >
              <X
                size={18}
                strokeWidth={3}
                className="text-white/20 group-hover:text-red-500 transition-colors"
              />

              {/* Decorative Corner */}
              <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-white/20 group-hover:border-red-500/50" />
            </button>
          )}
        </div>
      </div>

      {/* ── Mentor Grid ── */}
      {filteredMentors?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        /* ── Empty State ── */
        <div className="relative border border-white/5 bg-white/[0.01] py-32 px-10 animate-evolve-in flex flex-col items-center justify-center overflow-hidden" style={{ animationDelay: '0.2s' }}>
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#e87315_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

          {/* Technical Icon Module */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-black border border-white/10 flex items-center justify-center">
              <Search size={32} className="text-[#e87315] opacity-50" strokeWidth={1.5} />
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#e87315]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#e87315]" />
            </div>
          </div>

          {/* Text Architecture */}
          <div className="text-center space-y-2 mb-10 relative z-10">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Zero Results Found
            </h3>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-[#e87315]/30" />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">
                Database Query Returned Null
              </p>
              <div className="h-[1px] w-8 bg-[#e87315]/30" />
            </div>
          </div>

          {/* Reset Command */}
          <button
            onClick={clearAll}
            className="group relative px-10 py-4 bg-transparent border border-[#e87315] overflow-hidden transition-all"
          >
            <span className="relative z-10 text-[11px] font-black text-[#e87315] uppercase tracking-[0.3em] group-hover:text-black transition-colors">
              Clear All Filters
            </span>
            <div className="absolute inset-0 bg-[#e87315] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FindMentors;