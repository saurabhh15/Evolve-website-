import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, X, ArrowUpRight, GraduationCap, MapPin, Clock, Search, Filter } from 'lucide-react';

const MentorInquiries = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchTerm] = useState('');
  
  // Robust dummy data
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      startup: "EcoSphere AI",
      founder: "Aravind Kumar",
      university: "Stanford University",
      location: "San Francisco, CA",
      pitch: "We are building an AI-driven marketplace that predicts carbon offset pricing for mid-sized logistics companies. We have our MVP but need help optimizing our recommendation algorithm and preparing our seed pitch deck.",
      tags: ["Machine Learning", "Python", "Pitch Prep"],
      date: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      startup: "FinFlow Ledger",
      founder: "Sneha Kapoor",
      university: "MIT",
      location: "Remote",
      pitch: "A decentralized ledger for cross-border micro-transactions. We are stuck on smart contract security and need an experienced blockchain architect to review our Solidity code before we launch our testnet.",
      tags: ["Web3", "Solidity", "Security"],
      date: "1 day ago",
      status: "pending"
    },
    {
      id: 3,
      startup: "HealthSync Pro",
      founder: "Rohan Mehta",
      university: "Global Tech",
      location: "London, UK",
      pitch: "IoT integration platform for legacy hospital systems. We need go-to-market strategy advice to navigate healthcare compliance and B2B enterprise sales cycles.",
      tags: ["B2B Sales", "Healthcare", "IoT"],
      date: "2 days ago",
      status: "pending"
    }
  ]);

  const handleAction = (id, action) => {
    // action is either 'accepted' or 'declined'
    setInquiries(inquiries.filter(req => req.id !== id));
    // In a real app, you would make an API call here.
  };

  const filteredInquiries = inquiries.filter(req => 
    req.status === activeTab && 
    (req.startup.toLowerCase().includes(searchQuery.toLowerCase()) || 
     req.founder.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-12">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-evolve-in">
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0c0c0c] rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
               <Users size={24} className="text-[#e87315]/80" strokeWidth={2} />
             </div>
             <p className="text-[#e87315]/80 text-[11px] sm:text-[12px] font-black tracking-[0.3em] uppercase">Inbound Pipeline</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white/90 tracking-tighter">
            Mentorship Inquiries
          </h1>
          <p className="text-white/60 mt-3 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
            Review and manage requests from builders looking for your expertise.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search startups..." 
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#e87315]/50 rounded-xl pl-11 pr-4 py-3 text-[12px] sm:text-[13px] text-white/90 outline-none transition-all placeholder:text-white/30 font-medium"
            />
          </div>
          <button className="p-3.5 bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 rounded-xl text-white/50 hover:text-[#e87315] transition-all">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Custom Tab Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-white/10 pb-4 animate-evolve-in" style={{ animationDelay: '0.1s' }}>
        {['pending', 'accepted', 'declined'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-[#e87315]/10 text-[#e87315] border border-[#e87315]/30' 
                : 'bg-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02] border border-transparent'
            }`}
          >
            {tab} {tab === 'pending' && <span className="ml-2.5 bg-[#e87315] text-black px-2 py-0.5 rounded-md text-[9px] sm:text-[10px]">{inquiries.length}</span>}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-5 sm:space-y-6">
        <AnimatePresence>
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((req, index) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 p-6 md:p-8 rounded-[2rem] transition-colors duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  
                  {/* Left Column: Identity */}
                  <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/80 font-black text-2xl sm:text-3xl border border-white/20 shadow-lg group-hover:border-[#e87315]/40 transition-colors">
                        {req.startup.charAt(0)}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5 bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/10">
                        <Clock size={12} className="text-white/40" /> {req.date}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white/90 mb-1.5 group-hover:text-[#e87315] transition-colors truncate">{req.startup}</h3>
                    <p className="text-white/60 text-[12px] sm:text-[13px] font-medium mb-5 sm:mb-6">Led by <span className="text-white/90 font-bold">{req.founder}</span></p>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest">
                        <GraduationCap size={14} className="text-[#e87315]/80" /> {req.university}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest">
                        <MapPin size={14} className="text-[#e87315]/80" /> {req.location}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: The Pitch */}
                  <div className="lg:w-2/3 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-black text-[#e87315]/80 uppercase tracking-widest mb-3">Project Pitch</p>
                      <p className="text-white/80 text-[13px] sm:text-[14px] leading-relaxed mb-6 italic font-medium">
                        "{req.pitch}"
                      </p>
                      <div className="flex flex-wrap gap-2.5 mb-6">
                        {req.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/[0.02] border border-white/10 rounded-lg text-[9px] sm:text-[10px] font-black text-white/60 uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activeTab === 'pending' && (
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-auto">
                        <button 
                          onClick={() => handleAction(req.id, 'accepted')}
                          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#e87315] hover:bg-[#f97316] text-[#080808] rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(232,115,21,0.2)] active:scale-95"
                        >
                          <Check size={16} strokeWidth={3} className="sm:w-5 sm:h-5" /> Accept Project
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'declined')}
                          className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-red-500/10 text-white/50 hover:text-red-500 border border-white/20 hover:border-red-500/40 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          <X size={16} strokeWidth={3} className="sm:w-5 sm:h-5" /> Decline
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="card-structured text-center py-24 sm:py-32 bg-[#0c0c0c] border border-dashed border-white/10"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/[0.02] border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <Users size={28} className="text-white/40 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white/90 mb-2">No {activeTab} inquiries</h3>
              <p className="text-[11px] sm:text-[12px] text-white/50 font-bold uppercase tracking-widest">You're all caught up on your mentorship requests.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default MentorInquiries;