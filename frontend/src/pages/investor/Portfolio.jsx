import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectionAPI } from '../../services/api';
import api from '../../services/api';
import {
  Briefcase,
  Search,
  Filter,
  FileText,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Users,
  X,
  ChevronDown,
  Star,
  Flame,
  Sparkles,
  LayoutGrid,
  List,
  CheckCheck,
  Clock,
  Heart,
} from 'lucide-react';

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

const MOCK_ACTIVE = [
  MOCK_PROJECTS[0],
  MOCK_PROJECTS[1],
  MOCK_PROJECTS[2],
];

const MOCK_PENDING = [
  MOCK_PROJECTS[3],
  MOCK_PROJECTS[4],
];

const MOCK_PASSED = [
  { ...MOCK_PROJECTS[5], reason: 'Market too niche for current thesis.', passedAt: '2025-02-14' },
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

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const InitialAvatar = ({ name, size = 'md' }) => {
  const sizeMap = { sm: 'w-8 h-8 text-[10px] sm:text-[11px]', md: 'w-10 h-10 sm:w-12 sm:h-12 text-[12px] sm:text-[14px]', lg: 'w-14 h-14 text-base' };
  return (
    <div className={`${sizeMap[size]} bg-[#0c0c0c] border border-white/20 flex items-center justify-center flex-shrink-0`}>
      <span className="font-black text-white/60">{name?.[0]?.toUpperCase() || '?'}</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// READINESS BAR
// ─────────────────────────────────────────────

const ReadinessBar = ({ value, animate: doAnimate = true }) => {
  const color     = value >= 90 ? 'bg-emerald-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = value >= 90 ? 'text-emerald-400' : value >= 70 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <TrendingUp size={10} />Readiness
        </span>
        <span className={`text-[10px] sm:text-[11px] font-black tabular-nums ${textColor}`}>{value}%</span>
      </div>
      <div className="h-[3px] w-full bg-white/10 overflow-hidden">
        <motion.div
          initial={doAnimate ? { width: 0 } : { width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PRIVATE NOTES PANEL
// ─────────────────────────────────────────────

const NotesPanel = ({ connectionId, initialNote = '', onClose }) => {
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Replaced raw axios with configured api instance
      await api.patch(`/connections/${connectionId}/notes`, { notes: note });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.warn('Notes save skipped in dev:', err.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-white/50 flex items-center gap-2">
            <StickyNote size={12} />Private Notes
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add private notes about this startup..."
          rows={3}
          className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#e87315]/50 text-white/90 text-[11px] sm:text-[12px] font-medium px-4 py-3 resize-none outline-none transition-all placeholder:text-white/30"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all ${
            saved
              ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
              : 'border-[#e87315]/50 text-[#e87315] hover:bg-[#e87315]/10 hover:border-[#e87315]'
          }`}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saved ? 'Saved' : 'Save Note'}
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// ACTIVE CARD
// ─────────────────────────────────────────────

const ActiveCard = ({ item, index }) => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // eslint-disable-next-line
  const [note, setNote] = useState(''); 
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.07, duration: 0.28 }}
      className="group relative bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 transition-all duration-300 overflow-hidden shadow-lg"
    >
      <div className="absolute left-0 top-0 w-[3px] h-full bg-transparent group-hover:bg-[#e87315] transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#e87315]/0 group-hover:from-[#e87315]/[0.05] to-transparent transition-all duration-500 pointer-events-none" />

      <div className="p-6 relative z-10">

        <div className="flex items-start gap-4 mb-5">
          <InitialAvatar name={item.founder} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/project/${item.projectId}`)}>
                  <h3 className="text-lg sm:text-xl font-black text-white/90 tracking-tight group-hover:text-[#e87315] transition-colors truncate">
                    {item.startup}
                  </h3>
                  <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#e87315]/70 transition-colors flex-shrink-0" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-[0.18em] mt-1.5 truncate">{item.category}</p>
              </div>
              {item.mentorVerified ? (
                <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1.5 flex-shrink-0">
                  <ShieldCheck size={11} className="text-indigo-400" />
                  <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hidden sm:block">Validated</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 flex-shrink-0 opacity-60">
                  <AlertCircle size={11} className="text-white/40" />
                  <span className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] hidden sm:block">Unverified</span>
                </div>
              )}
            </div>

            <p className="text-[11px] sm:text-[12px] text-white/60 font-medium mt-3 leading-relaxed line-clamp-2">
              {item.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 mb-5 pb-5 border-b border-white/10">
          {[
            { icon: Users,    val: `${item.teamSize} members`         },
            { icon: Star,     val: item.stage                         },
            { icon: Calendar, val: `Connected ${fmtDate(item.connectedAt)}`},
            { icon: Activity, val: `Active ${item.lastActivity}`       },
          ].map(({ icon: Icon, val }) => (
            <div key={val} className="flex items-center gap-1.5">
              <Icon size={11} className="text-white/40 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] text-white/60 font-bold">{val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-stretch border border-white/10 mb-5 bg-white/[0.02]">
          {[
            { label: 'Ask',     val: item.ask      },
            { label: 'Equity',  val: item.equity   },
            { label: 'Mentor Sessions', val: item.mentorSessions },
          ].map((f, i) => (
            <React.Fragment key={f.label}>
              {i > 0 && <div className="w-px bg-white/10" />}
              <div className="flex-1 px-4 py-3">
                <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.18em] mb-1">{f.label}</p>
                <p className="text-sm sm:text-base font-black text-white/90">{f.val}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mb-5">
          <ReadinessBar value={item.readiness} />
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/[0.05] border border-white/10 px-4 py-3.5 mb-5">
                <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Latest Update</p>
                <p className="text-[12px] sm:text-[13px] text-white/80 font-medium leading-relaxed">{item.recentUpdate}</p>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <BarChart2 size={12} className="text-white/40" />
                  <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{item.views.toLocaleString()} views</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-white/40" />
                  <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{item.likes} likes</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {notesOpen && (
            <NotesPanel
              connectionId={item.id}
              initialNote={note}
              onClose={() => setNotesOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0c0c0c] border border-white/20 hover:border-white/40 hover:bg-white/5 text-[10px] sm:text-[11px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-all">
            <MessageSquare size={14} />
            Message
          </button>
          <button
            onClick={() => setNotesOpen(v => !v)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 border text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
              notesOpen
                ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10'
                : 'bg-[#0c0c0c] border-white/20 hover:border-white/40 text-white/60 hover:text-white'
            }`}
          >
            <StickyNote size={14} />
            Notes
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="ml-auto p-2.5 bg-[#0c0c0c] border border-white/20 hover:border-white/40 text-white/50 hover:text-white transition-all"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

// --- PENDING CARD ---

const PendingCard = ({ item, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ delay: index * 0.07, duration: 0.28 }}
    className="group relative bg-[#0c0c0c] border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 overflow-hidden shadow-lg"
  >
    <div className="absolute left-0 top-0 w-[3px] h-full bg-yellow-500/50" />

    <div className="p-6">
      <div className="flex items-start gap-4 mb-5">
        <InitialAvatar name={item.founder} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white/90 tracking-tight truncate">{item.startup}</h3>
              <p className="text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-[0.18em] mt-1">{item.category}</p>
            </div>
            <div className="flex items-center gap-1.5 border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-1.5 flex-shrink-0">
              <Clock size={11} className="text-yellow-400" />
              <span className="text-[9px] sm:text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em]">Awaiting</span>
            </div>
          </div>
          <p className="text-[11px] sm:text-[12px] text-white/60 font-medium mt-2.5 line-clamp-2 leading-relaxed">{item.tagline}</p>
        </div>
      </div>

      <div className="flex items-stretch border border-white/10 mb-5 bg-white/[0.02]">
        {[
          { label: 'Ask',      val: item.ask },
          { label: 'Equity',   val: item.equity },
          { label: 'Team',     val: `${item.teamSize} people` },
        ].map((f, i) => (
          <React.Fragment key={f.label}>
            {i > 0 && <div className="w-px bg-white/10" />}
            <div className="flex-1 px-4 py-3">
              <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.18em] mb-1">{f.label}</p>
              <p className="text-sm sm:text-base font-black text-white/90">{f.val}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      <ReadinessBar value={item.readiness} />

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-white/40" />
          <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">Sent {fmtDate(item.sentAt)}</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border border-white/20 text-white/50 hover:border-[#e87315]/50 hover:text-[#e87315] transition-all bg-[#0c0c0c]">
          <X size={12} />
          Withdraw
        </button>
      </div>
    </div>
  </motion.div>
);

// --- PASSED CARD ---

const PassedCard = ({ item, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ delay: index * 0.07, duration: 0.28 }}
    className="group relative bg-[#0c0c0c] border border-white/10 opacity-70 hover:opacity-100 transition-all duration-300 overflow-hidden shadow-sm"
  >
    <div className="absolute left-0 top-0 w-[3px] h-full bg-white/20" />

    <div className="p-6">
      <div className="flex items-start gap-4 mb-5">
        <InitialAvatar name={item.founder} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white/70 tracking-tight line-through decoration-white/30 truncate">
                {item.startup}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-[0.18em] mt-1 truncate">{item.category}</p>
            </div>
            <div className="flex items-center gap-1.5 border border-white/20 bg-white/5 px-2.5 py-1.5 flex-shrink-0">
              <XCircle size={11} className="text-white/50" />
              <span className="text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Passed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-stretch border border-white/10 mb-5 bg-white/[0.02]">
        {[
          { label: 'Ask',    val: item.ask },
          { label: 'Equity', val: item.equity },
          { label: 'Stage',  val: item.stage },
        ].map((f, i) => (
          <React.Fragment key={f.label}>
            {i > 0 && <div className="w-px bg-white/10" />}
            <div className="flex-1 px-4 py-3">
              <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.18em] mb-1">{f.label}</p>
              <p className="text-[13px] sm:text-[14px] font-black text-white/70">{f.val}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {item.reason && (
        <div className="bg-white/5 border border-white/10 px-4 py-3 mb-5">
          <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1.5">Reason</p>
          <p className="text-[11px] sm:text-[12px] text-white/70 font-medium leading-relaxed">{item.reason}</p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <Calendar size={12} className="text-white/40" />
        <span className="text-[10px] sm:text-[11px] text-white/50 font-bold">Passed on {fmtDate(item.passedAt)}</span>
      </div>
    </div>
  </motion.div>
);

// --- STAT CARD ---

const StatCard = ({ label, value, sub, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex-1 min-w-[140px] bg-[#0c0c0c] border border-white/10 p-6 relative overflow-hidden group hover:border-[#e87315]/40 transition-all duration-300 shadow-md"
  >
    <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#e87315] transition-all duration-500" />
    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-1.5">{label}</p>
    <p className={`text-3xl sm:text-4xl font-black tracking-tighter ${accent ? 'text-[#e87315]' : 'text-white/90'}`}>{value}</p>
    {sub && <p className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">{sub}</p>}
  </motion.div>
);

// --- TAB BUTTON ---

const TabBtn = ({ id, label, icon: Icon, count, active, dot, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative flex items-center gap-2.5 px-6 py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] border-b-2 transition-all ${
      active
        ? 'border-[#e87315] text-[#e87315]'
        : 'border-transparent text-white/50 hover:text-white/90 hover:border-white/30'
    }`}
  >
    <Icon size={14} className="sm:w-[16px] sm:h-[16px]" />
    {label}
    <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] sm:text-[10px] font-black border ${
      active ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10' : 'border-white/20 text-white/60'
    }`}>
      {count}
    </span>
    {dot && count > 0 && (
      <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${dot} animate-pulse`} />
    )}
  </button>
);

// --- EMPTY STATE ---

const EmptyState = ({ tab }) => {
  const configs = {
    active:   { icon: CheckCircle2, msg: 'No active investments yet.',      sub: 'Express interest in startups from the Deal Flow page.' },
    pending:  { icon: Clock,        msg: 'No pending requests.',             sub: 'Sent interest requests will appear here until accepted.' },
    passed:   { icon: XCircle,      msg: 'No passed deals.',                 sub: 'Deals you declined or passed on will be archived here.' },
  };
  const { icon: Icon, msg, sub } = configs[tab] || configs.active;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 sm:py-32 text-center border border-dashed border-white/20 bg-[#0c0c0c] mt-4"
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/[0.02] border border-white/10 flex items-center justify-center mb-5 sm:mb-6">
        <Icon size={24} className="text-white/40 sm:w-[28px] sm:h-[28px]" />
      </div>
      <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.25em] text-white/60 mb-2.5">{msg}</p>
      <p className="text-[10px] sm:text-[11px] text-white/40 font-medium max-w-sm leading-relaxed">{sub}</p>
    </motion.div>
  );
};

// --- MAIN PAGE ---

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('active');

  // eslint-disable-next-line
  const [activeDeals]  = useState(MOCK_ACTIVE);
  // eslint-disable-next-line
  const [pendingDeals] = useState(MOCK_PENDING);
  // eslint-disable-next-line
  const [passedDeals]  = useState(MOCK_PASSED);

  const verifiedCount   = activeDeals.filter(d => d.mentorVerified).length;
  const avgReadiness    = activeDeals.length
    ? Math.round(activeDeals.reduce((s, d) => s + d.readiness, 0) / activeDeals.length)
    : 0;

  const TABS = [
    { id: 'active',  label: 'Active',   icon: CheckCircle2, count: activeDeals.length,  dot: 'bg-emerald-500' },
    { id: 'pending', label: 'Pending',  icon: Clock,        count: pendingDeals.length, dot: 'bg-yellow-500'  },
    { id: 'passed',  label: 'Passed',   icon: XCircle,      count: passedDeals.length,  dot: null             },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 pb-16 px-4 md:px-8 pt-8"
    >

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-[#0c0c0c] border border-white/20 p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#e87315]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315]/50 via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 bg-[#e87315] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.35em]">Investor Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white/90 italic tracking-tighter uppercase leading-none">
            My <span className="text-[#e87315]">Portfolio</span>
          </h1>
          <p className="text-[11px] sm:text-[12px] text-white/50 font-bold uppercase tracking-[0.2em] mt-3">
            {activeDeals.length} active · {pendingDeals.length} pending · {passedDeals.length} passed
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/[0.05] border border-white/10 px-5 py-3 rounded-lg shadow-sm">
          <Briefcase size={16} className="text-white/50" />
          <span className="text-[10px] sm:text-[11px] text-white/60 font-bold uppercase tracking-widest">Capital at work</span>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="flex gap-4 overflow-x-auto pb-2 flex-wrap">
        <StatCard label="Active Investments" value={activeDeals.length}  sub="accepted deals"      delay={0}    />
        <StatCard label="Pending Requests"   value={pendingDeals.length} sub="awaiting response"   delay={0.06} />
        <StatCard label="Mentor Validated"   value={verifiedCount}       sub="trusted startups"    delay={0.12} />
        <StatCard label="Avg Readiness"      value={`${avgReadiness}%`}  sub="portfolio health"    delay={0.18} accent />
      </div>

      {/* ── TABS ── */}
      <div className="bg-[#0c0c0c] border border-white/20 shadow-xl">

        {/* Tab row */}
        <div className="flex items-center border-b border-white/20 overflow-x-auto">
          {TABS.map(tab => (
            <TabBtn key={tab.id} {...tab} active={activeTab === tab.id} onClick={setActiveTab} />
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {activeDeals.length === 0 ? (
                  <EmptyState tab="active" />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {activeDeals.map((item, i) => (
                      <ActiveCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pending' && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {pendingDeals.length === 0 ? (
                  <EmptyState tab="pending" />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {pendingDeals.map((item, i) => (
                      <PendingCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'passed' && (
              <motion.div
                key="passed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {passedDeals.length === 0 ? (
                  <EmptyState tab="passed" />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {passedDeals.map((item, i) => (
                      <PassedCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
};

export default Portfolio;