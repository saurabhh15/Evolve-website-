import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="bg-black text-white font-sans selection:bg-orange-500 selection:text-black overflow-hidden pt-20 md:pt-0">
            <div className="absolute inset-0 pointer-events-none">
                {/* Layer 1: Tiny Stars */}
                <div
                    className="absolute inset-0 opacity-70"
                    style={{
                        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #3b82f6, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #60a5fa, rgba(0,0,0,0))',
                        backgroundSize: '200px 200px',
                        animation: 'starDriftDiagonal 30s linear infinite'
                    }}
                />

                {/* Layer 2: Pulse Stars */}
                <div
                    className="absolute inset-0 opacity-80 animate-pulse"
                    style={{
                        backgroundImage: 'radial-gradient(2px 2px at 100px 150px, #93c5fd, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 300px 200px, #fff, rgba(0,0,0,0))',
                        backgroundSize: '400px 400px',
                        animation: 'starDriftDiagonal 30s linear infinite'
                    }}
                />

                {/* Subtle Blue Horizon Glow (Stark Aesthetic) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
            </div>
            
            {/* Hero Section */}
            <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden border-b border-zinc-800">
                <div className="max-w-6xl mx-auto pt-6 md:pt-10">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-xs sm:text-sm">Our Mission</span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mt-4 leading-[1.1] md:leading-tight">
                        BUILD. CONNECT. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                            EVOLVE.
                        </span>
                    </h1>
                    <p className="mt-6 md:mt-8 text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Evolve is where student ideas turn into real startups. We connect
                        builders with mentors, investors, and the resources they need to
                        launch, grow, and scale.
                    </p>
                </div>
            </section>

            {/* Stats/Grid Section */}
            <section className="py-12 md:py-20 px-4 sm:px-6 bg-white text-black">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="border-l-4 border-orange-500 pl-5 md:pl-6">
                        <h3 className="text-4xl md:text-5xl font-black">0</h3>
                        <p className="text-zinc-600 uppercase tracking-tighter mt-1 md:mt-2 font-bold text-sm md:text-base">Student Projects</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-5 md:pl-6">
                        <h3 className="text-4xl md:text-5xl font-black">0</h3>
                        <p className="text-zinc-600 uppercase tracking-tighter mt-1 md:mt-2 font-bold text-sm md:text-base">Mentors & Experts</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-5 md:pl-6">
                        <h3 className="text-4xl md:text-5xl font-black">0</h3>
                        <p className="text-zinc-600 uppercase tracking-tighter mt-1 md:mt-2 font-bold text-sm md:text-base">Investors Onboard</p>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="relative py-16 md:py-24 px-4 sm:px-6 bg-zinc-950 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    {/* Layer 1: Tiny Stars */}
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #3b82f6, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #60a5fa, rgba(0,0,0,0))',
                            backgroundSize: '200px 200px',
                            animation: 'starDriftDiagonal 30s linear infinite'
                        }}
                    />

                    {/* Layer 2: Larger "HUD" Glints */}
                    <div
                        className="absolute inset-0 opacity-80 animate-pulse"
                        style={{
                            backgroundImage: 'radial-gradient(2px 2px at 100px 150px, #93c5fd, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 300px 200px, #fff, rgba(0,0,0,0))',
                            backgroundSize: '400px 400px',
                            animation: 'starDriftDiagonal 30s linear infinite'
                        }}
                    />

                    {/* Subtle Blue Horizon Glow (Stark Aesthetic) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%2C_rgba(59%2C130%2C246%2C0.15)%2C_transparent_70%)]" />
                </div>
                
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                                Why Evolve <span className="text-orange-500">matters</span>.
                            </h2>
                            <p className="text-zinc-400 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                                Great ideas often stay stuck in classrooms. Evolve bridges that gap—
                                helping students transform concepts into real-world startups through
                                mentorship, funding access, and a powerful community.
                            </p>

                            <ul className="space-y-3 md:space-y-4">
                                {[
                                    'Mentor & Investor Matching',
                                    'Startup Resources & Tools',
                                    'Real-time Collaboration & Networking'
                                ].map((item) => (
                                    <li key={item} className="flex items-center space-x-3 text-sm md:text-base">
                                        <span className="w-2 h-2 bg-orange-500 shrink-0"></span>
                                        <span className="font-medium text-zinc-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative mt-8 md:mt-0">
                            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden relative group">
                                {/* Students collaborating / startup pitch / mentorship scene */}
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0"
                                    alt="Students collaborating on startup ideas"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                                />

                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/20" />
                            </div>
                            {/* Hidden on mobile, visible on desktop */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 lg:p-8 hidden md:block shadow-xl z-20 max-w-sm">
                                <p className="text-black font-bold italic text-sm lg:text-base leading-snug">
                                    "Every startup starts as an idea. We help it evolve."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-black text-white text-center border-t-8 border-orange-500 relative overflow-hidden">

                {/* --- BACKGROUND DECOR (The 'Sweet' Detail) --- */}
                <div className="absolute top-4 sm:top-10 left-4 sm:left-10 opacity-10 select-none pointer-events-none">
                    <span className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter">IDEA</span>
                </div>
                <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 opacity-10 select-none pointer-events-none">
                    <span className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter text-orange-500">REALITY</span>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 md:mb-12 uppercase tracking-tighter leading-none">
                        Turn your idea <br />
                        into <span className="text-orange-500 italic">reality.</span>
                    </h2>

                    {/* --- THE NEOBRUTALIST BUTTON --- */}
                    <Link
                        to="/get-started"
                        className="group relative inline-flex items-center justify-center gap-3 sm:gap-4 bg-orange-500 text-black px-6 sm:px-8 md:px-12 py-4 md:py-6 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-lg sm:text-xl md:text-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 md:hover:translate-x-2 md:hover:translate-y-2 transition-all duration-200 active:scale-95 w-full sm:w-auto"
                    >
                        Join Evolve Now!

                        {/* Dynamic Icon */}
                        <svg
                            className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:rotate-45"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>

                    <p className="mt-10 md:mt-12 text-zinc-500 font-bold uppercase tracking-[0.1em] sm:tracking-widest text-[10px] sm:text-xs">
                        Build. Launch. Evolve.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;