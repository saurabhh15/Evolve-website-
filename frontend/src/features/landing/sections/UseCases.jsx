import React, { useRef, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, useScroll, useTransform, useSpring, easeOut } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const UseCases = ({ scrollY }) => {
    const containerRef = useRef(null);
    const dotRef = useRef(null);
    const [dotSpecs, setDotSpecs] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const [relativeProgress, setRelativeProgress] = useState(0);

    const CONTROL_PANEL = {
        targetXOffset: 0,
        targetYOffset: 0,
        scrollSensitivity: 600,
    };

    const stackVariants = {
        enter: {
            x: '100%',     
            opacity: 0,
            scale: 0.9,    
            rotate: 0,    
            zIndex: 0
        },
        center: {
            x: 0,          
            opacity: 1,
            scale: 1,
            rotate: 0,
            zIndex: 10,
            transition: {
                type: "spring",
                stiffness: 160,
                damping: 25
            }
        },
        exit: {
            x: -20,        
            y: 10,         
            opacity: 0.9,  
            scale: 0,
            rotate: 0,    
            zIndex: 5,
            transition: { duration: 0.4, easeOut }
        }
    };

    useEffect(() => {
        const updatePosition = () => {
            if (!containerRef.current || !dotRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const startTracking = windowHeight * 0.8;
            const progress = Math.min(Math.max((startTracking - rect.top) / CONTROL_PANEL.scrollSensitivity, 0), 1);
            setRelativeProgress(progress);

            // Dynamically grab exact dimensions and position for a flawless handoff
            const dotRect = dotRef.current.getBoundingClientRect();
            setDotSpecs({
                x: dotRect.left + (dotRect.width / 2),
                y: dotRect.top + (dotRect.height / 2),
                w: dotRect.width,
                h: dotRect.height
            });
        };

        window.addEventListener('scroll', updatePosition, { passive: true });
        window.addEventListener('resize', updatePosition);
        updatePosition();
        
        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [CONTROL_PANEL.scrollSensitivity]);

    const cards = [
        { id: 1, title: "Students", lottie: "/Student.json", text: "Launch your career, find teammates, and build real-world projects." },
        { id: 2, title: "Mentors", lottie: "/Mentors.json", text: "Guide the next generation and share your industry expertise." },
        { id: 3, title: "Investors", lottie: "/Investor.json", text: "Get early access to high-potential student-led startups." }
    ];

    const getActiveCardIndex = () => {
        if (relativeProgress < 0.99) return -1;

        const rect = containerRef.current.getBoundingClientRect();
        const sectionHeight = containerRef.current.offsetHeight - window.innerHeight;

        const totalScroll = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
        const cardProgress = (totalScroll - 0.15) / 0.85;

        if (cardProgress < 0) return -1;
        if (cardProgress < 0.33) return 0;
        if (cardProgress < 0.66) return 1;
        return 2;
    };

    const activeIndex = getActiveCardIndex();

    return (
        <section
            ref={containerRef}
            className="relative w-full"
            style={{ height: '400vh', backgroundColor: '#fffaf5' }}
        >
            {/* THE TRAVELING DROP - Disappears exactly at 0.99 when it perfectly covers the 'i' dot */}
            {relativeProgress > 0 && relativeProgress < 0.99 && (
                <div
                    className="fixed rounded-full z-[100] pointer-events-none"
                    style={{
                        backgroundColor: '#c14747',
                        width: `${dotSpecs.w}px`,
                        height: `${dotSpecs.h}px`,
                        left: 0,
                        top: 0,
                        transform: `translate3d(
                            ${(window.innerWidth / 2) + (dotSpecs.x - (window.innerWidth / 2)) * relativeProgress - (dotSpecs.w / 2)}px, 
                            ${dotSpecs.y * relativeProgress - (dotSpecs.h / 2)}px, 
                            0
                        )`,
                    }}
                />
            )}

            <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-start overflow-hidden py-10 md:py-0">
                <div className="max-w-[1600px] px-6 md:px-12 lg:px-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center transform translate-y-1 mx-auto">

                    <div className="mb-4 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start">
                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#1e0a42] tracking-tighter leading-tight">
                            Who <span className="relative inline-block">
                                <span className="relative z-10">is</span>
                                {/* THE STATIC TARGET DOT - Starts as text color, turns red at 0.99 */}
                                <span
                                    ref={dotRef}
                                    className="absolute rounded-full"
                                    style={{
                                        width: '0.20em',
                                        height: '0.21em',
                                        top: '0.25em',
                                        left: '0.05em', 
                                        backgroundColor: relativeProgress >= 0.99 ? '#c14747' : '#1e0a42',
                                        transition: 'background-color 0.1s ease',
                                        opacity: 1, // Always visible to act as the default 'i' dot
                                        pointerEvents: 'none',
                                        zIndex: 20
                                    }}
                                />
                            </span><br className="hidden md:block" /> it for?
                        </h1>
                    </div>

                    <div className="relative h-[420px] sm:h-[480px] md:h-[550px] w-full flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                            {cards.map((card, index) => (
                                index === activeIndex && (
                                    <motion.div
                                        key={card.id}
                                        variants={stackVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute w-full max-w-[340px] sm:max-w-[420px] md:max-w-[550px] pointer-events-none group"
                                    >
                                        <div className="bg-white border-[3px] md:border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-[400px] sm:h-[460px] md:h-[540px] transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none flex flex-col">

                                            <div className="w-full h-[180px] sm:h-[240px] md:h-[320px] bg-orange-500 flex items-center justify-center p-4 sm:p-6 md:p-8 relative border-b-[3px] md:border-b-4 border-black shrink-0">
                                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-dotted.png')]"></div>

                                                {card.lottie && (
                                                    <div className="relative z-10 w-full h-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 md:p-4 flex items-center justify-center">
                                                        <DotLottieReact src={card.lottie} loop autoplay className="max-w-full max-h-full" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 sm:p-7 md:p-9 flex-1 flex flex-col justify-center">
                                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-2 md:mb-4 leading-none">
                                                    {card.title}
                                                </h3>

                                                {card.accentWord && (
                                                    <span className="font-serif italic text-orange-500 text-xl sm:text-2xl md:text-3xl font-medium block -mt-1 md:-mt-2 mb-1 md:mb-2">{card.accentWord}.</span>
                                                )}

                                                <p className="text-zinc-700 text-xs sm:text-sm md:text-[15px] leading-snug md:leading-relaxed font-bold uppercase tracking-wide">
                                                    {card.text}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default UseCases;