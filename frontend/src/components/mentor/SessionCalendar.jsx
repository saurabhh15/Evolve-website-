import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';

const SessionCalendar = () => {
  const sessions = [
    { id: 1, team: "EcoSphere AI", student: "Aravind", time: "14:00", date: "Today", urgency: "high", type: "Sync" },
    { id: 2, team: "FinFlow", student: "Sneha", time: "16:30", date: "Tomorrow", urgency: "low", type: "Deep Dive" },
    { id: 3, team: "HealthSync", student: "Rohan", time: "09:00", date: "Aug 21", urgency: "low", type: "Review" },
  ];

  return (
    <div className="card-structured p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-inner">
            <CalendarIcon size={20} className="text-[#e87315]" strokeWidth={2.5}/>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Schedule</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">3 upcoming</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session, idx) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex items-center justify-between p-4 bg-[#121212] border border-white/[0.03] rounded-2xl hover:bg-[#161616] hover:border-[#e87315]/30 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
          >
            {/* LED Urgency Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${session.urgency === 'high' ? 'bg-[#e87315] shadow-[0_0_10px_#e87315]' : 'bg-gray-700'}`} />
            
            <div className="flex items-center gap-4 pl-3">
              <div>
                <p className="text-sm font-bold text-white group-hover:text-[#e87315] transition-colors">{session.team}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold tracking-tight">
                  <span className="text-[#e87315] flex items-center gap-1 uppercase bg-[#e87315]/10 px-1.5 py-0.5 rounded border border-[#e87315]/20">
                    <Clock size={10} /> {session.time}
                  </span>
                  <span className="text-gray-500 uppercase">{session.type}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-[#0a0a0a] px-2 py-1 rounded-md border border-white/[0.04]">
                  {session.date}
                </span>
                <button className="p-2 bg-[#161616] text-gray-400 rounded-lg border border-white/[0.04] group-hover:bg-[#e87315] group-hover:text-[#080808] group-hover:border-[#e87315] group-hover:shadow-[0_0_15px_rgba(232,115,21,0.4)] transition-all">
                  <Video size={14} strokeWidth={2.5} />
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SessionCalendar;