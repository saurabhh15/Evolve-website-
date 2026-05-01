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
          <div className="flex items-center gap-3 mb-3">
             <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-lg">
               <Users size={20} className="text-[#e87315]" strokeWidth={2.5} />
             </div>
             <p className="text-[#e87315] text-xs font-black tracking-[0.2em] uppercase">Inbound Pipeline</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Mentorship Inquiries
          </h1>
          <p className="text-gray-400 mt-2 font-medium max-w-xl">
            Review and manage requests from builders looking for your expertise.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search startups..." 
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#101010] border border-white/[0.04] focus:border-[#e87315]/50 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none transition-all"
            />
          </div>
          <button className="p-3 bg-[#101010] border border-white/[0.04] hover:bg-[#161616] rounded-xl text-gray-400 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Custom Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4 animate-evolve-in" style={{ animationDelay: '0.1s' }}>
        {['pending', 'accepted', 'declined'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-[#e87315]/10 text-[#e87315] border border-[#e87315]/20' 
                : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {tab} {tab === 'pending' && <span className="ml-2 bg-[#e87315] text-[#080808] px-2 py-0.5 rounded-md">{inquiries.length}</span>}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-6">
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
                className="bg-[#101010] border border-white/[0.04] hover:border-[#e87315]/30 p-6 md:p-8 rounded-[2rem] transition-colors duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* Left Column: Identity */}
                  <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/[0.04] pb-6 lg:pb-0 lg:pr-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-black text-2xl border border-white/10 shadow-lg">
                        {req.startup.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 bg-[#161616] px-3 py-1.5 rounded-lg border border-white/[0.04]">
                        <Clock size={12} /> {req.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-[#e87315] transition-colors">{req.startup}</h3>
                    <p className="text-gray-400 font-medium mb-4">Led by <span className="text-white font-bold">{req.founder}</span></p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <GraduationCap size={14} className="text-[#e87315]" /> {req.university}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <MapPin size={14} className="text-[#e87315]" /> {req.location}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: The Pitch */}
                  <div className="lg:w-2/3 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-black text-[#e87315] uppercase tracking-widest mb-3">Project Pitch</p>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                        "{req.pitch}"
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {req.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activeTab === 'pending' && (
                      <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                        <button 
                          onClick={() => handleAction(req.id, 'accepted')}
                          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#e87315] hover:bg-[#f97316] text-[#080808] rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(232,115,21,0.2)] active:scale-95"
                        >
                          <Check size={16} strokeWidth={3} /> Accept Project
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'declined')}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#161616] hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/[0.04] hover:border-red-500/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          <X size={16} strokeWidth={3} /> Decline
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
              className="card-structured text-center py-32"
            >
              <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-gray-600" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">No {activeTab} inquiries</h3>
              <p className="text-gray-500">You're all caught up on your mentorship requests.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default MentorInquiries;