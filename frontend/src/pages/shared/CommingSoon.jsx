import React, { useState } from 'react';
import { motion } from 'framer-motion';
const ComingSoon = () => {

    return (
       <div className="h-144 bg-[#050505] text-white font-sans flex flex-col items-center justify-center px-6 overflow-hidden selection:bg-orange-500 selection:text-black relative">

            {/* 1. BACKGROUND TEXTURE (SUBTLE) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Animated floating orbs */}
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/8 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 blur-[80px] rounded-full"
                />

                {/* Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

                {/* Stardust */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
            </div>

            <main className="relative z-10 max-w-xl text-center ">

                <section className="space-y-4">
                    <p className="text-sm md:text-base font-medium text-white/60 uppercase tracking-widest leading-relaxed">
                        Comming Soon <br />

                    </p>
                </section>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative inline-block"
                >
                    {/* Prismatic Glow Placeholder */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 via-blue-500/20 to-purple-500/20 blur-2xl opacity-30 animate-pulse" />

                    <h1 className="text-[12vw] lg:text-[7rem] font-black italic tracking-tighter leading-none uppercase mix-blend-difference">
                        EVOLVE<span className="text-orange-500">.</span>
                    </h1>

                    <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase italic">
                        <span>Version_v2.0</span>

                    </div>
                </motion.div>
            </main>
            <style jsx>{`
        h1 {
          -webkit-text-stroke: 1px rgba(255,255,255,0.1);
        }
      `}</style>
        </div>
    );
};

export default ComingSoon;