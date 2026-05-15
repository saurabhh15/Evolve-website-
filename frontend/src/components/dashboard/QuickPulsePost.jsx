import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  HelpCircle,
  Trophy,
  MessageSquare,
  X,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Send,
} from 'lucide-react';
import axios from 'axios';

// ─── Post type config ───────────────────────────────────────────────
const POST_TYPES = [
  {
    id: 'build_update',
    label: 'Build Update',
    shortLabel: 'BUILD',
    icon: Zap,
    color: '#e87315',
    placeholder: "What did you ship or make progress on today?",
    hint: 'Share what you built, improved, or learned.',
  },
  {
    id: 'help_request',
    label: 'Help Request',
    shortLabel: 'HELP',
    icon: HelpCircle,
    color: '#f43f5e',
    placeholder: "Describe exactly where you're stuck...",
    hint: 'Be specific — the clearer the problem, the faster you get help.',
  },
  {
    id: 'milestone',
    label: 'Milestone',
    shortLabel: 'WIN',
    icon: Trophy,
    color: '#22c55e',
    placeholder: "What milestone did you just hit?",
    hint: 'Celebrate it. Your network wants to know.',
  },
  {
    id: 'feedback_wanted',
    label: 'Feedback Wanted',
    shortLabel: 'FEEDBACK',
    icon: MessageSquare,
    color: '#818cf8',
    placeholder: "What do you want feedback on specifically?",
    hint: 'Mention what aspect: UI, idea, pitch, business model…',
  },
];

const URGENCY_OPTIONS = ['low', 'medium', 'urgent'];

