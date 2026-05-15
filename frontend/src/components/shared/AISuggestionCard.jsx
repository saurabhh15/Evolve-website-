import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase, Zap, Sparkles, CheckCircle2, Send, ArrowRight, GraduationCap } from "lucide-react";
import { projectAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISuggestionCard({ suggestion, type, projectId }) {
  const { user, matchScore, reason, isSameCollege } = suggestion;
  const navigate = useNavigate(); // <-- Initialized navigate
  
  // State to handle the invite button loading/success
  const [inviteStatus, setInviteStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  if (!user) return null;

  const handleInvite = async () => {
    if (inviteStatus !== 'idle') return;
    
    setInviteStatus('loading');
    try {
      if (type === 'teammate' && projectId) {
        await projectAPI.inviteTeammate(projectId, user._id);
        setInviteStatus('success');
      }
    } catch (err) {
      console.error("Invite failed:", err);
      setInviteStatus('error');
      setTimeout(() => setInviteStatus('idle'), 3000);
    }
  };

  // Progress bar color based on score
  const barColor =
    matchScore >= 80
      ? '#10b981' // Emerald for high match
      : matchScore >= 60
      ? '#e87315' // Orange for medium match
      : '#6b7280'; // Gray for lower match

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative group/card w-full"
    >
      {/* AI Badge - Floating Top Right */}
      <div className="absolute -top-2 -right-2 z-20">
        <div className="relative">
          <div className="absolute inset-0 bg-[#e87315] blur-lg opacity-40 animate-pulse" />
          <div className="relative bg-[#e87315] border border-[#e87315] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_0_20px_rgba(232,115,21,0.3)]">
            <Sparkles size={11} className="text-black animate-pulse" />
            <span className="text-[9px] font-black text-black uppercase tracking-[0.25em]">
              AI Match
            </span>
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="relative bg-[#0c0c0c] border border-white/[0.1] hover:border-[#e87315]/50 transition-all duration-500 overflow-hidden flex flex-col h-full">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        
        {/* Hover Background Glow Effect */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#e87315]/10 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Ghost score watermark (subtle background number) */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none font-black text-[120px] leading-none tabular-nums transition-opacity duration-500 opacity-5 group-hover/card:opacity-10"
          style={{
            color: matchScore >= 80 ? '#10b981' : '#e87315',
          }}
        >
          {matchScore}
        </div>

        <div className="relative p-6 flex flex-col h-full z-10">
          
          {/* Header Section: Avatar & Info */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-5 flex-1 min-w-0">
              
              {/* Profile Image (Grayscale default -> Color on hover) */}
              <div className="relative flex-shrink-0 group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#e87315]/30 to-transparent opacity-0 group-hover/avatar:opacity-100 blur-md transition-opacity duration-500" />
                <div className="relative">
                  <img
                    onClick={() => navigate(`/dashboard/user/${user._id}`)} // <-- Added onClick routing here
                    src={
                      user.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                    }
                    alt={user.name}
                    className="relative w-20 h-20 object-cover border-2 border-white/10 grayscale opacity-80 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:border-[#e87315] transition-all duration-500 cursor-pointer" // <-- Added cursor-pointer
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?background=0a0a0a&color=e87315&size=200&name=${user.name}&bold=true`;
                    }}
                  />
                  {/* Corner Accents that appear on hover */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#e87315] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#e87315] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* User Identity Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  onClick={() => navigate(`/dashboard/user/${user._id}`)} // <-- Added onClick routing here
                  className="text-lg font-black text-white/90 uppercase tracking-tight group-hover/card:text-white transition-colors duration-300 truncate mb-1.5 cursor-pointer hover:underline underline-offset-4" // <-- Added cursor-pointer & hover effects
                >
                  {user.name}
                </h3>
                
                {/* College Info & Local Match Badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.25em] truncate">
                    {user.college || user.company || 'Student'}
                  </p>
                  {isSameCollege && (
                    <div className="flex items-center gap-1.5 shrink-0 bg-green-500/10 px-2 py-0.5 border border-green-500/30">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Local Match</span>
                    </div>
                  )}
                </div>

                {user.role && (
                  <div className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-bold text-white/50 uppercase tracking-widest group-hover/card:bg-[#e87315]/10 group-hover/card:border-[#e87315]/30 group-hover/card:text-[#e87315] transition-all">
                    {user.role}
                  </div>
                )}
              </div>
            </div>

            {/* Match Score Badge (Top Right) */}
            <div className="flex-shrink-0 ml-4 flex flex-col items-end justify-start">
              <div className="text-right">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">
                  Match
                </p>
                <div
                  className={`text-4xl font-black leading-none tabular-nums transition-colors duration-300 ${
                    matchScore >= 80 ? 'text-emerald-500' : matchScore >= 60 ? 'text-[#e87315]' : 'text-white/60'
                  }`}
                >
                  {matchScore}<span className="text-xl opacity-50">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Reason Section (Highly Visible Box) */}
          <div className="relative bg-white/[0.03] border border-white/10 group-hover/card:border-[#e87315]/30 group-hover/card:bg-[#e87315]/[0.02] p-4 sm:p-5 mb-6 flex-grow transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
              <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
              <p className="text-[10px] font-black text-[#e87315] uppercase tracking-[0.3em] flex items-center gap-1.5">
                AI Reasoning
              </p>
            </div>

            {/* Reason Text */}
            <p className="text-[12px] sm:text-[13px] text-white/80 font-medium leading-relaxed italic border-l-2 border-[#e87315]/40 pl-3">
              "{reason}"
            </p>
          </div>

          {/* Skills Section */}
          {user.skills && user.skills.length > 0 && (
            <div className="mb-8">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3">Verified Skills</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.slice(0, 5).map((skill, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-white/[0.04] border border-white/10 group-hover/card:border-white/20 transition-all"
                  >
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider group-hover/card:text-white">
                      {skill}
                    </span>
                  </div>
                ))}
                {user.skills.length > 5 && (
                  <div className="px-3 py-1.5 bg-[#e87315]/10 border border-[#e87315]/30">
                    <span className="text-[10px] font-black text-[#e87315] uppercase tracking-wider">
                      +{user.skills.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Action Section: Progress Bar & Button */}
          <div className="mt-auto pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Progress Bar (Visual Match Strength) */}
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Alignment</span>
              </div>
              <div className="w-full h-[4px] bg-white/10 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${matchScore}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-0 left-0 h-full"
                  style={{ background: barColor }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleInvite}
              disabled={inviteStatus !== 'idle'}
              className={`relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 border text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-300 overflow-hidden group/btn ${
                inviteStatus === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default' 
                  : inviteStatus === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 cursor-default'
                  : 'bg-white/5 border-[#e87315]/50 text-[#e87315] hover:bg-[#e87315] hover:text-black active:scale-[0.98]'
              }`}
            >
              {/* Shimmer Effect for Idle State */}
              {inviteStatus === 'idle' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              )}

              {/* Button Content */}
              <AnimatePresence mode="wait">
                {inviteStatus === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-1.5"
                  >
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i} 
                        className="w-1.5 h-4 bg-current animate-bounce" 
                        style={{ animationDelay: `${i * 0.15}s` }} 
                      />
                    ))}
                  </motion.div>
                ) : inviteStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} className="animate-pulse" />
                    <span>Invite Sent</span>
                  </motion.div>
                ) : inviteStatus === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Error - Retry
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 relative z-10"
                  >
                    <Send size={14} className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    <span>Connect</span>
                    <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300 absolute -right-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}