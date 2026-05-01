import React, { useRef, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, useScroll, useTransform, useSpring, easeOut } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';


const UseCases = ({ scrollY }) => {
    const containerRef = useRef(null);
    const dotRef = useRef(null);
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
    const [relativeProgress, setRelativeProgress] = useState(0);

    const CONTROL_PANEL = {
        targetXOffset: 0,
        targetYOffset: 0,
        scrollSensitivity: 600,
    };

    const stackVariants = {
        enter: {
            x: '100%',     // Start off-screen right
            opacity: 0,
            scale: 0.9,    // Slightly smaller
            rotate: 0,    // Tilted right
            zIndex: 0
        },
        center: {
            x: 0,          // Perfectly centered
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
            x: -20,        // Slide slightly left
            y: 10,         // Drop down slightly
            opacity: 0.9,  // Fade to look like background
            scale: 0,
            rotate: 0,    // Tilt left
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

            const dotRect = dotRef.current.getBoundingClientRect();
            setTargetPos({
                x: dotRect.left + (dotRect.width / 2),
                y: dotRect.top + (dotRect.height / 2)
            });
        };

        window.addEventListener('scroll', updatePosition);
        updatePosition();
        return () => window.removeEventListener('scroll', updatePosition);
    }, [CONTROL_PANEL.scrollSensitivity]);


    const cards = [
        { id: 1, title: "Students", lottie: "/Student.json", text: "Launch your career, find teammates, and build real-world projects." },
        { id: 2, title: "Mentors", lottie: "/Mentors.json", text: "Guide the next generation and share your industry expertise." },
        { id: 3, title: "Investors", lottie: "/Investor.json", text: "Get early access to high-potential student-led startups." }
    ];

    // Card visibility logic
    const getActiveCardIndex = () => {
        // 1. Wait until the dot has fully landed
        if (relativeProgress < 0.99) return -1;

        const rect = containerRef.current.getBoundingClientRect();
        const sectionHeight = containerRef.current.offsetHeight - window.innerHeight;

        // 2. This is the total progress of the 400vh/500vh section
        const totalScroll = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);

        // 3. BUFFER: We subtract 0.15 so cards don't appear immediately.
        // The cards now animate within the remaining 85% of the scroll.
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


            {/* THE TRAVELING DROP - REMAINING EXACTLY THE SAME */}
            {relativeProgress > 0 && relativeProgress < 0.99 && (
                <div
                    className="fixed w-6 h-6 bg-[#c14747] rounded-full z-[100] pointer-events-none"
                    style={{
                        left: '-15px',
                        top: '-10px',
                        transform: `translate3d(
                            ${(window.innerWidth / 2) + (targetPos.x - (window.innerWidth / 2)) * relativeProgress}px, 
                            ${targetPos.y * relativeProgress}px, 
                            0
                        )`,
                    }}
                />
            )}

            <div className="sticky top-0 h-screen w-full flex items-center justify-start overflow-hidden">
                {/* GRID CONTAINER - Split into 2 columns */}
                <div className="max-w-[1600px] px-6 md:px-18 w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center transform translate-y-1 bg-amber-100 ">

                    {/* LEFT COLUMN: TEXT (YOUR ORIGINAL CODE) */}
                    <div className="mb-16 md:mb-0">
                        <h1 className="text-6xl md:text-9xl font-black text-[#1e0a42] tracking-tighter leading-tight text-left">
                            Who <span className="relative inline-block">
                                is
                                <span
                                    ref={dotRef}
                                    className="absolute rounded-full bg-[#c14747]"
                                    style={{
                                        width: '0.20em',
                                        height: '0.21em',
                                        top: '0.25em',
                                        left: '6px',
                                        opacity: relativeProgress >= 0.98 ? 1 : 0,
                                        pointerEvents: 'none'
                                    }}
                                />
                            </span> it for?
                        </h1>
                    </div>

                    {/* RIGHT COLUMN: MODERN SWAPPING CARDS */}

                    <div className="relative h-[550px] w-full flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                            {cards.map((card, index) => (
                                index === activeIndex && (
                                    <motion.div
                                        key={card.id}
                                        variants={stackVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        /* 1. Added group here so we can animate children on hover */
                                        className="absolute w-full max-w-[550px] pointer-events-none group"
                                    >

                                        {/* --- NEOBRUTALIST PREMIUM CARD DESIGN --- */}
                                        {/* 2. Added sharp shadow, black border, white bg, and square edges (removed rounded) */}
                                        <div className="bg-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-[540px] transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none">

                                            {/* Lottie Animation Container */}
                                            {/* 3. Replaced soft gradient with solid Orange. Made container perfectly square edges. */}
                                            <div className="w-full h-[320px] bg-orange-500 flex items-center justify-center p-8 relative border-b-4 border-black">
                                                {/* Subtle background texture for the industrial look */}
                                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-dotted.png')]"></div>

                                                {/* 4. Made the Lottie container sharp-edged with a thin border */}
                                                {card.lottie && (
                                                    <div className="relative z-10 w-full h-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                                                        <DotLottieReact src={card.lottie} loop autoplay />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Section */}
                                            {/* 5. Fixed typography: Heavy black font, tight tracking, standard body weight. */}
                                            <div className="p-9 mt-2">
                                                <h3 className="text-4xl font-black uppercase tracking-tighter text-black mb-4 leading-none">
                                                    {card.title}
                                                </h3>

                                                {/* Added the 'sweet' serif detail on a key word if present (requires optional data in card object) */}
                                                {card.accentWord && (
                                                    <span className="font-serif italic text-orange-500 text-3xl font-medium block -mt-2 mb-2">{card.accentWord}.</span>
                                                )}

                                                <p className="text-zinc-700 text-[15px] leading-relaxed font-bold uppercase tracking-wide">
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