// ─── Component ───────────────────────────────────────────────────────
const QuickPulsePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(POST_TYPES[0]);
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const wrapperRef = useRef(null);

  // Auto-focus textarea when expanded
  useEffect(() => {
    if (expanded && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [expanded]);

  // Click outside to collapse (only if empty)
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (!headline && !body) setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [headline, body]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setError('');
  };

  const handleReset = () => {
    setHeadline('');
    setBody('');
    setTags('');
    setUrgency('medium');
    setSelectedType(POST_TYPES[0]);
    setExpanded(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!headline.trim()) {
      setError('Headline is required.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        type: selectedType.id,
        headline: headline.trim(),
        body: body.trim(),
        tags: tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        ...(selectedType.id === 'help_request' && { urgency }),
      };
      await axios.post('/api/pulse', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg('Posted to Pulse!');
      handleReset();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeType = selectedType;
  const charCount = headline.length;
  const HEADLINE_LIMIT = 120;

  return (
    <div ref={wrapperRef} className="w-full animate-evolve-in" style={{ animationDelay: '0.12s' }}>
      {/* ── Success Toast ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-3 flex items-center gap-3 px-5 py-3 bg-[#0c0c0c] border border-[#22c55e]/30 text-[#22c55e]"
          >
            <span className="w-1.5 h-1.5 bg-[#22c55e] rotate-45 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em]">{successMsg}</span>
            <button
              onClick={() => navigate('/dashboard/pulse')}
              className="ml-auto flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#22c55e]/60 hover:text-[#22c55e] transition-colors"
            >
              View Feed <ChevronRight size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Card ── */}
      <div
        className="relative bg-[#0c0c0c] border border-white/[0.06] hover:border-white/10 transition-colors duration-500 overflow-hidden"
        style={{
          borderLeft: `2px solid ${expanded ? activeType.color : 'rgba(232,115,21,0.3)'}`,
          transition: 'border-color 0.4s ease',
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* ── Collapsed / Trigger Row ── */}
        <div
          className="relative flex items-center gap-4 px-6 py-4 cursor-text"
          onClick={() => setExpanded(true)}
        >
          {/* Avatar */}
          <div className="relative shrink-0 w-9 h-9 border border-white/10 overflow-hidden">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=80&name=${encodeURIComponent(user.name || 'U')}&bold=true`;
                }}
                className="w-full h-full object-cover"
                alt={user?.name}
              />
            ) : (
              <div className="w-full h-full bg-[#080808] flex items-center justify-center">
                <span className="text-[#e87315] font-black text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 w-2 h-2"
              style={{ background: activeType.color }}
            />
          </div>

          {/* Prompt text */}
          <div className="flex-1 min-w-0">
            {!expanded ? (
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.25em] select-none">
                Share a build update, ask for help, celebrate a win...
              </p>
            ) : (
              <input
                type="text"
                value={headline}
                onChange={(e) => {
                  if (e.target.value.length <= HEADLINE_LIMIT) setHeadline(e.target.value);
                }}
                placeholder={activeType.placeholder}
                className="w-full bg-transparent text-white text-[13px] font-bold tracking-wide placeholder:text-white/20 focus:outline-none"
              />
            )}
          </div>

          {/* Right: type badge or post button */}
          {!expanded ? (
            <div
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
              style={{
                borderColor: 'rgba(232,115,21,0.3)',
                color: '#e87315',
              }}
            >
              <Zap size={10} />
              Post to Pulse
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="shrink-0 p-1.5 text-white/20 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Expanded Area ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden"
            >
              {/* ── Type Selector Row ── */}
              <div className="px-6 pb-4 flex items-center gap-2 flex-wrap border-t border-white/[0.04]  pt-4">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mr-1">
                  Post Type
                </span>
                {POST_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type)}
                      className="relative flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                      style={{
                        background: isActive ? type.color : 'transparent',
                        color: isActive ? '#000' : 'rgba(255,255,255,0.3)',
                        border: isActive
                          ? `1px solid ${type.color}`
                          : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Icon size={9} strokeWidth={isActive ? 3 : 2} />
                      {type.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* ── Body Textarea ── */}
              <div className="px-6 pb-4">
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={activeType.hint}
                  rows={3}
                  className="w-full bg-[#080808] border border-white/[0.06] focus:border-white/10 text-white/80 text-[12px] font-medium tracking-wide placeholder:text-white/15 focus:outline-none resize-none px-4 py-3 transition-colors"
                />
              </div>

              {/* ── Tags + Urgency Row ── */}
              <div className="px-6 pb-4 flex items-center gap-4 flex-wrap">
                {/* Tags */}
                <div className="flex-1 min-w-[160px] relative">
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags: react, fintech, api..."
                    className="w-full bg-transparent border border-white/[0.06] focus:border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider placeholder:text-white/15 focus:outline-none px-3 py-2 transition-colors"
                  />
                </div>

                {/* Urgency — only for Help Request */}
                <AnimatePresence>
                  {selectedType.id === 'help_request' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                        Urgency
                      </span>
                      {URGENCY_OPTIONS.map((u) => (
                        <button
                          key={u}
                          onClick={() => setUrgency(u)}
                          className="px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] transition-all"
                          style={{
                            background:
                              urgency === u
                                ? u === 'urgent'
                                  ? '#f43f5e'
                                  : u === 'medium'
                                  ? '#e87315'
                                  : '#22c55e'
                                : 'transparent',
                            color: urgency === u ? '#000' : 'rgba(255,255,255,0.25)',
                            border:
                              urgency === u
                                ? 'none'
                                : '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          {u}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Char counter */}
                <span
                  className="text-[9px] font-black uppercase tracking-widest ml-auto"
                  style={{
                    color:
                      charCount > HEADLINE_LIMIT * 0.85
                        ? '#f43f5e'
                        : 'rgba(255,255,255,0.15)',
                  }}
                >
                  {charCount}/{HEADLINE_LIMIT}
                </span>
              </div>

              {/* ── Error ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-3 flex items-center gap-2 text-[#f43f5e]"
                  >
                    <AlertTriangle size={10} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Footer Actions ── */}
              <div className="px-6 py-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
                <button
                  onClick={() => navigate('/dashboard/pulse')}
                  className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 hover:text-[#e87315] transition-colors flex items-center gap-1.5"
                >
                  View Pulse Feed
                  <ChevronRight size={10} />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 hover:text-white/50 transition-colors px-3 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !headline.trim()}
                    className="relative flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden group"
                    style={{
                      background: headline.trim() ? activeType.color : 'rgba(255,255,255,0.05)',
                      color: headline.trim() ? '#000' : 'rgba(255,255,255,0.2)',
                      boxShadow: headline.trim()
                        ? `0 0 20px ${activeType.color}30`
                        : 'none',
                    }}
                  >
                    {/* Scan line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    {isSubmitting ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    {isSubmitting ? 'Posting...' : 'Post to Pulse'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickPulsePost;