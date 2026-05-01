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
          <div className="flex items-center gap-3 mb-3">
             <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-lg">
               <BarChart3 size={20} className="text-[#e87315]" strokeWidth={2.5} />
             </div>
             <p className="text-[#e87315] text-xs font-black tracking-[0.2em] uppercase">Performance</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Impact Analytics
          </h1>
          <p className="text-gray-400 mt-2 font-medium max-w-xl">
            Track your contribution to the ecosystem and see how your expertise is shaping startups.
          </p>
        </div>
        
        <div className="px-5 py-3 bg-gradient-to-r from-[#e87315]/20 to-transparent border border-[#e87315]/30 rounded-2xl flex items-center gap-4">
          <Award size={32} className="text-[#e87315]" />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mentor Tier</p>
            <p className="text-lg font-black text-white leading-none mt-1">Diamond Level</p>
          </div>
        </div>
      </header>

      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-evolve-in" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Total Startups Helped', value: '34', trend: '+4 this month' },
          { label: 'Mentorship Hours', value: '186', trend: 'Top 5% overall' },
          { label: 'Average Rating', value: '4.9', trend: 'Based on 42 reviews' },
          { label: 'Acceptance Rate', value: '88%', trend: 'Highly responsive' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#101010] border border-white/[0.04] p-6 rounded-[2rem] hover:border-[#e87315]/30 transition-all duration-300">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{stat.label}</p>
            <h3 className="text-4xl font-black text-white tracking-tight mb-2">{stat.value}</h3>
            <p className="text-xs font-bold text-[#e87315]">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Custom Bar Chart: Monthly Activity */}
        <div className="card-structured p-8 animate-evolve-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-white">Mentorship Volume</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Hours per month</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              <TrendingUp size={12} /> +15% Trend
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
            {monthlyActivity.map((data, i) => {
              const heightPercent = (data.hours / maxHours) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative flex justify-center items-end h-full bg-white/[0.02] rounded-t-xl overflow-hidden border-b border-white/10">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-[#e87315]/50 to-[#e87315] rounded-t-md relative group-hover:opacity-80 transition-opacity"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white transition-opacity">
                        {data.hours}h
                      </span>
                    </motion.div>
                  </div>
                  <span className="mt-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal Bar Chart: Skill Demand */}
        <div className="card-structured p-8 animate-evolve-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-white">Your Skill Demand</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">What mentees request most</p>
            </div>
            <Zap size={20} className="text-gray-600" />
          </div>

          <div className="space-y-6">
            {skillDemand.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">{skill.skill}</span>
                  <span className="font-mono text-xs text-gray-500">{skill.demand}%</span>
                </div>
                <div className="h-2 w-full bg-[#161616] border border-white/[0.04] rounded-full overflow-hidden">
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
      <div className="card-structured p-8 animate-evolve-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={20} className="text-[#e87315]" />
          <h3 className="text-lg font-black text-white">Recent Mentee Feedback</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: "Alex completely shifted our perspective on monetization. We rewrote our entire pitch deck after one 45-minute call.", author: "EcoSphere Founders" },
            { text: "Brilliant technical advice. Pointed out a massive flaw in our React architecture that saved us weeks of refactoring.", author: "DevSync Lead" },
            { text: "Honest, direct, and incredibly helpful. The exact kind of mentorship first-time founders need.", author: "HealthSync Pro" }
          ].map((review, i) => (
            <div key={i} className="bg-[#161616] border border-white/[0.04] p-6 rounded-2xl">
              <div className="flex gap-1 text-[#e87315] mb-4">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic mb-4">"{review.text}"</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MentorAnalytics;