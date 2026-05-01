import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Clock, CheckCircle, XCircle,
  Layers, Eye, Heart, ArrowUpRight, MessageSquare, Pencil, Trash2
} from 'lucide-react';
import { connectionAPI, userAPI, noteAPI, commentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAIN_TABS = ['inquiries', 'mentees'];
const STATUS_TABS = ['pending', 'accepted'];

const STATUS_STYLE = {
  pending: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400' },
  accepted: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400' },
  declined: { bg: 'bg-red-500/10', border: 'border-red-500/25', text: 'text-red-400' },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`bg-white/[0.03] rounded-2xl animate-pulse ${className}`} />
);

// ─── Inquiry Card ─────────────────────────────────────────────────────────────
const InquiryCard = ({ inquiry, onAction, isPending }) => {
  const navigate = useNavigate();
  const [acting, setActing] = useState(false);

  const handleAction = async (status) => {
    setActing(true);
    await onAction(inquiry._id, status);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
      className="bg-[#101010] border border-white/[0.05] hover:border-[#e87315]/25 rounded-[1.75rem] p-6 md:p-7 transition-colors duration-300 group"
    >
      <div className="flex items-start gap-5">

        {/* Avatar */}
        <img
          src={inquiry.from?.profileImage}
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(inquiry.from?.name || 'U')}&bold=true`;
          }}
          onClick={() => navigate(`/dashboard/user/${inquiry.from?._id}`)}
          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity border border-white/[0.06]"
          alt={inquiry.from?.name}
        />

        {/* Body */}
        <div className="flex-1 min-w-0">

          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <p
              onClick={() => navigate(`/dashboard/user/${inquiry.from?._id}`)}
              className="text-base font-black text-white hover:text-[#e87315] transition-colors cursor-pointer leading-tight"
            >
              {inquiry.from?.name}
            </p>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest shrink-0">
              <Clock size={10} />
              {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Role / college */}
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            {inquiry.from?.college || inquiry.from?.role || 'Student'}
          </p>

          {/* Linked project */}
          {inquiry.projectId && (
            <div
              onClick={() => navigate(`/dashboard/project/${inquiry.projectId?._id || inquiry.projectId}`)}
              className="inline-flex items-center gap-1.5 mb-3 cursor-pointer group/proj"
            >
              <span className="text-[11px] font-black text-[#e87315] group-hover/proj:underline">
                Re: {inquiry.projectId?.title || 'Project'}
              </span>
            </div>
          )}

          {/* Message */}
          {inquiry.message && (
            <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2 mb-4">
              "{inquiry.message}"
            </p>
          )}

          {/* Actions — pending only */}
          {isPending && (
            <div className="flex gap-2">
              <button
                disabled={acting}
                onClick={() => handleAction('accepted')}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#e87315] hover:bg-[#f97316] disabled:opacity-50 text-[#080808] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_0_16px_rgba(232,115,21,0.15)]"
              >
                <CheckCircle size={12} strokeWidth={3} /> Accept
              </button>
              <button
                disabled={acting}
                onClick={() => handleAction('rejected')}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#181818] hover:bg-red-500/10 disabled:opacity-50 text-gray-400 hover:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/[0.05] hover:border-red-500/25 transition-all active:scale-95"
              >
                <XCircle size={12} strokeWidth={3} /> Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Mentee Card ──────────────────────────────────────────────────────────────
const MenteeCard = ({ mentee, index }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  // Stats
  const [projects, setProjects] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Notes
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteInput, setEditNoteInput] = useState('');

  // Feedback
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleExpand = async () => {
    setExpanded(prev => !prev);
    if (!expanded) {
      // Load stats
      if (projects.length === 0) {
        setStatsLoading(true);
        try {
          const res = await userAPI.getUserProjects(mentee._id);
          setProjects(res.data);
        } catch (err) {
          console.error('Failed to load projects:', err);
        } finally {
          setStatsLoading(false);
        }
      }
      // Load notes
      if (notes.length === 0) {
        setNotesLoading(true);
        try {
          const res = await noteAPI.getAll(mentee._id);
          setNotes(res.data);
        } catch (err) {
          console.error('Failed to load notes:', err);
        } finally {
          setNotesLoading(false);
        }
      }
    }
  };

  const handleAddNote = async () => {
    if (!noteInput.trim() || noteSubmitting) return;
    setNoteSubmitting(true);
    try {
      const res = await noteAPI.add(mentee._id, noteInput.trim());
      setNotes(prev => [res.data, ...prev]);
      setNoteInput('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleEditNote = async (id) => {
    try {
      const res = await noteAPI.edit(id, editNoteInput.trim());
      setNotes(prev => prev.map(n => n._id === id ? res.data : n));
      setEditingNote(null);
      setEditNoteInput('');
    } catch (err) {
      console.error('Failed to edit note:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await noteAPI.delete(id);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleFeedback = async () => {
    if (!feedbackInput.trim() || feedbackSubmitting || !mentee.latestProject) return;
    setFeedbackSubmitting(true);
    try {
      await commentAPI.add(mentee.latestProject._id, feedbackInput.trim());
      setFeedbackInput('');
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch (err) {
      console.error('Failed to send feedback:', err);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const totalViews = projects.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalLikes = projects.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-[#101010] border border-white/[0.05] hover:border-[#e87315]/25 rounded-[1.75rem] overflow-hidden transition-colors duration-300"
    >
      {/* ── Top Row ── */}
      <div className="relative bg-[#080808] border border-white/[0.03] overflow-hidden group">
        {/* ── Background Architectural Detail ── */}
        <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315]/20 to-transparent" />

        <div className="p-6 md:p-7 relative z-10">
          {/* Mentee info */}
          <div className="flex items-center gap-5 mb-8">
            <div className="relative shrink-0">
              <img
                src={mentee.profileImage}
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(mentee.name || 'U')}&bold=true`;
                }}
                className="w-14 h-14 rounded-none object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10 cursor-pointer"
                onClick={() => navigate(`/dashboard/user/${mentee._id}`)}
                alt={mentee.name}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#e87315] rotate-45" />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-black text-white uppercase tracking-widest hover:text-[#e87315] transition-colors truncate cursor-pointer italic"
                onClick={() => navigate(`/dashboard/user/${mentee._id}`)}
              >
                {mentee.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-3 bg-[#e87315]/40" />
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] truncate">
                  {mentee.college || 'Student'}
                </p>
              </div>
            </div>

            <button
              onClick={handleExpand}
              className={`relative w-10 h-10 flex items-center justify-center transition-all duration-300 border ${expanded
                ? 'bg-[#e87315] border-[#e87315] text-black shadow-[4px_4px_0px_rgba(232,115,21,0.2)]'
                : 'bg-transparent border-white/10 text-white/40 hover:border-[#e87315] hover:text-[#e87315]'
                }`}
            >
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowUpRight size={16} strokeWidth={3} />
              </motion.div>
            </button>
          </div>

          {/* Latest project preview */}
          {mentee.latestProject && (
            <div
              onClick={() => navigate(`/dashboard/project/${mentee.latestProject._id}`)}
              className="relative flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 hover:border-[#e87315]/30 cursor-pointer transition-all duration-500 group/proj mb-6"
            >
              <div className="shrink-0 w-12 h-12 overflow-hidden border border-white/5 bg-[#080808]">
                {mentee.latestProject.images?.[0] ? (
                  <img
                    src={mentee.latestProject.images[0]}
                    className="w-full h-full object-cover group-hover/proj:scale-110 transition-transform duration-700"
                    alt={mentee.latestProject.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#e87315] font-black text-xs opacity-40">
                      {mentee.latestProject.title?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white/80 group-hover/proj:text-[#e87315] uppercase tracking-wider truncate mb-1.5 transition-colors">
                  {mentee.latestProject.title}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 opacity-30">
                    <Eye size={10} className="text-white" />
                    <span className="text-[9px] font-mono text-white">{mentee.latestProject.viewCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-30">
                    <Heart size={10} className="text-white" />
                    <span className="text-[9px] font-mono text-white">{mentee.latestProject.likes?.length || 0}</span>
                  </div>
                  {mentee.latestProject.stage && (
                    <span className="text-[8px] font-black text-[#e87315] uppercase border border-[#e87315]/30 px-1.5">
                      {mentee.latestProject.stage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/dashboard/messages')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/[0.02] border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300"
            >
              <MessageSquare size={12} /> Message
            </button>
            {mentee.latestProject && (
              <button
                onClick={() => navigate(`/dashboard/project/${mentee.latestProject._id}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border border-white/10 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] hover:border-[#e87315] hover:text-[#e87315] transition-all duration-300"
              >
                <Eye size={12} /> View Project
              </button>
            )}
          </div>
        </div>

        {/* Technical Corner Accents */}
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#e87315]" />
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
      </div>

      {/* ── Expanded Section ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/[0.05] overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex gap-2 px-6 pt-4 pb-4 border-b border-white/[0.03] bg-[#080808]">
              {['stats', 'feedback', 'notes'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-2.5 transition-all duration-300 group overflow-hidden ${isActive
                      ? 'text-white'
                      : 'text-white/20 hover:text-white/60'
                      }`}
                  >
                    {/* ── Label ── */}
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] italic">
                      {tab}
                    </span>

                    {/* ── Active Background & Underline ── */}
                    {isActive ? (
                      <>
                        {/* Subtle glow background */}
                        <div className="absolute inset-0 bg-[#e87315]/[0.03] animate-pulse" />
                        {/* Bottom active bar */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e87315]" />
                        {/* Top accent dot */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e87315] rotate-45" />
                      </>
                    ) : (
                      /* Hover underline ghost */
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/10 group-hover:w-full transition-all duration-500" />
                    )}

                    {/* ── Architectural Corner (Active) ── */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#e87315]/50" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="px-6 pb-6 pt-2 relative z-10">
              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {statsLoading ? (
                    <div className="h-32 bg-white/[0.01] border border-white/5 animate-pulse" />
                  ) : (
                    <>
                      {/* Main Grid Metrics */}
                      <div className="grid grid-cols-3 gap-0 border border-white/5 bg-[#0a0a0a]">
                        {[
                          { label: 'Projects', value: projects.length },
                          { label: 'Views', value: totalViews.toLocaleString() },
                          { label: 'Likes', value: totalLikes }
                        ].map((stat, idx) => (
                          <div
                            key={stat.label}
                            className={`p-4 text-center ${idx !== 2 ? 'border-r border-white/5' : ''} group/stat`}
                          >
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 group-hover/stat:text-[#e87315] transition-colors">
                              {stat.label}
                            </p>
                            <p className="text-xl font-light text-white tabular-nums tracking-tighter">
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Registration Identity */}
                      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-l-2 border-[#e87315]">
                        <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black italic">Joined</span>
                        <span className="text-[10px] text-white font-mono tracking-tighter">
                          {new Date(mentee.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </span>
                      </div>

                      {/* Projects List: Engineering-style list */}
                      {projects.length > 0 && (
                        <div className="space-y-2 border-t border-white/5 pt-4">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-3">Project_Log</p>
                          {projects.map(p => (
                            <div
                              key={p._id}
                              onClick={() => navigate(`/dashboard/project/${p._id}`)}
                              className="flex items-center justify-between p-3 bg-transparent hover:bg-white/[0.03] border border-white/5 hover:border-[#e87315]/30 transition-all duration-300 cursor-pointer group/p"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-1 h-1 bg-[#e87315] group-hover:scale-150 transition-transform" />
                                <p className="text-[11px] font-bold text-white/60 group-hover/p:text-white truncate uppercase tracking-tight">
                                  {p.title}
                                </p>
                              </div>
                              <span className="text-[8px] font-black text-[#e87315] uppercase tracking-tighter px-1.5 border border-[#e87315]/20 ml-2 shrink-0">
                                {p.stage}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="space-y-5">
                  {!mentee.latestProject ? (
                    <div className="py-10 border border-dashed border-white/5 flex flex-col items-center">
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-widest italic">No projects to give feedback on</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <p className="text-[9px] text-white/30 uppercase tracking-widest font-black">
                          Feedback on: <span className="text-[#e87315] italic">{mentee.latestProject.title}</span>
                        </p>
                      </div>

                      <div className="relative">
                        <textarea
                          value={feedbackInput}
                          onChange={e => setFeedbackInput(e.target.value)}
                          placeholder="Share your expertise and guidance..."
                          rows={4}
                          className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 focus:border-[#e87315]/40 text-white text-[13px] leading-relaxed focus:outline-none transition-all resize-none placeholder:text-white/10"
                        />
                        <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/10" />
                      </div>

                      {feedbackSent && (
                        <div className="flex items-center gap-2 text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-400 rotate-45" />
                          <p className="text-[10px] font-black uppercase tracking-widest">✓ Feedback sent successfully!</p>
                        </div>
                      )}

                      <button
                        onClick={handleFeedback}
                        disabled={feedbackSubmitting || !feedbackInput.trim()}
                        className="w-full py-4 bg-white text-black hover:bg-[#e87315] hover:text-white disabled:opacity-10 font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300"
                      >
                        {feedbackSubmitting ? 'Sending_Data...' : 'Send Feedback'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {/* Input Module */}
                  <div className="flex gap-0 border border-white/5">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddNote(); }}
                      placeholder="Add a private note..."
                      className="flex-1 px-4 py-3 bg-[#0a0a0a] text-white text-[12px] focus:outline-none placeholder:text-white/10"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={noteSubmitting || !noteInput.trim()}
                      className="px-6 bg-white text-black hover:bg-[#e87315] hover:text-white disabled:opacity-20 font-black text-[10px] uppercase transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Notes Sequence */}
                  <div className="space-y-4">
                    {notesLoading ? (
                      <div className="h-16 bg-white/[0.01] border border-white/5 animate-pulse" />
                    ) : notes.length > 0 ? (
                      notes.map(note => (
                        <div key={note._id} className="group/note relative border-l border-white/5 pl-5 py-1 hover:border-[#e87315] transition-colors duration-500">
                          {editingNote === note._id ? (
                            <div className="space-y-3 pt-2">
                              <input
                                type="text"
                                value={editNoteInput}
                                onChange={e => setEditNoteInput(e.target.value)}
                                className="w-full px-3 py-2 bg-white/[0.02] border border-[#e87315]/40 text-white text-xs focus:outline-none"
                              />
                              <div className="flex gap-4">
                                <button onClick={() => handleEditNote(note._id)} className="text-[9px] font-black text-[#e87315] uppercase tracking-widest hover:underline">Save</button>
                                <button onClick={() => { setEditingNote(null); setEditNoteInput(''); }} className="text-[9px] font-black text-white/30 uppercase tracking-widest">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-[12px] text-white/60 leading-relaxed font-medium">{note.content}</p>
                                <p className="text-[8px] font-mono text-white/20 mt-2 uppercase">
                                  TS // {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                              <div className="flex gap-3 opacity-0 group-hover/note:opacity-100 transition-all duration-300">
                                <button
                                  onClick={() => { setEditingNote(note._id); setEditNoteInput(note.content); }}
                                  className="text-white/40 hover:text-[#e87315]"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note._id)}
                                  className="text-white/40 hover:text-red-500"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center opacity-20">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em]">No notes established</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-28 text-center"
  >
    <div className="w-16 h-16 bg-[#e87315]/[0.07] border border-[#e87315]/[0.12] rounded-3xl flex items-center justify-center mx-auto mb-5">
      <Icon size={26} className="text-[#e87315]" />
    </div>
    <h3 className="text-lg font-black text-white mb-1">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </motion.div>
);



// ─── Main Component ───────────────────────────────────────────────────────────
const MentorshipHub = () => {
  const [mainTab, setMainTab] = useState('inquiries');
  const [statusTab, setStatusTab] = useState('pending');
  const [search, setSearch] = useState('');

  // Inquiries state
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  // Mentees state
  const [mentees, setMentees] = useState([]);
  const [menteesLoading, setMenteesLoading] = useState(true);

  const { user } = useAuth();

  // ── Fetch inquiries (all three statuses in parallel) ──
  useEffect(() => {
    const load = async () => {
      setInquiriesLoading(true);
      try {
        const [pendingRes, acceptedRes, declinedRes] = await Promise.all([
          connectionAPI.getReceived(),
          connectionAPI.getAll({ status: 'accepted', type: 'mentor-request' }),
          connectionAPI.getAll({ status: 'rejected', type: 'mentor-request' }),
        ]);
        setPending(pendingRes.data);

        // Filter only connections where mentor is the receiver
        const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
        setAccepted(acceptedRes.data.filter(c =>
          c.to?._id === user?._id || c.to === user?._id
        ));
        setDeclined(declinedRes.data.filter(c =>
          c.to?._id === user?._id || c.to === user?._id
        ));
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      } finally {
        setInquiriesLoading(false);
      }
    };
    load();
  }, []);

  // ── Fetch mentees (lazy — only when tab is first visited) ──
  useEffect(() => {
    if (mainTab !== 'mentees' || mentees.length > 0) return;
    const load = async () => {
      setMenteesLoading(true);
      try {
        const networkRes = await connectionAPI.getNetwork();
        const students = networkRes.data.filter(u => u.role === 'Student');
        const withProjects = await Promise.all(
          students.map(async (s) => {
            try {
              const res = await userAPI.getUserProjects(s._id);
              return { ...s, latestProject: res.data[0] || null };
            } catch {
              return { ...s, latestProject: null };
            }
          })
        );
        setMentees(withProjects);
      } catch (err) {
        console.error('Failed to fetch mentees:', err);
      } finally {
        setMenteesLoading(false);
      }
    };
    load();
  }, [mainTab]);

  // ── Accept / Decline ──
  const handleAction = useCallback(async (id, status) => {
    try {
      await connectionAPI.updateStatus(id, status);

      const card = pending.find(i => i._id === id);

      setPending(prev => prev.filter(i => i._id !== id));

      if (status === 'accepted') {
        setAccepted(prev => [card, ...prev]);
      } else if (status === 'rejected') {
        setDeclined(prev => [card, ...prev]);
      }

    } catch (err) {
      console.error('Failed to update connection:', err);
    }
  }, [pending]);

  // ── Search filter ──
  const filterList = (list) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(item => {
      const name = (item.from?.name || item.name || '').toLowerCase();
      const college = (item.from?.college || item.college || '').toLowerCase();
      return name.includes(q) || college.includes(q);
    });
  };

  const currentInquiries = filterList(
    { pending, accepted, declined }[statusTab] || []
  );
  const currentMentees = filterList(mentees);

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-16">

      {/* ── Header ── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/[0.03]">
        <div className="relative">
          {/* Decorative background element */}
          <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e87315] to-transparent opacity-50" />

          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#e87315]/20 blur-xl group-hover:blur-2xl transition-all duration-700" />
              <div className="relative w-14 h-14 bg-[#080808] border border-white/10 flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-500">
                <Layers size={22} className="text-[#e87315] -rotate-45 group-hover:-rotate-90 transition-transform duration-500" strokeWidth={2} />
              </div>
            </div>


          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-[ -0.04em] uppercase leading-none">
            Mentorship Hub
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full border border-[#e87315]/40 bg-[#080808]" />
              ))}
            </div>
            <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest">
              {mainTab === 'inquiries' ? (
                <>System Status: <span className="text-white">{pending.length}</span> pending {pending.length === 1 ? 'request' : 'requests'} awaiting review</>
              ) : (
                <>Network: <span className="text-white">{mentees.length}</span> active {mentees.length === 1 ? 'mentee' : 'mentees'}</>
              )}
            </p>
          </div>
        </div>

        {/* Search + Filter - Brutalist/Technical Style */}
        <div className="flex items-center gap-0 w-full lg:w-auto shadow-2xl">
          <div className="relative flex-1 lg:w-72 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={14} className="text-[#e87315] opacity-50 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input
              type="text"
              placeholder={mainTab === 'inquiries' ? 'Search inquiries…' : 'Search mentees…'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/5 border-r-0 focus:border-[#e87315]/40 pl-11 pr-4 py-4 text-[11px] font-black uppercase tracking-widest text-white outline-none transition-all placeholder:text-white/10"
            />
          </div>

          <button className="h-[52px] px-5 bg-[#0a0a0a] border border-white/5 hover:bg-[#e87315] hover:text-black text-[#e87315] transition-all duration-300 group">
            <Filter size={16} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* <div className="h-[52px] w-[52px] bg-[#e87315] flex items-center justify-center border border-[#e87315]">
            <div className="w-2 h-2 bg-black animate-pulse" />
          </div> */}
        </div>
      </header>

      {/* ── Main Tabs ── */}
      <div className="flex items-center gap-1 border-b border-white/[0.03] bg-[#080808] p-1">
        {MAIN_TABS.map((tab) => {
          const isActive = mainTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setMainTab(tab);
                setSearch('');
                setStatusTab('pending');
              }}
              className={`group relative flex items-center gap-3 px-8 py-4 transition-all duration-500 ${isActive
                ? 'text-white'
                : 'text-white/20 hover:text-white/50'
                }`}
            >
              {/* --- Background Highlight --- */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#e87315]/[0.08] to-transparent" />
              )}

              {/* --- Label --- */}
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] italic">
                {tab === 'inquiries' ? 'Inquiries' : 'My Mentees'}
              </span>

              {/* --- Counter Badges --- */}
              {tab === 'inquiries' && pending.length > 0 && (
                <div className="relative flex items-center justify-center">
                  <span className="absolute inset-0 bg-[#e87315] blur-[6px] opacity-40 animate-pulse" />
                  <span className="relative bg-[#e87315] text-black px-2 py-0.5 text-[9px] font-black min-w-[20px] rounded-sm">
                    {pending.length}
                  </span>
                </div>
              )}

              {tab === 'mentees' && mentees.length > 0 && (
                <span className={`px-2 py-0.5 text-[9px] font-black border transition-colors ${isActive
                  ? 'border-[#e87315]/40 text-[#e87315]'
                  : 'border-white/10 text-white/20 group-hover:border-white/20'
                  }`}>
                  {mentees.length}
                </span>
              )}

              {/* --- Active Indicator (Architectural) --- */}
              {isActive && (
                <>
                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e87315] shadow-[0_0_15px_rgba(232,115,21,0.5)]" />
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#e87315]" />
                  <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-[#e87315]" />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">

        {/* Inquiries Tab */}
        {mainTab === 'inquiries' && (
          <motion.div
            key="inquiries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Status sub-tabs */}
            <div className="flex items-center gap-3 p-1 bg-[#0a0a0a] border border-white/5 w-fit">
              {STATUS_TABS.map((tab) => {
                const s = STATUS_STYLE[tab];
                const isActive = statusTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setStatusTab(tab)}
                    className={`relative px-6 py-2 transition-all duration-300 group ${isActive
                        ? `text-white`
                        : 'text-white/20 hover:text-white/50'
                      }`}
                  >
                    {/* --- Label --- */}
                    <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.25em]">
                      {tab}
                      {tab === 'pending' && pending.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center bg-[#e87315] text-black px-1.5 py-0.5 text-[8px] font-black leading-none min-w-[18px]">
                          {pending.length}
                        </span>
                      )}
                    </span>

                    {/* --- Active Background State --- */}
                    {isActive ? (
                      <>
                        {/* Solid accent background derived from status colors */}
                        <div className={`absolute inset-0 opacity-10 ${s.bg}`} />
                        {/* Top indicator line */}
                        <div className={`absolute top-0 left-0 w-full h-[1px] ${s.bg}`} />
                        {/* Subtle glow effect */}
                        <div className={`absolute inset-0 blur-md opacity-20 ${s.bg}`} />
                      </>
                    ) : (
                      /* Hover state indicator */
                      <div className="absolute inset-0 bg-white/[0.02] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    )}

                    {/* --- Corner Geometry --- */}
                    <div className={`absolute bottom-0 right-0 w-1 h-1 border-b border-r transition-colors ${isActive ? 'border-[#e87315]' : 'border-white/5'
                      }`} />
                  </button>
                );
              })}
            </div>

            {/* Inquiry cards */}
            <div className="space-y-4">
              {inquiriesLoading
                ? [1, 2, 3].map(i => <Skeleton key={i} className="h-36" />)
                : (
                  <AnimatePresence>
                    {currentInquiries.length > 0
                      ? currentInquiries.map(inq => (
                        <InquiryCard
                          key={inq._id}
                          inquiry={inq}
                          onAction={handleAction}
                          isPending={statusTab === 'pending'}
                        />
                      ))
                      : <EmptyState
                        icon={MessageSquare}
                        title={`No ${statusTab} inquiries`}
                        subtitle={
                          statusTab === 'pending'
                            ? 'New mentorship requests will appear here'
                            : 'Accepted mentorship requests will appear here'
                        }
                      />
                    }
                  </AnimatePresence>
                )
              }
            </div>
          </motion.div>
        )}

        {/* My Mentees Tab */}
        {mainTab === 'mentees' && (
          <motion.div
            key="mentees"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {menteesLoading
              ? [1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)
              : currentMentees.length > 0
                ? currentMentees.map((m, i) => (
                  <MenteeCard key={m._id} mentee={m} index={i} />
                ))
                : <EmptyState
                  icon={Users}
                  title="No active mentees yet"
                  subtitle="Accept an inquiry to start mentoring"
                />
            }
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default MentorshipHub;