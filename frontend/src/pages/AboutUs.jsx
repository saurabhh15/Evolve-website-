import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="bg-black text-white font-sans selection:bg-orange-500 selection:text-black">
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
            <section className="relative py-24 px-6 overflow-hidden border-b border-zinc-800">
                <div className="max-w-6xl mx-auto">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">Our Mission</span>
                    <h1 className="text-6xl md:text-8xl font-black mt-4 leading-tight">
                        BUILD. CONNECT. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                            EVOLVE.
                        </span>
                    </h1>
                    <p className="mt-8 text-zinc-400 text-xl max-w-2xl leading-relaxed">
                        Evolve is where student ideas turn into real startups. We connect
                        builders with mentors, investors, and the resources they need to
                        launch, grow, and scale.
                    </p>
                </div>
            </section>

            {/* Stats/Grid Section */}
            <section className="py-20 px-6 bg-white text-black">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-5xl font-black">0</h3>
                        <p className="text-zinc-600 uppercase tracking-tighter mt-2 font-bold">Student Projects</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-5xl font-black">0</h3>
                        <p className="text-zinc-600 uppercase tracking-tighter mt-2 font-bold">Mentors & Experts</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="text-5xl font-black">0</h3>
                        <p className="text-zinc-600 uppercase tracking-tighter mt-2 font-bold">Investors Onboard</p>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="relative py-24 px-6 bg-zinc-950 overflow-hidden">
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
                <div className="max-w-6xl mx-auto">

                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        <div>

                            <h2 className="text-4xl font-bold mb-6">
                                Why Evolve <span className="text-orange-500">matters</span>.
                            </h2>
                            <p className="text-zinc-400 mb-8 leading-relaxed">
                                Great ideas often stay stuck in classrooms. Evolve bridges that gap—
                                helping students transform concepts into real-world startups through
                                mentorship, funding access, and a powerful community.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    'Mentor & Investor Matching',
                                    'Startup Resources & Tools',
                                    'Real-time Collaboration & Networking'
                                ].map((item) => (
                                    <li key={item} className="flex items-center space-x-3">
                                        <span className="w-2 h-2 bg-orange-500"></span>
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="w-full h-80 rounded-lg overflow-hidden relative group">

                                {/* Image */}
                                <img
                                    src="https://images.unsplash.com/photo-1668681919287-7367677cdc4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // replace with your image
                                    alt="Evolve Platform Preview"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                                />

                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/40" />

                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-8 hidden md:block">
                                <p className="text-black font-bold italic">
                                    "Every startup starts as an idea. We help it evolve."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 bg-black text-white text-center border-t-8 border-orange-500 relative overflow-hidden">

                {/* --- BACKGROUND DECOR (The 'Sweet' Detail) --- */}
                <div className="absolute top-10 left-10 opacity-10 select-none pointer-events-none">
                    <span className="text-9xl font-black italic tracking-tighter">IDEA</span>
                </div>
                <div className="absolute bottom-10 right-10 opacity-10 select-none pointer-events-none">
                    <span className="text-9xl font-black italic tracking-tighter text-orange-500">REALITY</span>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-6xl md:text-8xl font-black mb-12 uppercase tracking-tighter leading-none">
                        Turn your idea <br />
                        into <span className="text-orange-500 italic">reality.</span>
                    </h2>

                    {/* --- THE NEOBRUTALIST BUTTON --- */}
                    <Link
                        to="/get-started"
                        className="group relative inline-flex items-center gap-4 bg-orange-500 text-black px-12 py-6 font-black uppercase tracking-[0.2em] text-2xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 active:scale-95"
                    >
                        Join Evolve Now!

                        {/* Dynamic Icon */}
                        <svg
                            className="w-8 h-8 transition-transform duration-300 group-hover:rotate-45"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>

                    <p className="mt-12 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                        Build. Launch. Evolve.
                    </p>
                </div>
            </section>



        </div>
    );
};

export default AboutPage;