import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, MapPin, CalendarDays, Zap, ArrowRight, ChevronLeft, CalendarOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EventPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        
        <div className="bg-[#fffaf5] min-h-screen text-black relative px-4 sm:px-6 md:px-12 pt-28 md:pt-36 pb-16 md:pb-24">
            
            <div className="max-w-6xl mx-auto w-full">
                {/* BACK BUTTON - Now aligned with the grid and pushed below navbar */}
                {user && (
                    <div className="mb-6 md:mb-8">
                        <button
                            onClick={() => navigate(`/dashboard`)}
                            className="pointer-events-auto flex items-center gap-2 text-[14px] md:text-[16px] font-bold tracking-widest uppercase text-black/60 hover:text-[#e87315] transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* HEADER SECTION */}
                <div className="mb-10 md:mb-16 border-b-4 border-black pb-6 md:pb-8">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter">
                        Upcoming <span className="text-orange-500 italic">Events.</span>
                    </h1>
                </div>

                {/* EVENT LISTING */}
                {/* ── No Events / Coming Soon Section ── */}
                <div className="relative group overflow-hidden bg-[#080808] border border-white/[0.03] min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 text-center transition-all duration-500 hover:border-[#e87315]/20 w-full">

                    {/* Animated Radar/Pulse Effect */}
                    <div className="relative mb-6 md:mb-8">
                        <div className="absolute inset-0 bg-[#e87315]/20 rounded-full animate-ping scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-16 h-16 md:w-20 md:h-20 border border-white/10 flex items-center justify-center rotate-45 group-hover:border-[#e87315]/40 transition-colors duration-500">
                            <CalendarOff
                                size={28}
                                className="text-white/10 -rotate-45 group-hover:text-[#e87315] transition-colors duration-500 md:w-8 md:h-8"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 max-w-md px-4">
                        <h3 className="text-[12px] md:text-[14px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-white mb-4 italic">
                            No Upcoming Events yet
                        </h3>

                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-6">
                            <div className="h-px w-6 md:w-8 bg-[#e87315]/30" />
                            <p className="text-[9px] md:text-[11px] font-bold text-[#e87315] uppercase tracking-[0.1em] md:tracking-[0.2em]">
                                Status: Monitoring for Updates
                            </p>
                            <div className="h-px w-6 md:w-8 bg-[#e87315]/30" />
                        </div>

                        <p className="text-xs md:text-sm text-white/40 leading-relaxed font-medium italic mb-8">
                            No upcoming events at this time. Sessions, workshops, and meetups will be listed here as they are scheduled. Stay tuned.
                        </p>

                        {/* Coming Soon Badge */}
                        <div className="inline-flex items-center gap-3 px-5 md:px-6 py-2 bg-white/[0.02] border border-white/5 rounded-full group-hover:border-[#e87315]/20 transition-all">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e87315] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e87315]"></span>
                            </span>
                            <span className="text-[9px] md:text-[10px] font-black text-white/60 uppercase tracking-widest">
                                Events Coming Soon
                            </span>
                        </div>
                    </div>

                    {/* Architect Signatures */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#e87315]" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-[#e87315] transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-[#e87315] transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#e87315]" />

                    {/* Scanning Line Effect */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e87315]/10 to-transparent translate-y-[-100%] group-hover:translate-y-[400px] transition-transform duration-[3s] ease-linear" />
                </div>
            </div>

            {/* LOWER SECTION - Only for unauthenticated users */}
            {!user && (
                <div className="mt-20 md:mt-32 border-t-4 border-black pt-12 md:pt-20">
                    
                    {/* The "More to Come" Marquee */}
                    <div className="overflow-hidden whitespace-nowrap mb-12 py-3 md:py-4 bg-zinc-50 border-y-2 border-black rotate-[-1deg] w-full relative left-0 right-0">
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                            className="flex gap-10 md:gap-20 text-zinc-400 font-black uppercase text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em]"
                        >
                            <span>More Events Dropping Soon • </span>
                            <span>More Events Dropping Soon • </span>
                            <span>More Events Dropping Soon • </span>
                            <span>More Events Dropping Soon • </span>
                            <span>More Events Dropping Soon • </span>
                        </motion.div>
                    </div>

                    {/* The Final Statement */}
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12 mt-16 md:mt-20">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 md:mb-6">
                                Don't Just <br className="hidden sm:block" />
                                <span className="text-orange-500 italic">Watch.</span> Build.
                            </h2>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs leading-relaxed">
                                Your academic project is a startup waiting to happen. <br className="hidden sm:block" />
                                Stop attending, start evolving.
                            </p>
                        </div>

                        {/* The Persistent "Join Now" Link */}
                        <Link
                            to="/get-started"
                            className="bg-orange-500 text-black px-8 py-4 md:px-12 md:py-6 font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-3 md:gap-4 text-lg md:text-2xl border-4 border-black group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none w-full sm:w-auto justify-center"
                        >
                            Join Evolve Now
                            <Zap
                                fill="currentColor"
                                size={24}
                                className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 w-5 h-5 md:w-6 md:h-6"
                            />
                        </Link>
                    </div>

                </div>
            )}
        </div>
    );
};

export default EventPage;