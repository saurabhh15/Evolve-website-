import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, FileText, MoreHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';

const MentorSessions = () => {
  
  const upcomingSessions = [
    {
      id: 1,
      team: "EcoSphere AI",
      mentees: "Aravind & Team",
      date: "Today, Oct 24",
      time: "2:00 PM - 3:00 PM",
      type: "Architecture Review",
      agenda: ["Database schema scaling", "AWS cost optimization", "Review Seed Deck"],
      isStartingSoon: true,
      link: "https://zoom.us/j/123456789"
    },
    {
      id: 2,
      team: "FinFlow Ledger",
      mentees: "Sneha Kapoor",
      date: "Tomorrow, Oct 25",
      time: "10:00 AM - 10:45 AM",
      type: "Strategy Sync",
      agenda: ["Go-to-market plan", "Pricing model feedback"],
      isStartingSoon: false,
      link: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: 3,
      team: "HealthSync Pro",
      mentees: "Rohan Mehta",
      date: "Friday, Oct 27",
      time: "4:00 PM - 5:00 PM",
      type: "Pitch Practice",
      agenda: ["Live pitch walkthrough", "Q&A handling"],
      isStartingSoon: false,
      link: "https://zoom.us/j/987654321"
    }
  ];

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-12">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-evolve-in">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-lg">
               <Calendar size={20} className="text-[#e87315]" strokeWidth={2.5} />
             </div>
             <p className="text-[#e87315] text-xs font-black tracking-[0.2em] uppercase">Calendar</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Your Sessions
          </h1>
          <p className="text-gray-400 mt-2 font-medium max-w-xl">
            You have <span className="text-white font-bold">{upcomingSessions.length} upcoming sessions</span> scheduled this week.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
          Sync Calendar <ArrowRight size={14} className="text-[#e87315]" />
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left: Schedule Feed */}
        <div className="xl:col-span-8 space-y-6">
          {upcomingSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-[#101010] border rounded-[2rem] p-6 md:p-8 transition-all duration-300 overflow-hidden ${
                session.isStartingSoon ? 'border-[#e87315]/50 shadow-[0_0_30px_rgba(232,115,21,0.1)]' : 'border-white/[0.04] hover:border-[#e87315]/20'
              }`}
            >
              {session.isStartingSoon && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e87315] to-[#f97316] animate-pulse" />
              )}

              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-black text-[#e87315] uppercase tracking-widest bg-[#e87315]/10 px-3 py-1 rounded-md border border-[#e87315]/20">
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <Clock size={12} /> {session.time}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{session.team}</h3>
                  <p className="text-sm text-gray-500 font-medium">with {session.mentees} • <span className="text-gray-300">{session.type}</span></p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-[#161616] hover:bg-white/[0.05] border border-white/[0.04] rounded-xl text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                  <a 
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      session.isStartingSoon 
                        ? 'bg-[#e87315] hover:bg-[#f97316] text-[#080808] shadow-[0_0_20px_rgba(232,115,21,0.3)] animate-pulse hover:animate-none'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.05]'
                    }`}
                  >
                    <Video size={16} strokeWidth={2.5} /> Join Room
                  </a>
                </div>
              </div>

              {/* Agenda Section */}
              <div className="bg-[#161616] border border-white/[0.02] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-gray-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposed Agenda</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {session.agenda.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 font-medium">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Quick Stats / Prep */}
        <div className="xl:col-span-4 space-y-6">
          <div className="card-structured p-8 animate-evolve-in" style={{ animationDelay: '0.2s' }}>
             <h3 className="text-lg font-black text-white mb-6">Mentorship Rules</h3>
             <div className="space-y-5">
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-[#e87315]/10 flex items-center justify-center shrink-0 border border-[#e87315]/20">
                   <span className="text-[#e87315] font-black text-xs">01</span>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-white mb-1">Be Punctual</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">Join the meeting link 2 minutes early to ensure technical setup.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-[#e87315]/10 flex items-center justify-center shrink-0 border border-[#e87315]/20">
                   <span className="text-[#e87315] font-black text-xs">02</span>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-white mb-1">Actionable Feedback</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">Leave the team with 2-3 clear action items at the end of every call.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-[#e87315]/10 flex items-center justify-center shrink-0 border border-[#e87315]/20">
                   <span className="text-[#e87315] font-black text-xs">03</span>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-white mb-1">Log Outcomes</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">Submit brief session notes on the platform for tracking progress.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorSessions;