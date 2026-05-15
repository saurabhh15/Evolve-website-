import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectionAPI } from '../../services/api';
import api from '../../services/api';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Zap,
  ShieldCheck,
  AlertCircle,
  Users,
  TrendingUp,
  Eye,
  Heart,
  ArrowUpRight,
  MoreHorizontal,
  X,
  ChevronDown,
  Star,
  Flame,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  CheckCheck,
  Clock,
  Briefcase
} from 'lucide-react';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const SECTORS = [
  'All', 'AI / ML', 'FinTech', 'EdTech', 'HealthTech',
  'Cleantech', 'SaaS', 'DeepTech', 'Blockchain', 'E-Commerce',
];

const STAGES = [
  { id: 'inquiry',    label: 'Initial Inquiry',    dot: 'bg-blue-500',    pill: 'border-blue-500/40 text-blue-400 bg-blue-500/10'    },
  { id: 'diligence',  label: 'Due Diligence',      dot: 'bg-yellow-500',  pill: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'  },
  { id: 'term_sheet', label: 'Term Sheet',         dot: 'bg-[#e87315]',   pill: 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10'   },
  { id: 'portfolio',  label: 'Closed / Portfolio', dot: 'bg-emerald-500', pill: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
];

const CATEGORIES = ['All', 'AI / Machine Learning', 'FinTech', 'EdTech', 'DeepTech', 'Cleantech', 'Blockchain', 'SaaS', 'HealthTech'];

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const MOCK_DEALS = [
  { id: 'd1', startup: 'NeuroSync',   founder: 'Alex Chen',      category: 'AI / Machine Learning', status: 'inquiry',    ask: '$250k', equity: '7%',  readiness: 88, mentorVerified: true,  lastUpdate: '2 hours ago',  teamSize: 4, stage: 'MVP'     },
  { id: 'd2', startup: 'AeroDynamics',founder: 'Sarah Jenkins',  category: 'DeepTech',              status: 'inquiry',    ask: '$500k', equity: '10%', readiness: 72, mentorVerified: false, lastUpdate: '1 day ago',    teamSize: 6, stage: 'Prototype'},
  { id: 'd3', startup: 'FinFlow',     founder: 'David Kim',      category: 'FinTech',               status: 'diligence',  ask: '$150k', equity: '5%',  readiness: 94, mentorVerified: true,  lastUpdate: '4 hours ago',  teamSize: 3, stage: 'Revenue' },
  { id: 'd4', startup: 'EcoGrid',     founder: 'Elena Rostova',  category: 'Cleantech',             status: 'term_sheet', ask: '$1.2M', equity: '15%', readiness: 98, mentorVerified: true,  lastUpdate: '10 mins ago',  teamSize: 8, stage: 'Revenue' },
  { id: 'd5', startup: 'NexusWeb3',   founder: 'James Wright',   category: 'Blockchain',            status: 'portfolio',  ask: '$300k', equity: '8%',  readiness: 100,mentorVerified: true,  lastUpdate: '1 week ago',   teamSize: 5, stage: 'Launched'},
  { id: 'd6', startup: 'MediAI',      founder: 'Priya Sharma',   category: 'HealthTech',            status: 'inquiry',    ask: '$400k', equity: '9%',  readiness: 65, mentorVerified: false, lastUpdate: '3 days ago',   teamSize: 4, stage: 'Idea'    },
];

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
// STAT CARD
// ─────────────────────────────────────────────

const StatCard = ({ label, value, sub, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex-1 min-w-[150px] bg-[#0c0c0c] border border-white/10 p-5 sm:p-6 flex flex-col gap-1.5 relative overflow-hidden group hover:border-[#e87315]/40 transition-all duration-300 shadow-lg"
  >
    <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#e87315] transition-all duration-500" />
    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{label}</p>
    <p className={`text-2xl sm:text-3xl font-black tracking-tighter ${accent ? 'text-[#e87315]' : 'text-white/90'}`}>{value}</p>
    {sub && <p className="text-[10px] sm:text-[11px] text-white/40 font-bold uppercase tracking-wider">{sub}</p>}
  </motion.div>
);

// ─────────────────────────────────────────────
// DEAL CARD
// ─────────────────────────────────────────────

const DealCard = ({ deal, index, savedIds, onWatchlistToggle }) => {
  const isSaved = savedIds.has(deal.id);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.06, duration: 0.28, ease: 'easeOut' }}
      className="group relative bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/50 transition-all duration-300 overflow-hidden cursor-pointer shadow-xl"
    >
      <div className="absolute left-0 top-0 w-[3px] h-full bg-transparent group-hover:bg-[#e87315] transition-colors duration-300 z-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#e87315]/0 to-transparent group-hover:from-[#e87315]/[0.05] transition-all duration-500 pointer-events-none" />

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2.5">
              <h4 className="text-lg sm:text-xl font-black text-white/90 tracking-tight group-hover:text-[#e87315] transition-colors truncate">
                {deal.startup}
              </h4>
              <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#e87315]/70 transition-colors flex-shrink-0" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1 truncate">
              {deal.category}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onWatchlistToggle(deal.id); }}
              className={`p-2 border transition-all duration-200 ${
                isSaved
                  ? 'border-[#e87315]/50 text-[#e87315] bg-[#e87315]/10'
                  : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 bg-white/[0.02]'
              }`}
              title={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
            >
              {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
                className="p-2 border border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 transition-all bg-white/[0.02]"
              >
                <MoreHorizontal size={14} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-10 w-40 bg-[#0c0c0c] border border-white/20 z-50 py-1.5 shadow-2xl"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {['View Profile', 'Share Deal', 'Mark as Passed'].map(item => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="text-[11px] sm:text-[12px] text-white/70 font-medium leading-relaxed mb-5 line-clamp-2 flex-shrink-0">
          {deal.tagline}
        </p>

        {/* <div className="flex flex-wrap gap-2 mb-5">
          {deal.tags?.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-white/[0.05] border border-white/10 text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div> */}

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/10 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-white/40" />
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold uppercase">{deal.stage}</span>
          </div>
          <div className="w-px h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-white/40" />
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold uppercase">{deal.teamSize} Team</span>
          </div>
        </div>

        <div className="flex border border-white/10 mb-6 bg-white/[0.02]">
          <div className="flex-1 px-4 py-3.5">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Ask</p>
            <p className="text-base sm:text-lg font-black text-white/90">{deal.ask}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1 px-4 py-3.5">
            <p className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Equity</p>
            <p className="text-base sm:text-lg font-black text-white/90">{deal.equity}</p>
          </div>
        </div>

        <div className="mb-6">
          <ReadinessBar value={deal.readiness} index={index} />
        </div>

        <div className="mb-6">
          {deal.mentorVerified ? (
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 w-max">
              <ShieldCheck size={12} className="text-indigo-400" />
              <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Mentor Validated</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 w-max opacity-60">
              <AlertCircle size={12} className="text-white/40" />
              <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pending Validation</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6 mt-auto">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0c0c0c] border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] sm:text-[12px] font-black text-white/60">{deal.founder[0]}</span>
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-white/60 font-bold">{deal.founder}</span>
            <span className="text-white/30 mx-2">·</span>
            <span className="text-[10px] sm:text-[11px] text-white/50 font-bold">{deal.founderCollege}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all hover:bg-[#e87315] hover:border-[#e87315] hover:text-black border-white/20 text-white/80 bg-white/[0.05]`}
          >
            <Zap size={14} />
            Engage
          </button>
        </div>

      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────

const FilterBar = ({ activeCategory, setActiveCategory, showSavedOnly, setShowSavedOnly, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="bg-[#0c0c0c] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl"
  >
    <div className="flex items-center justify-between">
      <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2.5">
        <Filter size={14} /> Filter by Category
      </p>
      <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
    <div className="flex flex-wrap gap-2.5">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all ${
            activeCategory === cat
              ? 'border-[#e87315]/60 text-[#e87315] bg-[#e87315]/10'
              : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80 bg-[#0c0c0c]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
      <button
        onClick={() => setShowSavedOnly(v => !v)}
        className={`flex items-center gap-2 px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all ${
          showSavedOnly
            ? 'border-[#e87315]/60 text-[#e87315] bg-[#e87315]/10'
            : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80 bg-[#0c0c0c]'
        }`}
      >
        <Bookmark size={12} />
        Watchlist Only
      </button>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const DealRoom = () => {
  const [deals] = useState(MOCK_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // savedIds: Set of deal/project IDs the investor has watchlisted
  const [savedIds, setSavedIds] = useState(new Set());
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // ── Load watchlist state on mount ──
  useEffect(() => {
    const fetchWatchlistState = async () => {
      try {
        const { data } = await api.get('/watchlist');
        const ids = new Set(data.map(entry => entry.project?._id || entry.project));
        setSavedIds(ids);
      } catch (err) {
        console.warn('Watchlist fetch skipped:', err.message);
      }
    };
    fetchWatchlistState();
  }, []);

  // ── Toggle watchlist saved state ──
  const handleWatchlistToggle = useCallback(async (dealId) => {
    if (watchlistLoading) return;

    const wasSaved = savedIds.has(dealId);

    // Optimistic update
    setSavedIds(prev => {
      const next = new Set(prev);
      wasSaved ? next.delete(dealId) : next.add(dealId);
      return next;
    });

    try {
      setWatchlistLoading(true);
      if (wasSaved) {
        await api.delete(`/watchlist/${dealId}`);
      } else {
        await api.post(`/watchlist/${dealId}`);
      }
    } catch (err) {
      // Rollback on error
      setSavedIds(prev => {
        const next = new Set(prev);
        wasSaved ? next.add(dealId) : next.delete(dealId);
        return next;
      });
      console.error('Watchlist toggle failed:', err.message);
    } finally {
      setWatchlistLoading(false);
    }
  }, [savedIds, watchlistLoading]);

  // ── Filter deals ──
  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.founder.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'All' || deal.category === activeCategory;
    const matchesSaved = !showSavedOnly || savedIds.has(deal.id);

    return matchesSearch && matchesCategory && matchesSaved;
  });

  // ── Summary stats ──
  const totalAsk = deals.reduce((sum, d) => {
    const num = parseFloat(d.ask.replace(/[$kKMm]/g, '')) * (d.ask.toLowerCase().includes('m') ? 1000 : 1);
    return sum + num;
  }, 0);

  const verifiedCount = deals.filter(d => d.mentorVerified).length;
  const portfolioCount = deals.filter(d => d.status === 'portfolio').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 pb-16 px-4 md:px-8 pt-8"
    >

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-[#0c0c0c] border border-white/20 p-8 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#e87315]/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315]/40 via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#e87315] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.35em]">Capital Deployment</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white/90 italic tracking-tighter uppercase leading-none">
            Deal <span className="text-[#e87315]">Room</span>
          </h1>
          <p className="text-[11px] sm:text-[12px] text-white/50 font-bold uppercase tracking-[0.2em] mt-3">
            {deals.length} ventures · {verifiedCount} mentor-validated
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search ventures, founders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/20 focus:border-[#e87315]/50 text-white/90 text-[11px] sm:text-[12px] font-bold placeholder:text-white/40 uppercase tracking-widest px-5 py-4 pl-12 transition-all outline-none"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className={`p-4 border transition-all group ${filterOpen ? 'border-[#e87315]/50 bg-[#e87315]/10 text-[#e87315]' : 'bg-[#0c0c0c] border-white/20 hover:border-[#e87315]/40 text-white/60 hover:text-white/90'}`}
          >
            <Filter size={18} className={`transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="flex gap-4 overflow-x-auto pb-2 flex-wrap">
        {[
          { label: 'Active Deals',       value: deals.length,      sub: 'in pipeline',    accent: false },
          { label: 'In Watchlist',        value: savedIds.size,      sub: 'saved projects', accent: true  },
          { label: 'Portfolio',           value: portfolioCount,     sub: 'closed deals',   accent: false },
          { label: 'Mentor Validated',    value: `${verifiedCount}/${deals.length}`, sub: 'trust signals', accent: false },
        ].map((s, i) => (
          <motion.div key={s.label} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <AnimatePresence>
        {filterOpen && (
          <FilterBar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            showSavedOnly={showSavedOnly}
            setShowSavedOnly={setShowSavedOnly}
            onClose={() => setFilterOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── PIPELINE KANBAN ── */}
      <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory min-h-[560px]">
        {STAGES.map((stage) => {
          const stageDeals = filteredDeals.filter(d => d.status === stage.id);

          return (
            <div
              key={stage.id}
              className="min-w-[320px] w-[320px] sm:min-w-[360px] sm:w-[360px] flex-shrink-0 snap-start flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-white/20 sticky top-0 bg-[#050505] z-10 pt-2">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 ${stage.dot} flex-shrink-0`} />
                  <h3 className="text-[11px] sm:text-[12px] font-black text-white/90 uppercase tracking-[0.25em]">
                    {stage.label}
                  </h3>
                </div>
                <span className={`text-[10px] sm:text-[11px] font-black px-2.5 py-1 border ${stage.pill}`}>
                  {stageDeals.length}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {stageDeals.map((deal, idx) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      index={idx}
                      savedIds={savedIds}
                      onWatchlistToggle={handleWatchlistToggle}
                    />
                  ))}

                  {stageDeals.length === 0 && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full p-10 border border-dashed border-white/20 flex flex-col items-center justify-center text-center bg-[#0c0c0c] opacity-60"
                    >
                      <Briefcase size={24} className="text-white/40 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">No Deals</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          );
        })}
      </div>

    </motion.div>
  );
};

export default DealRoom;