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
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0c0c0c] rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
               <Calendar size={24} className="text-[#e87315]/80" strokeWidth={2} />
             </div>
             <p className="text-[#e87315]/80 text-[11px] sm:text-[12px] font-black tracking-[0.3em] uppercase">Calendar</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white/90 tracking-tighter">
            Your Sessions
          </h1>
          <p className="text-white/60 mt-3 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
            You have <span className="text-white/90 font-black">{upcomingSessions.length} upcoming sessions</span> scheduled this week.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#0c0c0c] border border-white/20 hover:border-[#e87315]/50 text-white/90 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300">
          Sync Calendar <ArrowRight size={16} className="text-[#e87315]" />
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left: Schedule Feed */}
        <div className="xl:col-span-8 space-y-5 sm:space-y-6">
          {upcomingSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group bg-[#0c0c0c] border rounded-[2rem] p-6 sm:p-8 transition-all duration-300 overflow-hidden ${
                session.isStartingSoon ? 'border-[#e87315]/50 shadow-[0_0_30px_rgba(232,115,21,0.15)]' : 'border-white/10 hover:border-[#e87315]/40'
              }`}
            >
              {session.isStartingSoon && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#e87315] to-[#f97316] animate-pulse" />
              )}

              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-[11px] font-black text-[#e87315] uppercase tracking-widest bg-[#e87315]/10 px-3 py-1.5 rounded-md border border-[#e87315]/20">
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-widest">
                      <Clock size={14} className="sm:w-4 sm:h-4" /> {session.time}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white/90 group-hover:text-[#e87315] transition-colors tracking-tight">{session.team}</h3>
                  <p className="text-[12px] sm:text-[13px] text-white/60 font-bold tracking-wide mt-1.5">
                    with <span className="text-white/90">{session.mentees}</span> <span className="mx-1.5 opacity-50">•</span> <span className="text-[#e87315]/80">{session.type}</span>
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 sm:gap-4 mt-2 md:mt-0 shrink-0">
                  <button className="p-3 sm:p-3.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/30 rounded-xl text-white/50 hover:text-white transition-all">
                    <MoreHorizontal size={20} />
                  </button>
                  <a 
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
                      session.isStartingSoon 
                        ? 'bg-[#e87315] hover:bg-[#f97316] text-[#080808] shadow-[0_0_20px_rgba(232,115,21,0.2)] animate-pulse hover:animate-none'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-white/90 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Video size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" /> Join Room
                  </a>
                </div>
              </div>

              {/* Agenda Section */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={14} className="text-white/40" />
                  <span className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-widest">Proposed Agenda</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {session.agenda.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[12px] sm:text-[13px] text-white/80 font-medium">
                      <CheckCircle2 size={16} className="text-emerald-500/80 shrink-0 mt-0.5" />
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
          <div className="card-structured p-6 sm:p-8 animate-evolve-in" style={{ animationDelay: '0.2s' }}>
             <h3 className="text-[16px] sm:text-lg font-black text-white/90 mb-6 sm:mb-8 uppercase tracking-tight">Mentorship Rules</h3>
             <div className="space-y-6">
               <div className="flex gap-4">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#e87315]/10 flex items-center justify-center shrink-0 border border-[#e87315]/30">
                   <span className="text-[#e87315] font-black text-[11px] sm:text-xs">01</span>
                 </div>
                 <div>
                   <h4 className="text-[13px] sm:text-[14px] font-black text-white/90 mb-1.5 uppercase tracking-wide">Be Punctual</h4>
                   <p className="text-[11px] sm:text-[12px] text-white/60 leading-relaxed font-medium">Join the meeting link 2 minutes early to ensure technical setup.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#e87315]/10 flex items-center justify-center shrink-0 border border-[#e87315]/30">
                   <span className="text-[#e87315] font-black text-[11px] sm:text-xs">02</span>
                 </div>
                 <div>
                   <h4 className="text-[13px] sm:text-[14px] font-black text-white/90 mb-1.5 uppercase tracking-wide">Actionable Feedback</h4>
                   <p className="text-[11px] sm:text-[12px] text-white/60 leading-relaxed font-medium">Leave the team with 2-3 clear action items at the end of every call.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#e87315]/10 flex items-center justify-center shrink-0 border border-[#e87315]/30">
                   <span className="text-[#e87315] font-black text-[11px] sm:text-xs">03</span>
                 </div>
                 <div>
                   <h4 className="text-[13px] sm:text-[14px] font-black text-white/90 mb-1.5 uppercase tracking-wide">Log Outcomes</h4>
                   <p className="text-[11px] sm:text-[12px] text-white/60 leading-relaxed font-medium">Submit brief session notes on the platform for tracking progress.</p>
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