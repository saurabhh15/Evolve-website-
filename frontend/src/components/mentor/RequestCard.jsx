import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowUpRight, GraduationCap } from 'lucide-react';

const RequestCard = ({ name, project, tags = [], university = "Global University", onAccept, onDecline }) => {
  return (
    <motion.div
      // Ensure layout changes are animated
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative bg-[#151515] border border-white/5 p-5 rounded-3xl backdrop-blur-sm transition-all hover:border-[#f5a623]/30 hover:shadow-[0_0_30px_rgba(245,166,35,0.08)]"
    >
      {/* Student Identity */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-black font-black text-xl border border-white/10 shadow-lg">
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold group-hover:text-[#f5a623] transition-colors leading-tight">
              {name}
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-medium uppercase tracking-wider mt-1">
              <GraduationCap size={12} />
              {university}
            </div>
          </div>
        </div>
        <button className="text-gray-600 hover:text-white transition-colors">
          <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Project Pitch */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-1">Project Pitch</p>
        <p className="text-sm text-gray-300 font-medium italic">"{project}"</p>
      </div>

      {/* Dynamic Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-500 font-bold uppercase tracking-tight"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ✨ New Feature: Action Buttons with dismissal logic handling animations in the parent dashboard list */}
      <div className="flex gap-2.5 mt-auto">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onAccept} // Handle Acceptance dismissal
          className="flex-1 py-3 bg-gradient-to-r from-[#f5a623] to-[#e87315] text-black rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#f5a623]/10"
        >
          <Check size={14} /> Accept Inquiry
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onDecline} // Handle Decline dismissal
          className="px-4 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-gray-600 hover:text-red-400 rounded-xl text-xs font-bold transition-all"
        >
          <X size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RequestCard;