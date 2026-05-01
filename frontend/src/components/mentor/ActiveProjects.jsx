import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, AlertCircle, CheckCircle2, PlayCircle, FolderKanban } from 'lucide-react';

const ActiveProjects = () => {
  const projects = [
    { id: 1, title: "EcoSphere AI", student: "Aravind Kumar", progress: 82, status: "Active", lastUpdate: "2h ago", color: "from-[#e87315] to-[#f97316]" },
    { id: 2, title: "FinFlow Ledger", student: "Sneha Kapoor", progress: 35, status: "Stuck", lastUpdate: "1d ago", color: "from-red-500 to-rose-600" },
    { id: 3, title: "HealthSync Pro", student: "Rohan Mehta", progress: 95, status: "Review", lastUpdate: "15m ago", color: "from-emerald-500 to-teal-500" }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Stuck': return { icon: <AlertCircle size={12} />, bg: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'Review': return { icon: <CheckCircle2 size={12} />, bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
      default: return { icon: <PlayCircle size={12} />, bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    }
  };

  return (
    <div className="card-structured p-6 md:p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-inner">
            <FolderKanban size={20} className="text-[#e87315]" strokeWidth={2}/>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Active Ventures</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Projects under guidance</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative">
        {projects.map((project, i) => {
          const { icon, bg } = getStatusStyle(project.status);
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-[#121212] border border-white/[0.03] hover:bg-[#161616] hover:border-[#e87315]/30 hover:shadow-[0_8px_30px_rgba(232,115,21,0.08)] transition-all duration-400 cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1 mb-4 md:mb-0">
                <div className="relative">
                    {project.status === 'Active' && (
                        <div className="absolute inset-0 bg-[#e87315]/20 blur-md rounded-xl animate-ping opacity-70" />
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white font-black text-lg relative z-10 shadow-lg border border-white/10`}>
                      {project.title.charAt(0)}
                    </div>
                </div>
                
                <div>
                  <h4 className="text-white font-bold text-base group-hover:text-[#e87315] transition-colors leading-tight">
                    {project.title}
                  </h4>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    Lead: <span className="text-gray-300">{project.student}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 w-full md:w-auto">
                <div className="w-32 md:w-40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Health</span>
                    <span className="text-[11px] font-bold text-white">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${project.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${bg}`}>
                    {icon} {project.status}
                  </span>
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{project.lastUpdate}</span>
                </div>

                <button className="hidden md:flex p-2.5 bg-[#0a0a0a] rounded-xl border border-white/[0.04] group-hover:bg-[#e87315] group-hover:border-[#e87315] transition-all text-gray-500 group-hover:text-[#080808]">
                  <ChevronRight size={16} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveProjects;