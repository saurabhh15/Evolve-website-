import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Zap,
} from 'lucide-react';

const WaitNoMoreCard = () => {
    const containerRef = useRef(null);

    // Track scroll progress of this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax transforms
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.95]);

    return (
        <div ref={containerRef} className='overflow-hidden bg-black justify-center items-center'>
            {/* --- JOIN THE EVOLUTION CTA --- */}
            <motion.div
                style={{
                    y,
                    opacity,
                    scale
                }}
                className="mt-40 relative group"
            >
                {/* The "Shadow" Box for Neobrutalist effect */}
                <div className="absolute inset-0 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />

                <div className="bg-black text-white p-12 md:p-10 border-4 border-black text-center relative overflow-hidden">

                    {/* Subtle Background Watermark inside the box */}

                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 relative z-10">
                        What are you <br />
                        <span className="relative inline-block">
                            <span className="text-orange-500">Waiting</span> for?
                        </span>
                    </h2>

                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-12 max-w-lg mx-auto relative z-10">
                        Stop letting your ideas collect dust in a GitHub repo. Join the next cohort of student founders.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10 mb-15">
                        <Link
                            to="/get-started"
                            className="bg-white text-black px-12 py-5 font-black uppercase tracking-widest hover:bg-orange-200 transition-colors flex items-center gap-4 text-xl rounded-3xl border-2 border-black inline-flex group"
                        >
                            Join Evolve Now
                            {/* <Zap
                                fill="currentColor"
                                size={20}
                                className="group-hover:scale-125 transition-transform duration-300"
                            /> */}
                        </Link>
                    </div>
                </div>
            </motion.div>
            <div className="relative left-0 w-full h-20 overflow-hidden whitespace-nowrap border-t-4 border-black group">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 55,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    style={{
                        y: "39%"
                    }}
                    className="flex gap-12 text-black font-black uppercase text-6xl md:text-[170px] tracking-tighter select-none cursor-default absolute bottom-0"
                >
                    {/* Duplicate content for seamless loop */}
                    {[...Array(2)].map((_, setIndex) => (
                        [...Array(5)].map((_, i) => (
                            <span
                                key={`${setIndex}-${i}`}
                                className="transition-all duration-600 transform inline-block"
                                style={{
                                    WebkitTextStroke: "1px grey",
                                    color: "transparent",
                                    fontFamily: "sans-serif",
                                   transition: "color 0.3s ease"
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "#f97316")}
                                onMouseLeave={(e) => (e.target.style.color = "transparent")}
                            >
                                BUILD • LAUNCH • EVOLVE
                            </span>
                        ))
                    ))}
                </motion.div>
            </div>
        </div>
    )
};

export default WaitNoMoreCard;