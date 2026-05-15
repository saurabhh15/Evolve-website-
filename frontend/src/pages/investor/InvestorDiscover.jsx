import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Bookmark, BookmarkCheck, Zap,
  ShieldCheck, AlertCircle, Users, TrendingUp, Eye, Heart,
  ArrowUpRight, X, ChevronDown, Star, Sparkles, LayoutGrid,
  List, Filter, CheckCheck, Clock, Flame
} from 'lucide-react';
import { connectionAPI } from '../../services/api';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const SECTORS = [
  'All', 'AI / ML', 'FinTech', 'EdTech', 'HealthTech',
  'Cleantech', 'SaaS', 'DeepTech', 'Blockchain', 'E-Commerce',
];

const STAGES = ['All', 'Idea', 'Prototype', 'MVP', 'Revenue', 'Launched'];

const TEAM_SIZES = ['All', '1–2', '3–5', '6–10', '10+'];

const SORT_OPTIONS = [
  { id: 'newest',      label: 'Newest First',    icon: Clock    },
  { id: 'trending',    label: 'Most Viewed',     icon: Flame    },
  { id: 'liked',       label: 'Most Liked',      icon: Heart    },
  { id: 'readiness',   label: 'Readiness Score', icon: TrendingUp },
];

// ─────────────────────────────────────────────
// MOCK DATA
// Added `creatorId` so Express Interest routes correctly
// ─────────────────────────────────────────────

