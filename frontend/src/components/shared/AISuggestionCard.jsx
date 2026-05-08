import React from 'react';
import { Star, MapPin, Briefcase, Zap } from "lucide-react";

export default function AISuggestionCard({ suggestion, type }) {
  const { user, matchScore, reason } = suggestion;
  if (!user) return null;

  return (
    <div className="bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 rounded-none p-6 transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315]/60 via-[#e87315]/20 to-transparent" />
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-12 h-12 object-cover border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-white/90 uppercase tracking-tight group-hover:text-[#e87315] transition-colors">{user.name}</h3>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-0.5">{user.college || user.company || 'Freelancer'}</p>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-black uppercase tracking-wider flex-shrink-0 ${matchScore >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : matchScore >= 60 ? 'text-[#e87315] border-[#e87315]/40 bg-[#e87315]/10' : 'text-white/50 border-white/20 bg-white/5'}`}>
          <Zap size={11} />
          {matchScore}%
        </div>
      </div>

      {/* AI Reason */}
      <div className="relative bg-[#080808] border border-[#e87315]/20 p-4 mb-5">
        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]/60" />
        <p className="text-[10px] font-black text-[#e87315] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <Zap size={10} /> AI Match Reason
        </p>
        <p className="text-[11px] text-white/70 font-medium leading-relaxed italic">
          "{reason}"
        </p>
      </div>

      {/* Skills / Expertise */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(type === "mentor" ? user.expertise : user.skills)
          ?.slice(0, 4)
          .map((s) => (
            <span key={s} className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-[9px] font-black text-white/50 uppercase tracking-tighter group-hover:border-white/30 transition-colors">
              {s}
            </span>
          ))}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-white/40 uppercase tracking-widest mb-6 pt-4 border-t border-white/10">
        {user.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={10} /> {user.location}
          </span>
        )}
        {type === "mentor" && user.rating > 0 && (
          <span className="flex items-center gap-1.5 text-white/60">
            <Star size={10} className="text-[#e87315]" />
            {user.rating} SCORE // {user.sessionsHeld} SESSIONS
          </span>
        )}
        {type === "mentor" && user.company && (
          <span className="flex items-center gap-1.5 text-white/60">
            <Briefcase size={10} /> {user.company}
          </span>
        )}
      </div>

      {/* Action Button */}
      <button className="w-full relative flex items-center justify-center gap-3 py-4 bg-white/10 text-white/90 border border-transparent hover:bg-[#e87315] hover:text-black hover:border-black/20 text-[11px] font-black tracking-[0.3em] uppercase italic transition-all duration-300">
        {type === "mentor" ? "Request Mentorship" : "Invite to Team"}
      </button>

      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
    </div>
  );
}