import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';

const ExpertiseChart = () => {
  const skills = [
    { name: 'MERN Stack', demand: 92, trend: '+12%', color: 'from-[#e87315] to-[#f97316]' }, 
    { name: 'UI/UX Design', demand: 78, trend: '+5%', color: 'from-orange-500 to-rose-500' }, 
    { name: 'System Design', demand: 65, trend: '+18%', color: 'from-emerald-500 to-teal-400' },
    { name: 'Business Strategy', demand: 45, trend: '-2%', color: 'from-gray-500 to-gray-400' },
  ];

  return (
    <div className="card-structured p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-inner">
            <BarChart3 size={20} className="text-[#f4f1ea]" strokeWidth={2}/>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Skill Demand</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Ecosystem Needs</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-3 group cursor-default">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
                {parseInt(skill.trend) > 10 && (
                  <span className="flex items-center text-[9px] text-emerald-400 font-black tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <TrendingUp size={10} strokeWidth={3} className="mr-0.5" /> {skill.trend}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#e87315] transition-colors">
                {skill.demand}% Interest
              </span>
            </div>
            
            {/* Background Track */}
            <div className="h-2.5 w-full bg-[#121212] border border-white/[0.03] rounded-full overflow-hidden flex relative">
              
              {/* Animated Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.demand}%` }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative overflow-hidden`}
              >
                 {/* Internal Shimmer */}
                 <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-2/3"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.2, ease: "linear" }}
                 />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3.5 bg-[#121212] hover:bg-[#e87315] border border-white/[0.04] hover:border-[#e87315] rounded-xl text-[10px] font-black text-gray-500 hover:text-[#080808] transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg">
        <Zap size={14} /> Adjust Focus Areas
      </button>
    </div>
  );
};

export default ExpertiseChart;