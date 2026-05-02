import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Rocket,
  Zap,
  Target,
  Clock,
  Quote as QuoteIcon,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

const SuccessPipeline = () => {
  const stories = [
    {
      id: "01",
      hook: "Built MVP in 3 Weeks",
      founder: "Aarav Mehta",
      idea: "AI Resume Analyzer",
      stage: "MVP",
      timeline: "Started 2 weeks ago",
      problem: "Didn’t know how to start or validate the idea.",
      onEvolve:
        "Connected with 2 mentors and got feedback on product direction.",
      progress: ["Built MVP", "Onboarded 50 users"],
      quote: "Getting early feedback saved me months of confusion.",
      status: "Improving product and preparing for launch",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    },
    {
      id: "02",
      hook: "Found Co-Founder in 48 Hours",
      founder: "Sanya Iyer",
      idea: "Eco-Track SaaS",
      stage: "Idea",
      timeline: "Started 4 days ago",
      problem: "Had no technical partner to build the prototype.",
      onEvolve: "Used Co-Founder Matching to find a Full-Stack developer.",
      progress: ["Team Formed", "Product Roadmap Defined"],
      quote: "I found someone who shares my vision in less than two days.",
      status: "Designing the initial wireframes",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-orange-500 overflow-x-clip p-4 sm:p-6 md:p-12">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-20 border-l-4 md:border-l-8 border-black pl-4 md:pl-8">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mt-4 md:mt-8">
          Live <br /> <span className="text-orange-500 italic">Evolution.</span>
        </h1>
        <p className="mt-3 md:mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs sm:text-sm">
          Proof that people are building here — right now.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            // Responsive shadow: smaller on mobile, larger on desktop
            className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-300 flex flex-col lg:flex-row overflow-hidden"
          >
            {/* Left Column: Image & Founder Info */}
            <div className="lg:w-1/4 bg-zinc-50 p-6 lg:p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between">
              <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
                <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-black lg:mb-6 overflow-hidden shrink-0">
                  <img
                    src={story.image}
                    alt={story.founder}
                    className="grayscale w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight">
                    {story.founder}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest">
                    {story.idea}
                  </p>
                </div>
              </div>
              <div className="mt-6 lg:mt-8">
                <span className="bg-black text-white px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  {story.stage} Stage
                </span>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-2 font-bold uppercase italic flex items-center gap-1">
                  <Clock size={10} /> {story.timeline}
                </p>
              </div>
            </div>

            {/* Middle Column: The Journey Structure */}
            <div className="lg:w-2/4 p-6 sm:p-8 lg:p-10 space-y-6 md:space-y-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-black flex items-center gap-2 md:gap-3 leading-tight">
                <Rocket className="text-orange-500 shrink-0" size={28} />{" "}
                {story.hook}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-2 md:pt-4">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                    <Target size={12} /> The Problem
                  </h4>
                  <p className="font-bold text-zinc-800 leading-tight text-sm md:text-base">
                    {story.problem}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                    <Zap size={12} className="text-orange-500" /> On Evolve
                  </h4>
                  <p className="font-bold text-zinc-800 leading-tight text-sm md:text-base">
                    {story.onEvolve}
                  </p>
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 md:mb-4 flex items-center gap-2">
                  <TrendingUp size={12} /> Progress
                </h4>
                <div className="flex flex-wrap gap-2">
                  {story.progress.map((p, i) => (
                    <span
                      key={i}
                      className="border-2 border-black px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-black uppercase flex items-center gap-2"
                    >
                      <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-orange-500 rounded-full" />{" "}
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Quote & Current Status */}
            <div className="lg:w-1/4 p-6 sm:p-8 lg:p-10 bg-black text-white flex flex-col justify-between">
              <div className="relative">
                <QuoteIcon className="text-orange-500 mb-3 md:mb-4 opacity-50 w-6 h-6 md:w-8 md:h-8" />
                <p className="text-base md:text-lg font-medium italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="mt-8 md:mt-12">
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">
                  Live Journey
                </div>
                <div className="border-l-4 border-orange-500 pl-3 md:pl-4 py-2 bg-zinc-900">
                  <p className="text-xs md:text-sm font-bold uppercase">
                    {story.status}
                  </p>
                </div>
                <button className="w-full mt-4 md:mt-6 flex items-center justify-between border-2 border-white/20 p-3 md:p-4 hover:border-orange-500 group transition-all">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    View Project
                  </span>
                  <ArrowUpRight className="group-hover:text-orange-500 transition-colors w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- JOIN THE EVOLUTION CTA --- */}
      <div className="max-w-7xl mx-auto overflow-visible mt-24 md:mt-40 mb-10 md:mb-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative group"
        >
          {/* Shadow Box */}
          <div className="absolute inset-0 bg-orange-500 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />

          {/* Padding bottom added so the absolute marquee doesn't overlap content */}
          <div className="bg-black text-white p-8 pb-16 sm:p-12 sm:pb-20 md:p-20 md:pb-24 border-4 border-black text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 rotate-12 translate-x-10 -translate-y-10 pointer-events-none hidden sm:block">
              <Rocket size={300} strokeWidth={1} />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 md:mb-6 relative z-10 leading-tight">
              Your Project <br /> Is{" "}
              <span className="text-orange-500">Next.</span>
            </h2>

            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-8 md:mb-12 max-w-lg mx-auto relative z-10 px-2 leading-relaxed">
              Stop letting your ideas collect dust in a GitHub repo. Join the
              next cohort of student founders.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
              <Link
                to="/get-started"
                className="w-full sm:w-auto bg-orange-500 text-black px-4 sm:px-8 py-4 md:px-12 md:py-5 font-black uppercase tracking-wider sm:tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-sm sm:text-base md:text-xl border-2 border-black group whitespace-nowrap"
              >
                Join Evolve Now
                <Zap
                  fill="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-125 transition-transform duration-300 shrink-0"
                />
              </Link>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-orange-500 py-2 overflow-hidden whitespace-nowrap border-t-2 border-black">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="flex gap-10 md:gap-20 text-black font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em]"
              >
                {[...Array(6)].map((_, i) => (
                  <span key={i}>BUILD • LAUNCH • EVOLVE</span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPipeline;
