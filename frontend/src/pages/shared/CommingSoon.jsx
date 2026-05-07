import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ComingSoon = () => {
    return (
        <div className="h-144 bg-[#0c0c0c] text-white font-sans flex flex-col items-center justify-center px-6 overflow-hidden selection:bg-[#e87315] selection:text-black relative">

            {/* 1. BACKGROUND TEXTURE (SUBTLE) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Animated floating orbs */}
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e87315]/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#e87315]/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/10 blur-[80px] rounded-full"
                />

                {/* Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />

                {/* Stardust */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            </div>

            <main className="relative z-10 max-w-xl text-center ">
                <section className="space-y-4">
                    <p className="text-[15px] sm:text-[16px] font-black text-white/80 uppercase tracking-widest leading-relaxed">
                        Coming Soon <br />
                    </p>
                </section>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative inline-block mt-4"
                >
                    {/* Prismatic Glow Placeholder */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#e87315]/20 via-blue-500/20 to-purple-500/20 blur-2xl opacity-40 animate-pulse" />

                    <h1 className="text-[12vw] lg:text-[7rem] font-black italic tracking-tighter leading-none uppercase mix-blend-difference">
                        EVOLVE<span className="text-[#e87315]">.</span>
                    </h1>

                    <div className="mt-5 flex justify-center gap-6 text-[11px] sm:text-[12px] font-black tracking-[0.5em] text-white/50 uppercase italic">
                        <span>Version_v2.0</span>
                    </div>
                </motion.div>
            </main>
            
            <style jsx>{`
                h1 {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.15);
                }
            `}</style>
        </div>
    );
};

export default ComingSoon;