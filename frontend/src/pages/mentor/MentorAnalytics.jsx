import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Star, Award, Zap, MessageSquare } from 'lucide-react';

const MentorAnalytics = () => {

  // Custom CSS Chart Data
  const monthlyActivity = [
    { month: 'May', hours: 12 }, { month: 'Jun', hours: 18 },
    { month: 'Jul', hours: 15 }, { month: 'Aug', hours: 24 },
    { month: 'Sep', hours: 32 }, { month: 'Oct', hours: 28 },
  ];
  const maxHours = Math.max(...monthlyActivity.map(d => d.hours));

  const skillDemand = [
    { skill: 'React / Frontend', demand: 95 },
    { skill: 'Go-to-Market Strategy', demand: 82 },
    { skill: 'Pitch Deck Review', demand: 76 },
    { skill: 'System Architecture', demand: 64 },
    { skill: 'Fundraising', demand: 45 },
  ];

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-12">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-evolve-in">
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0c0c0c] rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
               <BarChart3 size={24} className="text-[#e87315]/80" strokeWidth={2} />
             </div>
             <p className="text-[#e87315]/80 text-[11px] sm:text-[12px] font-black tracking-[0.3em] uppercase">Performance</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white/90 tracking-tighter">
            Impact Analytics
          </h1>
          <p className="text-white/60 mt-3 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
            Track your contribution to the ecosystem and see how your expertise is shaping startups.
          </p>
        </div>
        
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#e87315]/5 border border-[#e87315]/30 rounded-2xl flex items-center gap-4">
          <Award size={32} className="text-[#e87315]" />
          <div>
            <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-widest">Mentor Tier</p>
            <p className="text-lg sm:text-xl font-black text-white/90 leading-none mt-1.5">Diamond Level</p>
          </div>
        </div>
      </header>

      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 animate-evolve-in" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Total Startups Helped', value: '34', trend: '+4 this month' },
          { label: 'Mentorship Hours', value: '186', trend: 'Top 5% overall' },
          { label: 'Average Rating', value: '4.9', trend: 'Based on 42 reviews' },
          { label: 'Acceptance Rate', value: '88%', trend: 'Highly responsive' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-7 rounded-[2rem] hover:border-[#e87315]/40 transition-all duration-300">
            <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-widest mb-3.5 sm:mb-4">{stat.label}</p>
            <h3 className="text-4xl sm:text-5xl font-light text-white/90 tracking-tighter mb-2.5">{stat.value}</h3>
            <p className="text-[11px] sm:text-[12px] font-bold text-[#e87315]/80 uppercase tracking-widest">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Custom Bar Chart: Monthly Activity */}
        <div className="card-structured p-6 sm:p-8 animate-evolve-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-8 sm:mb-10">
            <div>
              <h3 className="text-[16px] sm:text-lg font-black text-white/90 uppercase tracking-tight">Mentorship Volume</h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest mt-1.5">Hours per month</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-md border border-emerald-500/20 uppercase tracking-widest">
              <TrendingUp size={14} className="sm:w-4 sm:h-4" /> +15% Trend
            </div>
          </div>

          <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-4">
            {monthlyActivity.map((data, i) => {
              const heightPercent = (data.hours / maxHours) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative flex justify-center items-end h-full bg-white/[0.05] rounded-t-xl overflow-hidden border-b border-white/20">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-[#e87315]/50 to-[#e87315] rounded-t-md relative group-hover:opacity-80 transition-opacity"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] sm:text-[11px] font-black text-white transition-opacity">
                        {data.hours}h
                      </span>
                    </motion.div>
                  </div>
                  <span className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] font-black text-white/40 uppercase tracking-widest">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal Bar Chart: Skill Demand */}
        <div className="card-structured p-6 sm:p-8 animate-evolve-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h3 className="text-[16px] sm:text-lg font-black text-white/90 uppercase tracking-tight">Your Skill Demand</h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest mt-1.5">What mentees request most</p>
            </div>
            <Zap size={20} className="text-white/40" />
          </div>

          <div className="space-y-5 sm:space-y-6">
            {skillDemand.map((skill, index) => (
              <div key={index} className="space-y-2 sm:space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[12px] sm:text-[13px] font-bold text-white/80 uppercase tracking-tight">{skill.skill}</span>
                  <span className="text-[11px] sm:text-[12px] font-mono text-white/50 tracking-tighter">{skill.demand}%</span>
                </div>
                <div className="h-2.5 w-full bg-white/[0.05] border border-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.demand}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#e87315] to-[#f97316] rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Testimonials */}
      <div className="card-structured p-6 sm:p-8 animate-evolve-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <MessageSquare size={20} className="text-[#e87315] sm:w-6 sm:h-6" />
          <h3 className="text-[16px] sm:text-lg font-black text-white/90 uppercase tracking-tight">Recent Mentee Feedback</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {[
            { text: "Alex completely shifted our perspective on monetization. We rewrote our entire pitch deck after one 45-minute call.", author: "EcoSphere Founders" },
            { text: "Brilliant technical advice. Pointed out a massive flaw in our React architecture that saved us weeks of refactoring.", author: "DevSync Lead" },
            { text: "Honest, direct, and incredibly helpful. The exact kind of mentorship first-time founders need.", author: "HealthSync Pro" }
          ].map((review, i) => (
            <div key={i} className="bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 transition-colors duration-300 p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1.5 text-[#e87315] mb-4 sm:mb-5">
                  <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                  <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                  <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                  <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                  <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
                </div>
                <p className="text-[12px] sm:text-[13px] text-white/80 leading-relaxed italic mb-5 sm:mb-6">"{review.text}"</p>
              </div>
              <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-widest">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MentorAnalytics;