const MOCK_PROJECTS = [
  {
    id: 'pr1', creatorId: 'mock_u1', title: 'NeuroSync', tagline: 'AI-powered emotional intelligence for enterprise teams',
    category: 'AI / ML', stage: 'MVP', teamSize: 4, lookingFor: ['investor', 'mentor'],
    ask: '$250k', equity: '7%', readiness: 88, mentorVerified: true,
    views: 3400, likes: 128, createdAt: '2025-04-10',
    founder: 'Alex Chen', founderCollege: 'IIT Delhi',
    tags: ['NLP', 'B2B', 'SaaS'], description: 'NeuroSync uses transformer-based models to detect team stress patterns and surface actionable insights for managers — before burnout happens.',
    mentorSessions: 12, isSuggested: true,
  },
  {
    id: 'pr2', creatorId: 'mock_u2', title: 'EcoGrid', tagline: 'Distributed clean energy management for smart cities',
    category: 'Cleantech', stage: 'Revenue', teamSize: 8, lookingFor: ['investor'],
    ask: '$1.2M', equity: '15%', readiness: 98, mentorVerified: true,
    views: 8900, likes: 342, createdAt: '2025-02-20',
    founder: 'Elena Rostova', founderCollege: 'BITS Pilani',
    tags: ['IoT', 'GovTech', 'CleanEnergy'], description: 'EcoGrid deploys micro-grid controllers across municipal infrastructure, enabling cities to reduce energy wastage by up to 34%.',
    mentorSessions: 21, isSuggested: true,
  },
  {
    id: 'pr3', creatorId: 'mock_u3', title: 'FinFlow', tagline: 'Automated CFO for early-stage startups',
    category: 'FinTech', stage: 'Revenue', teamSize: 3, lookingFor: ['investor', 'cofounder'],
    ask: '$150k', equity: '5%', readiness: 94, mentorVerified: true,
    views: 2100, likes: 89, createdAt: '2025-03-30',
    founder: 'David Kim', founderCollege: 'NIT Trichy',
    tags: ['Finance', 'Automation', 'API'], description: 'FinFlow replaces the traditional accountant with a real-time financial co-pilot: runway tracking, tax automation and investor-ready reports — all in one dashboard.',
    mentorSessions: 9, isSuggested: false,
  },
  {
    id: 'pr4', creatorId: 'mock_u4', title: 'MediAI', tagline: 'Radiology diagnostic assistant using computer vision',
    category: 'HealthTech', stage: 'Prototype', teamSize: 4, lookingFor: ['investor'],
    ask: '$400k', equity: '9%', readiness: 65, mentorVerified: false,
    views: 1200, likes: 54, createdAt: '2025-05-01',
    founder: 'Priya Sharma', founderCollege: 'AIIMS Delhi',
    tags: ['CV', 'Healthcare', 'B2B'], description: 'MediAI flags anomalies in chest X-rays and CT scans with 94% accuracy, reducing radiologist workload by 60% in pilot studies at two hospitals.',
    mentorSessions: 3, isSuggested: false,
  },
  {
    id: 'pr5', creatorId: 'mock_u5', title: 'AeroDynamics', tagline: 'Next-gen aerospace composites for commercial aviation',
    category: 'DeepTech', stage: 'Prototype', teamSize: 6, lookingFor: ['investor', 'mentor'],
    ask: '$500k', equity: '10%', readiness: 72, mentorVerified: false,
    views: 1800, likes: 71, createdAt: '2025-04-22',
    founder: 'Sarah Jenkins', founderCollege: 'IISc Bangalore',
    tags: ['Materials', 'Aerospace', 'Hardware'], description: 'AeroDynamics develops carbon-ceramic hybrid composites 40% lighter than standard aircraft panels, with a patent-pending manufacturing process.',
    mentorSessions: 5, isSuggested: false,
  },
  {
    id: 'pr6', creatorId: 'mock_u6', title: 'LearnOS', tagline: 'Adaptive learning OS for Tier-2 college students',
    category: 'EdTech', stage: 'MVP', teamSize: 5, lookingFor: ['investor'],
    ask: '$300k', equity: '8%', readiness: 81, mentorVerified: true,
    views: 4100, likes: 203, createdAt: '2025-03-05',
    founder: 'Rohan Mehra', founderCollege: 'VIT Vellore',
    tags: ['EdTech', 'AI', 'Mobile'], description: 'LearnOS personalises course paths for engineering students using spaced repetition and peer benchmarking — 82% placement improvement in pilot batches.',
    mentorSessions: 16, isSuggested: true,
  }
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const teamSizeMatch = (projectSize, filter) => {
  if (filter === 'All') return true;
  const n = projectSize;
  if (filter === '1–2')  return n <= 2;
  if (filter === '3–5')  return n >= 3 && n <= 5;
  if (filter === '6–10') return n >= 6 && n <= 10;
  if (filter === '10+')  return n > 10;
  return true;
};

const sortDeals = (arr, sortId) => {
  const copy = [...arr];
  if (sortId === 'newest')    return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortId === 'trending')  return copy.sort((a, b) => b.views - a.views);
  if (sortId === 'liked')     return copy.sort((a, b) => b.likes - a.likes);
  if (sortId === 'readiness') return copy.sort((a, b) => b.readiness - a.readiness);
  return copy;
};

// ─────────────────────────────────────────────
// READINESS BAR
// ─────────────────────────────────────────────

