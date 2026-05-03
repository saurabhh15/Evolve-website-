import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowUpRight, GraduationCap } from 'lucide-react';

const RequestCard = ({ name, project, tags = [], university = "Global University", onAccept, onDecline }) => {
  return (
    <motion.div
      // Ensure layout changes are animated
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative bg-[#151515] border border-white/5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl backdrop-blur-sm transition-all hover:border-[#f5a623]/30 hover:shadow-[0_0_30px_rgba(245,166,35,0.08)] flex flex-col h-full"
    >
      {/* Student Identity */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-black font-black text-lg sm:text-xl border border-white/10 shadow-lg shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm sm:text-base group-hover:text-[#f5a623] transition-colors leading-tight truncate">
              {name}
            </h4>
            <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-gray-600 font-medium uppercase tracking-wider mt-0.5 sm:mt-1 truncate">
              <GraduationCap size={10} className="sm:w-3 sm:h-3 shrink-0" />
              <span className="truncate">{university}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-600 hover:text-white transition-colors shrink-0">
          <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>

      {/* Project Pitch */}
      <div className="mb-3 sm:mb-4">
        <p className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-widest font-bold mb-1">Project Pitch</p>
        <p className="text-xs sm:text-sm text-gray-300 font-medium italic line-clamp-2">"{project}"</p>
      </div>

      {/* Dynamic Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/5 border border-white/10 rounded-md text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-tight"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ✨ New Feature: Action Buttons with dismissal logic handling animations in the parent dashboard list */}
      <div className="flex gap-2 sm:gap-2.5 mt-auto">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onAccept} // Handle Acceptance dismissal
          className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-[#f5a623] to-[#e87315] text-black rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#f5a623]/10"
        >
          <Check size={12} className="sm:w-3.5 sm:h-3.5" /> Accept
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onDecline} // Handle Decline dismissal
          className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-gray-600 hover:text-red-400 rounded-lg sm:rounded-xl transition-all"
        >
          <X size={12} className="sm:w-3.5 sm:h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RequestCard;