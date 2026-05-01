import React, { useRef, useState, useEffect } from 'react';

const ScrollCard = ({ num, title, text }) => (
    <div className="flex-shrink-0 w-[300px] md:w-[420px] h-[480px] relative group">
        {/* 1. Heavy Hard Shadow - uses black to contrast against the deep red */}
        <div className="absolute inset-0 bg-black translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />

        {/* 2. Main Card Body */}
        <div className="relative h-full bg-white border-4 border-black p-8 md:p-10 flex flex-col justify-between overflow-hidden">

            {/* Animated Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 border-b-4 border-l-4 border-black translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />

            <div>
                {/* 3. Phase Badge - Stronger Contrast */}
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-black font-black text-sm tracking-[0.3em] uppercase bg-orange-500 px-3 py-1 border-2 border-black">
                        Phase {num}
                    </span>
                </div>

                {/* 4. Title - Black on White for maximum readability */}
                <h3 className="text-black text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                    {title}
                </h3>
            </div>

            {/* 5. Text - Clean, Bold, Institutional Style */}
            <div className="border-t-4 border-black pt-8">
                <p className="text-zinc-800 text-lg font-bold uppercase tracking-tight leading-snug">
                    {text}
                </p>

                {/* Decorative 'Sweet' Serif detail */}
                <span className="font-serif italic text-orange-500 text-2xl mt-4 block">
                    Evolve
                </span>
            </div>
        </div>
    </div>
);

const Progress = ({ scrollY }) => {
    const containerRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const [isExiting, setIsExiting] = useState(0);

    const cardData = [
        { num: '01', title: 'Create Your Project', text: 'Showcase your idea with details, pitch decks, and demos to make it stand out.' },
        { num: '02', title: 'Get Discovered', text: 'Your project gets visibility among mentors, investors, and potential co-founders.' },
        { num: '03', title: 'Connect & Collaborate', text: 'Find the right mentors, teammates, and industry experts to refine your idea.' },
        { num: '04', title: 'Build & Improve', text: 'Receive feedback, track progress, and use resources to turn your idea into a product.' },
        { num: '05', title: 'Get Funding & Launch', text: 'Pitch to investors, secure funding, and take your project to the real world.' }
    ];

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let progress = 0;
        if (containerRect.top < windowHeight) {
            const totalScrollDistance = container.offsetHeight - windowHeight;
            progress = Math.min(Math.max(-containerRect.top / totalScrollDistance, 0), 1);
        }
        setPercentage(progress);

        // --- NEW EXIT LOGIC ---
        // Trigger shrink AFTER the 5th card is settled (0.88 to 1.0)
        if (progress > 0.88) {
            const exitFact = (progress - 0.88) / 0.12;
            setIsExiting(Math.min(exitFact, 1));
        } else {
            setIsExiting(0);
        }

        const moveStart = 0.5;
        const moveEnd = 0.85;
        let moveProgress = 0;
        if (progress > moveStart) {
            moveProgress = Math.min((progress - moveStart) / (moveEnd - moveStart), 1);
        }

        if (cardsContainerRef.current) {
            const track = cardsContainerRef.current;
            const maxMove = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.2);
            track.style.transform = `translate3d(${-moveProgress * maxMove}px, 0, 0)`;
        }
    }, [scrollY]);

    // --- UPDATED CLIP PATH LOGIC ---
    const morphProgress = Math.min(percentage * 5, 1);
    const vDepth = 25 * (1 - morphProgress);
    const vWidthL = 50 * (1 - morphProgress);
    const vWidthR = 50 + (50 * morphProgress);

    let clipPathValue;
    if (isExiting <= 0) {
        clipPathValue = `polygon(${vWidthL}% ${vDepth}%, ${vWidthR}% ${vDepth}%, 100% 100%, 0% 100%)`;
    } else {
        // PHASE 1: Sides Pinch to Middle (0 to 0.6 of exit)
        const sideSqueeze = Math.min(isExiting / 0.6, 1) * 49.5; // 49.5% leaves a tiny sliver in middle

        // PHASE 2: Travel from Center to Bottom (0.6 to 1.0 of exit)
        const verticalMove = isExiting > 0.6 ? (isExiting - 0.6) / 0.4 : 0;
        const topInset = verticalMove * 100;
        const bottomInset = 0; // Keeping it anchored to bottom or you can add (verticalMove * 10) to shrink it

        clipPathValue = `inset(${topInset}% ${sideSqueeze}% ${bottomInset}% ${sideSqueeze}% round 100px)`;
    }

    const currentRadius = 100 * (1 - Math.pow(Math.min(percentage * 28.33, 1), 2));
    const textY = (1 - Math.min(percentage * 3.3, 1)) * 100;
    const cardParallaxProgress = Math.min(Math.max((percentage - 0.1) * 2.8, 0), 1);
    const cardY = (1 - cardParallaxProgress) * 150;

    return (
        <div style={{ backgroundColor: '#fffaf5' }} className="w-full overflow-visible">
            <div
                ref={containerRef}
                className="relative w-full"
                style={{ height: '750vh', zIndex: 50, marginTop: '-120px' }}
            >
                <div
                    className="sticky top-0 w-full h-screen overflow-hidden bg-[#841d04ec] flex flex-col items-center justify-center"
                    style={{
                        clipPath: clipPathValue,
                        WebkitClipPath: clipPathValue,
                        borderTopLeftRadius: isExiting > 0 ? 0 : `${currentRadius}px`,
                        borderTopRightRadius: isExiting > 0 ? 0 : `${currentRadius}px`,

                        // bg-[#c14747]
                    }}
                >
                    <div
                        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
                        style={{
                            opacity: 1 - (isExiting * 2),
                            transform: `translate3d(0, ${isExiting * -50}px, 0)`
                        }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(249,115,22,0.15),transparent_50%)]" />
                        <div
                            className="text-center w-full mb-4 px-6"
                            style={{
                                transform: `translate3d(0, ${textY}px, 0)`,
                                opacity: Math.min(percentage * 4, 1),
                            }}
                        >
                            <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mt-9.5">
                                The <span className="text-yellow-400">Journey</span>
                            </h2>
                        </div>

                        <div
                            className="relative w-full overflow-visible"
                            style={{
                                transform: `translate3d(0, ${cardY}px, 0)`,
                                opacity: cardParallaxProgress,
                                filter: `blur(${(1 - cardParallaxProgress) * 10}px)`
                            }}
                        >
                            <div
                                ref={cardsContainerRef}
                                className="flex items-stretch gap-10 md:gap-20 px-[70vw] will-change-transform"
                            >
                                {cardData.map((card) => (
                                    <ScrollCard key={card.num} {...card} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;