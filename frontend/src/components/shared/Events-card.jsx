import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Zap } from 'lucide-react';

const Eventscard = () => {
    return (
        <div className="group relative">
            {/* ── Main Container ── */}
            <div className="relative overflow-hidden bg-[#080808] border border-white/[0.03] p-8 transition-all duration-500 hover:border-[#e87315]/30">
                
                {/* Background Tech Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e87315]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="items-start gap-5">
                        {/* Icon Box */}
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 bg-white/[0.02] border border-white/5 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
                                <Calendar size={24} className="text-[#e87315] -rotate-3 group-hover:-rotate-12 transition-transform" />
                            </div>
                            <Zap size={18} className="absolute -bottom-1 -right-1 text-[#e87315] animate-pulse" />
                        </div>

                        {/* Text Content */}
                        <div className="mt-7 space-y-1">
                            <h2 className="text-[15px] font-black tracking-[0.4em] uppercase text-white italic group-hover:text-[#e87315] transition-colors">
                                Events Section
                            </h2>
                            <p className="text-[15px] font-medium text-white/40 uppercase tracking-widest italic">
                                Checkout new events and workshops here
                            </p>
                        </div>
                    </div>

                    {/* Action Link */}
                    <Link
                        to="/dashboard/events"
                        className="relative inline-flex items-center gap-4 group/btn mt-4"
                    >
                        <span className="text-[15px] font-black uppercase tracking-[0.3em] text-white/60 group-hover/btn:text-white transition-colors">
                            View All Events
                        </span>
                        
                        <div className="relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:border-[#e87315] group-hover/btn:bg-[#e87315] transition-all duration-300">
                            <ArrowRight 
                                size={16} 
                                className="text-white group-hover/btn:text-black transition-colors" 
                            />
                        </div>
                    </Link>
                </div>

                {/* ── Technical Decor ── */}
                
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10 group-hover:border-[#e87315] transition-colors" />
                
                {/* Micro Label */}
                <div className="absolute top-45 -right-7 -rotate-36 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                    <span className="text-[50px] font-black italic tracking-tighter uppercase select-none">
                       Events
                    </span>
                </div>

                {/* Animated Bottom Bar */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#e87315] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
            </div>
        </div>
    );
};

export default Eventscard;