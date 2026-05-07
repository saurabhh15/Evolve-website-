import React, { useRef, useState, useEffect } from 'react';

const ScrollCard = ({ num, title, text }) => (
    // Fluid sizing: scales down for mobile, scales up for desktop
    <div className="flex-shrink-0 w-[75vw] max-w-[280px] sm:max-w-none sm:w-[320px] md:w-[400px] h-[360px] sm:h-[420px] md:h-[450px] relative group">
        {/* Shadow layer */}
        <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 md:translate-x-4 md:translate-y-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />

        {/* Card content */}
        <div className="relative h-full bg-white border-[3px] sm:border-4 border-black p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden">
            {/* Top right decoration */}
            <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-orange-500 border-b-[3px] sm:border-b-4 border-l-[3px] sm:border-l-4 border-black translate-x-5 -translate-y-5 sm:translate-x-6 sm:-translate-y-6 md:translate-x-8 md:-translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />

            <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <span className="text-black font-black text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase bg-orange-500 px-2 py-1 sm:px-3 border-2 border-black">
                        Phase {num}
                    </span>
                </div>
                <h3 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.95] sm:leading-[0.9]">
                    {title}
                </h3>
            </div>

            <div className="border-t-[3px] sm:border-t-4 border-black pt-4 sm:pt-6 md:pt-8">
                <p className="text-zinc-800 text-sm sm:text-base md:text-lg font-bold uppercase tracking-tight leading-snug">
                    {text}
                </p>
                <span className="font-serif italic text-orange-500 text-lg sm:text-xl md:text-2xl mt-2 sm:mt-3 md:mt-4 block">
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
            // Mathematically perfect horizontal scroll: 
            // Total scrollable width minus the viewport width.
            const maxMove = track.scrollWidth - window.innerWidth;
            track.style.transform = `translate3d(${-moveProgress * maxMove}px, 0, 0)`;
        }
    }, [scrollY]);

    const morphProgress = Math.min(percentage * 5, 1);
    const vDepth = 25 * (1 - morphProgress);
    const vWidthL = 50 * (1 - morphProgress);
    const vWidthR = 50 + (50 * morphProgress);

    let clipPathValue;
    if (isExiting <= 0) {
        clipPathValue = `polygon(${vWidthL}% ${vDepth}%, ${vWidthR}% ${vDepth}%, 100% 100%, 0% 100%)`;
    } else {
        const sideSqueeze = Math.min(isExiting / 0.6, 1) * 49.5;
        const verticalMove = isExiting > 0.6 ? (isExiting - 0.6) / 0.4 : 0;
        const topInset = verticalMove * 100;
        // Switched to a safer responsive border-radius for the exit animation
        clipPathValue = `inset(${topInset}% ${sideSqueeze}% 0% ${sideSqueeze}% round 40px)`;
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
                {/* h-[100dvh] ensures it fits safely on mobile without URL bar jumping */}
                <div
                    className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#841d04ec] flex flex-col items-center justify-center"
                    style={{
                        clipPath: clipPathValue,
                        WebkitClipPath: clipPathValue,
                        borderTopLeftRadius: isExiting > 0 ? 0 : `${currentRadius}px`,
                        borderTopRightRadius: isExiting > 0 ? 0 : `${currentRadius}px`,
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
                            className="text-center w-full mb-2 px-4 sm:px-6"
                            style={{
                                transform: `translate3d(0, ${textY}px, 0)`,
                                opacity: Math.min(percentage * 4, 1),
                            }}
                        >
                            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none mt-4 sm:mt-6">
                                The <span className="text-yellow-400">Journey</span>
                            </h2>
                        </div>

                        <div
                            className="relative w-full overflow-visible flex items-center"
                            style={{
                                transform: `translate3d(0, ${cardY}px, 0)`,
                                opacity: cardParallaxProgress,
                                filter: `blur(${(1 - cardParallaxProgress) * 10}px)`
                            }}
                        >
                            <div
                                ref={cardsContainerRef}
                                className="flex items-stretch gap-6 sm:gap-10 md:gap-16 will-change-transform w-max"
                                style={{
                                    // Perfect centering: padding is exactly 50vw minus half the width of the card.
                                    // 140px = half of 280px (mobile card), 160px = half of 320px (tablet card), 200px = half of 400px (desktop card)
                                    paddingLeft: 'calc(50vw - min(37.5vw, 140px))', 
                                    paddingRight: 'calc(50vw - min(37.5vw, 140px))',
                                }}
                            >
                                {/* Media queries inside style tags are tough, so we use wrapper classes to adjust padding via Tailwind */}
                                <div className="hidden sm:block md:hidden absolute inset-0 pointer-events-none" style={{ paddingLeft: 'calc(50vw - 160px)', paddingRight: 'calc(50vw - 160px)' }} />
                                <div className="hidden md:block absolute inset-0 pointer-events-none" style={{ paddingLeft: 'calc(50vw - 200px)', paddingRight: 'calc(50vw - 200px)' }} />
                                
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