const ReadinessBar = ({ value, index = 0 }) => {
  const color     = value >= 90 ? 'bg-emerald-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = value >= 90 ? 'text-emerald-400' : value >= 70 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <TrendingUp size={10} />Readiness
        </span>
        <span className={`text-[10px] sm:text-[11px] font-black tabular-nums ${textColor}`}>{value}%</span>
      </div>
      <div className="h-[3px] w-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 + 0.15, ease: 'easeOut' }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROJECT CARD — GRID VIEW
// ─────────────────────────────────────────────

const GridCard = ({ project, index, savedIds, interestIds, onWatchlist, onInterest }) => {
  const isSaved    = savedIds.has(project.id);
  const interested = interestIds.has(project.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.055, duration: 0.28 }}
      className="group relative bg-[#0c0c0c] border border-white/20 hover:border-[#e87315]/40 transition-all duration-300 overflow-hidden flex flex-col shadow-lg"
    >
      {project.isSuggested && (
        <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-[#e87315] px-2.5 py-1 z-10">
          <Sparkles size={10} className="text-black" />
          <span className="text-[9px] sm:text-[10px] font-black text-black uppercase tracking-widest">For You</span>
        </div>
      )}

      <div className="absolute left-0 top-0 w-[2px] h-full bg-transparent group-hover:bg-[#e87315] transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#e87315]/0 group-hover:from-[#e87315]/[0.05] to-transparent transition-all duration-500 pointer-events-none" />

      <div className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white/90 tracking-tight group-hover:text-[#e87315] transition-colors truncate">
                {project.title}
              </h3>
              <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#e87315]/70 transition-colors flex-shrink-0" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-[0.18em] mt-1">{project.category}</p>
          </div>
          <button
            onClick={() => onWatchlist(project.id)}
            className={`p-2 border transition-all flex-shrink-0 ${
              isSaved
                ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10'
                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
            }`}
            title={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
          >
            {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        </div>

        <p className="text-[11px] sm:text-[12px] text-white/60 font-medium leading-relaxed mb-4 line-clamp-2 flex-shrink-0">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-white/10 border border-white/20 text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Star size={10} className="text-white/40" />
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{project.stage}</span>
          </div>
          <div className="w-px h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Users size={10} className="text-white/40" />
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{project.teamSize}</span>
          </div>
          <div className="w-px h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Eye size={10} className="text-white/40" />
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{project.views.toLocaleString()}</span>
          </div>
          <div className="w-px h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Heart size={10} className="text-white/40" />
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{project.likes}</span>
          </div>
        </div>

        <div className="flex border border-white/10 mb-5">
          <div className="flex-1 px-4 py-3">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.18em] mb-1">Ask</p>
            <p className="text-sm sm:text-base font-black text-white/90">{project.ask}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1 px-4 py-3">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.18em] mb-1">Equity</p>
            <p className="text-sm sm:text-base font-black text-white/90">{project.equity}</p>
          </div>
        </div>

        <div className="mb-5">
          <ReadinessBar value={project.readiness} index={index} />
        </div>

        <div className="mb-5">
          {project.mentorVerified ? (
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1.5 w-max">
              <ShieldCheck size={11} className="text-indigo-400" />
              <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Mentor Validated · {project.mentorSessions} sessions</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1.5 w-max opacity-60">
              <AlertCircle size={11} className="text-white/40" />
              <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pending Validation</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-5 mt-auto">
          <div className="w-8 h-8 bg-[#0c0c0c] border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-black text-white/60">{project.founder[0]}</span>
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-white/70 font-bold">{project.founder}</span>
            <span className="text-white/30 mx-2">·</span>
            <span className="text-[10px] sm:text-[11px] text-white/50 font-bold">{project.founderCollege}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => onInterest(project)}
            disabled={interested}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all ${
              interested
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 cursor-default'
                : 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10 hover:bg-[#e87315]/20'
            }`}
          >
            {interested ? <CheckCheck size={14} /> : <Zap size={14} />}
            {interested ? 'Interest Sent' : 'Express Interest'}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// PROJECT CARD — LIST VIEW
// ─────────────────────────────────────────────

const ListCard = ({ project, index, savedIds, interestIds, onWatchlist, onInterest }) => {
  const isSaved    = savedIds.has(project.id);
  const interested = interestIds.has(project.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.04, duration: 0.24 }}
      className="group relative bg-[#0c0c0c] border border-white/20 hover:border-[#e87315]/40 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute left-0 top-0 w-[3px] h-full bg-transparent group-hover:bg-[#e87315] transition-colors duration-300" />

      <div className="p-5 flex items-center gap-6 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            {project.isSuggested && (
              <span className="flex items-center gap-1.5 bg-[#e87315]/10 border border-[#e87315]/30 px-2 py-1">
                <Sparkles size={10} className="text-[#e87315]" />
                <span className="text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase tracking-widest">For You</span>
              </span>
            )}
            <h3 className="text-base sm:text-lg font-black text-white/90 group-hover:text-[#e87315] transition-colors truncate">
              {project.title}
            </h3>
            <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-wider hidden sm:block flex-shrink-0">
              {project.category}
            </span>
          </div>
          <p className="text-[11px] sm:text-[12px] text-white/60 font-medium line-clamp-1">{project.tagline}</p>
          <div className="flex items-center gap-4 mt-3">
            {[
              { icon: Star,  val: project.stage },
              { icon: Users, val: `${project.teamSize} team` },
              { icon: Eye,   val: project.views.toLocaleString() },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-1.5">
                <Icon size={10} className="text-white/40 flex-shrink-0" />
                <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 flex-shrink-0">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">Ask</p>
            <p className="text-sm sm:text-base font-black text-white/90">{project.ask}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">Equity</p>
            <p className="text-sm sm:text-base font-black text-white/90">{project.equity}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="w-28">
            <ReadinessBar value={project.readiness} index={index} />
          </div>
          <div className="w-px h-10 bg-white/10" />
          {project.mentorVerified
            ? <ShieldCheck size={18} className="text-indigo-400 flex-shrink-0" title="Mentor Validated" />
            : <AlertCircle size={18} className="text-white/30 flex-shrink-0" title="Pending Validation" />
          }
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => onWatchlist(project.id)}
            className={`p-2.5 border transition-all ${
              isSaved
                ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10'
                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
            }`}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          <button
            onClick={() => onInterest(project)}
            disabled={interested}
            className={`flex items-center gap-2 px-4 py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${
              interested
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 cursor-default'
                : 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10 hover:bg-[#e87315]/20'
            }`}
          >
            {interested ? <CheckCheck size={12} /> : <Zap size={12} />}
            <span className="hidden sm:block">{interested ? 'Sent' : 'Invest'}</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────

const FilterPanel = ({ filters, setFilters, onClose }) => {
  const pill = (active) =>
    `px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
      active
        ? 'border-[#e87315]/60 text-[#e87315] bg-[#e87315]/10'
        : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-[#0c0c0c] border border-white/20 p-6 space-y-6">

        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2.5">
            <Filter size={14} />Filters
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div>
          <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.25em] mb-3">Stage</p>
          <div className="flex flex-wrap gap-2.5">
            {STAGES.map(s => (
              <button key={s} onClick={() => setFilters(f => ({ ...f, stage: s }))} className={pill(filters.stage === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.25em] mb-3">Team Size</p>
          <div className="flex flex-wrap gap-2.5">
            {TEAM_SIZES.map(s => (
              <button key={s} onClick={() => setFilters(f => ({ ...f, teamSize: s }))} className={pill(filters.teamSize === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => setFilters(f => ({ ...f, mentorOnly: !f.mentorOnly }))}
            className={pill(filters.mentorOnly)}
          >
            <ShieldCheck size={12} className="inline mr-1.5" />Mentor Validated Only
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, suggestedOnly: !f.suggestedOnly }))}
            className={pill(filters.suggestedOnly)}
          >
            <Sparkles size={12} className="inline mr-1.5" />Smart Suggestions Only
          </button>
        </div>

      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// SECTOR PRESET BAR
// ─────────────────────────────────────────────

const SectorBar = ({ active, onChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
    {SECTORS.map(sector => (
      <button
        key={sector}
        onClick={() => onChange(sector)}
        className={`flex-shrink-0 px-4 py-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all ${
          active === sector
            ? 'border-[#e87315]/60 text-[#e87315] bg-[#e87315]/10'
            : 'border-white/20 bg-[#0c0c0c] text-white/50 hover:border-white/40 hover:text-white/80'
        }`}
      >
        {sector}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// SORT DROPDOWN
// ─────────────────────────────────────────────

const SortDropdown = ({ active, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = SORT_OPTIONS.find(o => o.id === active) || SORT_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0c0c0c] border border-white/20 hover:border-white/40 text-white/60 hover:text-white/90 transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-widest"
      >
        <current.icon size={14} />
        {current.label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-12 w-48 bg-[#0c0c0c] border border-white/20 z-50 py-1.5 shadow-2xl"
          >
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-colors ${
                  active === opt.id ? 'text-[#e87315] bg-[#e87315]/10' : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                }`}
              >
                <opt.icon size={12} />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// STAT PILL
// ─────────────────────────────────────────────

const StatPill = ({ label, value, accent }) => (
  <div className="flex items-center gap-2.5 px-5 py-3 bg-[#0c0c0c] border border-white/10">
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-white/50">{label}</span>
    <span className={`text-sm sm:text-base font-black tabular-nums ${accent ? 'text-[#e87315]' : 'text-white/90'}`}>{value}</span>
  </div>
);

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

const InvestorDiscover = () => {
  const [viewMode, setViewMode]   = useState('grid');
  const [search, setSearch]       = useState('');
  const [sector, setSector]       = useState('All');
  const [sortBy, setSortBy]       = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    stage:         'All',
    teamSize:      'All',
    mentorOnly:    false,
    suggestedOnly: false,
  });

  const [savedIds,    setSavedIds]    = useState(new Set());
  const [interestIds, setInterestIds] = useState(new Set());
  const [loading,     setLoading]     = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/watchlist');
        setSavedIds(new Set(data.map(e => e.project?._id || e.project)));
      } catch (e) { console.warn('Watchlist load skipped in dev mode'); }
    };
    load();
  }, []);

  const handleWatchlist = useCallback(async (id) => {
    if (loading) return;
    const wasSaved = savedIds.has(id);
    setSavedIds(prev => { const n = new Set(prev); wasSaved ? n.delete(id) : n.add(id); return n; });
    try {
      setLoading(true);
      wasSaved ? await api.delete(`/watchlist/${id}`) : await api.post(`/watchlist/${id}`);
    } catch {
      setSavedIds(prev => { const n = new Set(prev); wasSaved ? n.add(id) : n.delete(id); return n; });
    } finally { setLoading(false); }
  }, [savedIds, loading]);

  const handleInterest = useCallback(async (project) => {
    if (interestIds.has(project.id)) return;
    setInterestIds(prev => new Set(prev).add(project.id));
    try {
      // Corrected to use the existing connectionAPI format
      await connectionAPI.send({ 
        to: project.creatorId, 
        type: 'investor-interest', 
        projectId: project.id 
      });
    } catch (e) {
      console.warn('Interest send skipped in dev mode:', e.message);
    }
  }, [interestIds]);

  const displayed = (() => {
    let arr = MOCK_PROJECTS;
    if (sector !== 'All') arr = arr.filter(p => p.category === sector);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.founder.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    arr = arr.filter(p => p.lookingFor.includes('investor'));
    if (filters.stage !== 'All') arr = arr.filter(p => p.stage === filters.stage);
    arr = arr.filter(p => teamSizeMatch(p.teamSize, filters.teamSize));
    if (filters.mentorOnly) arr = arr.filter(p => p.mentorVerified);
    if (filters.suggestedOnly) arr = arr.filter(p => p.isSuggested);
    return sortDeals(arr, sortBy);
  })();

  const activeFilterCount = [
    filters.stage !== 'All',
    filters.teamSize !== 'All',
    filters.mentorOnly,
    filters.suggestedOnly,
    sector !== 'All',
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 pb-16 px-4 md:px-8 pt-8"
    >
      <div className="relative overflow-hidden bg-[#0c0c0c] border border-white/20 p-8 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#e87315]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315]/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-[#e87315] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.35em]">Investor Dashboard</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white/90 italic tracking-tighter uppercase leading-none">
              Discover <span className="text-[#e87315]">Ventures</span>
            </h1>
            <p className="text-[11px] sm:text-[12px] text-white/50 font-bold uppercase tracking-[0.2em] mt-3">
              Explore all startups · Investor-focused filters · Smart suggestions
            </p>
          </div>

          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Search startups, founders, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/20 focus:border-[#e87315]/50 text-white/90 text-[11px] sm:text-[12px] font-bold placeholder:text-white/40 uppercase tracking-widest px-5 py-4 pl-12 outline-none transition-all"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 flex-wrap">
        <StatPill label="Total Ventures"    value={MOCK_PROJECTS.length}                                       />
        <StatPill label="Looking for Investor" value={MOCK_PROJECTS.filter(p => p.lookingFor.includes('investor')).length} accent />
        <StatPill label="Mentor Validated"  value={MOCK_PROJECTS.filter(p => p.mentorVerified).length}        />
        <StatPill label="Smart Suggestions" value={MOCK_PROJECTS.filter(p => p.isSuggested).length}           />
        <StatPill label="In Watchlist"      value={savedIds.size}                                              />
      </div>

      <SectorBar active={sector} onChange={setSector} />

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => setFilterOpen(v => !v)}
          className={`flex items-center gap-2.5 px-4 py-2.5 border text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
            filterOpen || activeFilterCount > 0
              ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10'
              : 'bg-[#0c0c0c] border-white/20 text-white/60 hover:border-white/40 hover:text-white/90'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-[#e87315] text-black text-[9px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <SortDropdown active={sortBy} onChange={setSortBy} />

        <span className="text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-widest ml-2">
          {displayed.length} result{displayed.length !== 1 ? 's' : ''}
        </span>

        {activeFilterCount > 0 && (
          <button
            onClick={() => { setSector('All'); setFilters({ stage: 'All', teamSize: 'All', mentorOnly: false, suggestedOnly: false }); }}
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-[#e87315] transition-colors"
          >
            <X size={12} />Reset
          </button>
        )}

        <div className="ml-auto flex items-center border border-white/20 bg-[#0c0c0c]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-[#e87315]/10 text-[#e87315]' : 'text-white/40 hover:text-white/90'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <div className="w-px h-6 bg-white/20" />
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-[#e87315]/10 text-[#e87315]' : 'text-white/40 hover:text-white/90'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setFilterOpen(false)} />
        )}
      </AnimatePresence>

      {!filters.suggestedOnly && sector === 'All' && !search && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-[#e87315]" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-white/60">Smart Suggestions — Based on your sector preferences</span>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4">
            {MOCK_PROJECTS.filter(p => p.isSuggested).map((project, i) => (
              <div key={project.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                <div className="bg-[#0c0c0c] border border-[#e87315]/30 hover:border-[#e87315]/60 transition-all duration-300 overflow-hidden group">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-base font-black text-white/90 group-hover:text-[#e87315] transition-colors">{project.title}</h4>
                        <p className="text-[9px] sm:text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">{project.category} · {project.stage}</p>
                      </div>
                      <button
                        className={`p-2 border transition-all ${savedIds.has(project.id) ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10' : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80'}`}
                        onClick={() => handleWatchlist(project.id)}
                      >
                        {savedIds.has(project.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-white/60 font-medium line-clamp-2 mb-4 mt-3">{project.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white/90">{project.ask}</span>
                      <button
                        onClick={() => handleInterest(project)}
                        disabled={interestIds.has(project.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${
                          interestIds.has(project.id)
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 cursor-default'
                            : 'border-[#e87315]/50 text-[#e87315] hover:bg-[#e87315]/15'
                        }`}
                      >
                        {interestIds.has(project.id) ? <CheckCheck size={11} /> : <Zap size={11} />}
                        {interestIds.has(project.id) ? 'Sent' : 'Interest'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-8 mb-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-white/40">All Ventures</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {displayed.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-16 h-16 bg-[#0c0c0c] border border-white/20 flex items-center justify-center mb-6">
              <Search size={24} className="text-white/40" />
            </div>
            <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-white/60 mb-3">No ventures found</p>
            <p className="text-[10px] sm:text-[11px] text-white/40 font-medium">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setSearch(''); setSector('All'); setFilters({ stage: 'All', teamSize: 'All', mentorOnly: false, suggestedOnly: false }); }}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 border border-white/20 text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-widest hover:border-[#e87315]/50 hover:text-[#e87315] transition-all"
            >
              <X size={12} />Clear all filters
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayed.map((p, i) => (
              <GridCard
                key={p.id} project={p} index={i}
                savedIds={savedIds} interestIds={interestIds}
                onWatchlist={handleWatchlist} onInterest={handleInterest}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {displayed.map((p, i) => (
              <ListCard
                key={p.id} project={p} index={i}
                savedIds={savedIds} interestIds={interestIds}
                onWatchlist={handleWatchlist} onInterest={handleInterest}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default InvestorDiscover;