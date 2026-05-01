import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, MapPin, CalendarDays, Zap, ArrowRight, ChevronLeft } from 'lucide-react';

const events = [
    {
        id: "e1",
        day: "23",
        month: "JUN",
        title: "Sansthaein Aur Samvidhan - Live Panel",
        location: "Auditorium 1, Campus Hub",
        time: "7:00 pm — 8:00 pm",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800",
        description: "A deep dive into institutional accountability. This session covers the bridge between academic research and constitutional literacy.",
        longDescription: "This live panel brings together legal experts and student researchers to discuss how digital tools can simplify the Indian Constitution for the masses. We will specifically look at the Legislature and Executive branches as part of the 'Sansthaein Aur Samvidhan' project."
    },
    {
        id: "e2",
        day: "04",
        month: "JUL",
        title: "Evolve Hackathon: From Zip to Startup",
        location: "Evolve Lab, Block B",
        time: "9:00 am — 11:00 am",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
        description: "Our signature 48-hour sprint to take your academic waste and turn it into a potential MVP.",
        longDescription: "The Evolve Hackathon is where we provide the mentors, the tools, and the pressure needed to turn a final year project into a viable business model. Participants will get access to our startup toolkit and IP protection workshop."
    }
];

const EventPage = () => {
    const [activeEvent, setActiveEvent] = useState(null);
    useEffect(() => {
        if (activeEvent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

     
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeEvent]);

    return (
        <div className="bg-[#fffaf5] min-h-screen text-black relative p-6 md:p-12">

            {/* HEADER SECTION */}
            <div className="max-w-6xl mx-auto mb-16 border-b-4 border-black pb-8 mt-6">
                <h1 className="text-7xl font-black uppercase tracking-tighter">Upcoming <span className="text-orange-500 italic">Events.</span></h1>
            </div>

            {/* EVENT LISTING */}
            <div className="max-w-6xl mx-auto space-y-12">
                {events.map((event) => (
                    <div key={event.id} className="group border-2 border-black flex flex-col md:flex-row bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        {/* Date Column */}
                        <div className="p-8 md:w-1/5 bg-zinc-50 border-r-2 border-black flex flex-col items-center justify-center">
                            <span className="font-black text-zinc-400 uppercase tracking-widest text-xs">{event.month}</span>
                            <span className="text-6xl font-black">{event.day}</span>
                        </div>

                        {/* Content Column */}
                        <div className="p-8 flex-1 flex flex-col md:flex-row gap-8">
                            <img src={event.image} className="w-full md:w-48 h-48 object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all" />
                            <div className="flex-1">
                                <h2 className="text-3xl font-black uppercase mb-4 group-hover:text-orange-500 transition-colors">{event.title}</h2>
                                <div className="flex gap-6 text-xs font-bold text-zinc-500 mb-6 uppercase">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                                    <span className="flex items-center gap-1"><CalendarDays size={14} /> {event.time}</span>
                                </div>
                                {/* MODAL TRIGGER */}
                                <button
                                    onClick={() => setActiveEvent(event)}
                                    className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
                                >
                                    View Event Details <ArrowRight size={16} className="text-orange-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- THE MODAL OVERLAY --- */}
            <AnimatePresence>
                {activeEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Black Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveEvent(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />

                        {/* Modal Content Box */}
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            className="relative bg-white border-4 border-black w-full max-w-2xl p-8 md:p-12 shadow-[20px_20px_0px_0px_rgba(249,115,22,1)]"
                        >
                            {/* Close Icon */}
                            <button
                                onClick={() => setActiveEvent(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-orange-500 transition-colors border-2 border-black"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8">
                                <span className="text-orange-500 font-black uppercase tracking-widest text-xs">Event Insight</span>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mt-2">
                                    {activeEvent.title}
                                </h2>
                            </div>

                            <div className="space-y-6 text-zinc-600 font-medium text-lg leading-relaxed mb-10">
                                <p>{activeEvent.description}</p>
                                <p className="border-l-4 border-orange-500 pl-6 italic">{activeEvent.longDescription}</p>
                            </div>

                            {/* Action in Modal */}
                            <button className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all flex items-center justify-center gap-4">
                                Register for this Session <Zap fill="currentColor" size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-32 border-t-4 border-black pt-20">

                {/* The "More to Come" Marquee */}
                <div className="overflow-hidden whitespace-nowrap mb-12 py-4 bg-zinc-50 border-y-2 border-black rotate-[-1deg]">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                        className="flex gap-20 text-zinc-400 font-black uppercase text-sm tracking-[0.5em]"
                    >
                        <span>More Events Dropping Soon • </span>
                        <span>More Events Dropping Soon • </span>
                        <span>More Events Dropping Soon • </span>
                        <span>More Events Dropping Soon • </span>
                    </motion.div>
                </div>

                {/* The Final Statement */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-20">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                            Don't Just <br />
                            <span className="text-orange-500 italic">Watch.</span> Build.
                        </h2>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                            Your academic project is a startup waiting to happen.
                            Stop attending, start evolving.
                        </p>
                    </div>

                    {/* The Persistent "Join Now" Link */}
                    <Link
                        to="/get-started"
                        className="bg-orange-500 text-black px-12 py-6 font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-4 text-2xl border-4 border-black group shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        Join Evolve Now
                        <Zap
                            fill="currentColor"
                            size={24}
                            className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"
                        />
                    </Link>
                </div>

                {/* Minimal Footer Line */}
                
            </div>
        </div>
    );
};

export default EventPage;