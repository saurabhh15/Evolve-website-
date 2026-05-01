import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { userAPI, connectionAPI } from '../../services/api';
import { MapPin, ArrowLeft, UserPlus, Calendar , MessageSquare  } from 'lucide-react';

const MentorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dossier');
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 400], [0.5, 0.05]);
    const headerScale = useTransform(scrollY, [0, 400], [1, 1.1]);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                setLoading(true);
                const [mentorRes, sentRes, networkRes] = await Promise.all([
                    userAPI.getById(id),
                    connectionAPI.getSent(),
                    connectionAPI.getNetwork()
                ]);
                setMentor(mentorRes.data);

                const alreadySent = sentRes.data.some(
                    c => c.to._id === id && c.type === 'mentor-request' &&
                        c.status === 'pending'
                );
                const alreadyAccepted = networkRes.data.some(
                    u => u._id.toString() === id
                );
                setConnected(alreadySent && !alreadyAccepted);
                setIsAccepted(alreadyAccepted);
            } catch (err) {
                setError('Failed to load mentor profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchMentor();
    }, [id]);

    const handleBookSession = async () => {
        if (connected || connecting) return;
        setConnecting(true);
        try {
            await connectionAPI.send({
                to: mentor._id,
                type: 'mentor-request',
                message: `Hi ${mentor.name}, I'd love to connect and learn from your expertise!`
            });
            setConnected(true);
        } catch (err) {
            console.error('Failed to send request:', err);
        } finally {
            setConnecting(false);
        }
    };

    const stats = mentor ? [
        { label: 'Ratings', val: mentor.rating?.toFixed(2) || '0.00', sub: 'trust' },
        { label: 'Sessions', val: mentor.sessionsHeld >= 1000 ? `${(mentor.sessionsHeld / 1000).toFixed(1)}K` : mentor.sessionsHeld || '0', sub: 'LOGGED' },
        { label: 'Response', val: mentor.responseTime?.replace('< ', '') || 'N/A', sub: 'AVG' },
    ] : [];

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
    );

    if (error || !mentor) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <p className="text-red-400 font-semibold">{error || 'Mentor not found.'}</p>
        </div>
    );

    const backgroundImage = mentor.profileImage && !mentor.profileImage.includes('placeholder')
        ? mentor.profileImage
        : null;

    return (

        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">

            {/* 1. BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-8 z-[100] flex items-center gap-2 text-[14px] font-bold tracking-[0.4em] uppercase text-white/50 hover:text-orange-500 transition-colors"
            >
                <ArrowLeft size={14} />
                Return
            </button>

            {/* 2. TAB NAVIGATION */}
            <nav className="fixed top-0 left-0 w-full z-[99] px-8 py-6 flex justify-center items-center bg-black/20 backdrop-blur-md border-b border-white/5">
                <div className="flex gap-10">
                    {['Dossier', 'Expertise', 'Availability'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[14px] font-bold tracking-[0.4em] uppercase transition-all relative py-1 ${activeTab === tab ? 'text-orange-500' : 'text-white/20 hover:text-white'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="nav_line" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-orange-500" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* 3. PROFILE HEADER BANNER */}
            <div className="relative pt-16">
                {/* Banner */}
                <div className="relative h-52 w-full overflow-hidden">
                    {mentor.coverImage ? (
                        <img
                            src={mentor.coverImage}
                            className="w-full h-full object-cover brightness-75"
                            alt="Cover"
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-[#0a0a0a]" />
                            <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#e87315]/10 blur-3xl" />
                            <div className="absolute -bottom-10 right-20 w-96 h-40 rounded-full bg-[#e87315]/5 blur-3xl" />
                            <div className="absolute top-0 right-0 w-40 h-40 border-r border-t border-[#e87315]/10 rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-white/5 rounded-tr-full" />
                        </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                </div>

                {/* Profile image overlapping banner */}
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="relative -mt-16 flex items-end gap-8 pb-8 border-b border-white/5">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-[#050505] shadow-2xl">
                                <img
                                    src={mentor.profileImage}
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${mentor.name}&bold=true`;
                                    }}
                                    className="w-full h-full object-cover"
                                    alt={mentor.name}
                                />
                            </div>
                            <div className={`absolute -bottom-2 -right-2 px-2 py-1 text-[7px] font-black uppercase tracking-widest rounded-sm ${mentor.mentorStatus === 'Accepting Mentees'
                                ? 'bg-orange-500 text-black'
                                : mentor.mentorStatus === 'Limited Capacity'
                                    ? 'bg-yellow-500 text-black'
                                    : 'bg-white/10 text-white'
                                }`}>
                                {mentor.mentorStatus || 'Active'}
                            </div>
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 pb-2">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-1">
                                        {mentor.name}
                                    </h1>
                                    <p className="text-[10px] font-bold tracking-widest text-orange-500 uppercase italic">
                                        {mentor.role} {mentor.company ? `@ ${mentor.company}` : ''}
                                    </p>
                                    {mentor.location && (
                                        <div className="flex items-center gap-1.5 text-white/30 mt-2">
                                            <MapPin size={11} />
                                            <span className="text-[10px] font-medium tracking-widest uppercase">{mentor.location}</span>
                                        </div>
                                    )}
                                </div>


                                {/* Social links inline */}
                                <div className="flex flex-wrap gap-3 mt-4 flex-shrink-0">
                                    {/* ── LinkedIn Link ── */}
                                    {mentor.linkedIn && (
                                        <a
                                            href={mentor.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/link relative px-4 py-2 overflow-hidden border border-white/5 transition-all duration-300"
                                        >
                                            {/* Hover Background Slide */}
                                            <div className="absolute inset-0 bg-[#e87315] -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />

                                            <div className="relative z-10 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-[#e87315] group-hover/link:bg-black transition-colors" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 group-hover/link:text-black transition-colors">
                                                    LinkedIn
                                                </span>
                                            </div>

                                            {/* Tech Corner Accent */}
                                            <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" />
                                        </a>
                                    )}

                                    {/* ── GitHub Link ── */}
                                    {mentor.github && (
                                        <a
                                            href={mentor.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/link relative px-4 py-2 overflow-hidden border border-white/5 transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-white -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />

                                            <div className="relative z-10 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-white group-hover/link:bg-black transition-colors" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 group-hover/link:text-black transition-colors">
                                                    GitHub
                                                </span>
                                            </div>

                                            <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" />
                                        </a>
                                    )}

                                    {/* ── Website Link ── */}
                                    {mentor.website && (
                                        <a
                                            href={mentor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/link relative px-4 py-2 overflow-hidden border border-white/5 transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-[#e87315] -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />

                                            <div className="relative z-10 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-[#e87315] group-hover/link:bg-black transition-colors" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 group-hover/link:text-black transition-colors">
                                                    Website
                                                </span>
                                            </div>

                                            <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" />
                                        </a>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-6">
                                    {isAccepted ? (
                                        /* ── Send Message ── */
                                        <button
                                            onClick={() => navigate('/dashboard/messages')}
                                            className="group relative flex items-center gap-3 px-8 py-4 bg-[#e87315] overflow-hidden transition-all duration-300"
                                        >
                                            {/* Glossy Overlay */}
                                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                                            <div className="relative z-10 flex items-center gap-2">
                                                <MessageSquare size={14} className="text-black" strokeWidth={3} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
                                                    Send Message
                                                </span>
                                            </div>

                                            {/* Corner Notch */}
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-black/10" />
                                        </button>
                                    ) : (
                                        /* ── Connect / Booking Logic ── */
                                        <button
                                            onClick={handleBookSession}
                                            disabled={connected || connecting}
                                            className={`group relative flex items-center gap-3 px-8 py-4 border transition-all duration-500 overflow-hidden ${connected
                                                ? 'bg-green-500/5 border-green-500/20 text-green-400'
                                                : 'bg-transparent border-[#e87315] text-[#e87315]'
                                                }`}
                                        >
                                            {/* Background Hover Fill */}
                                            {!connected && !connecting && (
                                                <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            )}

                                            <div className={`relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300 ${!connected && !connecting && 'group-hover:text-black'
                                                }`}>
                                                {connecting ? (
                                                    <>
                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        <span>Linking...</span>
                                                    </>
                                                ) : connected ? (
                                                    <>
                                                        <Check size={14} strokeWidth={3} />
                                                        <span>Request Sent</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={14} strokeWidth={3} />
                                                        <span>Connect</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Micro Accents */}
                                            <div className={`absolute top-0 right-0 w-1.5 h-1.5 ${connected ? 'bg-green-500/40' : 'bg-[#e87315] group-hover:bg-black'
                                                }`} />
                                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-current group-hover:w-full transition-all duration-700" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Alumni + college inline */}
                            <div className="flex items-center gap-6 mt-3 text-[10px] tracking-widest font-medium text-white/30">
                                {mentor.college && <span>{mentor.college}</span>}
                                {mentor.isAlumni && (
                                    <span className="text-orange-500">Alumni · Class of {mentor.gradYear}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. MAIN CONTENT */}
            <main className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 pb-40 pt-12">

                {/* LEFT: PROFILE HUD - now shows extra info */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-32 space-y-4">
                        <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                            {/* ── Section Header ── */}
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                    Quick Info
                                </h3>
                            </div>

                            {/* ── Metric Grid ── */}
                            <div className="space-y-5 relative z-10">
                                {/* Response Time */}
                                <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Avg responseTime
                                    </span>
                                    <span className="text-[11px] font-mono text-white tracking-tighter">
                                        {mentor.responseTime || '< 48 HRS'}
                                    </span>
                                </div>

                                {/* Sessions */}
                                <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Sessions
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-mono text-white">
                                            {(mentor.sessionsHeld || 0).toString().padStart(2, '0')}
                                        </span>
                                        <div className="w-4 h-[1px] bg-[#e87315]/30" />
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Rating
                                    </span>
                                    <span className="text-[11px] font-black text-[#e87315] tracking-widest italic">
                                        {mentor.rating?.toFixed(1) || '0.0'} / 5.0
                                    </span>
                                </div>

                                {/* Category */}
                                {mentor.category && (
                                    <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                            Domain
                                        </span>
                                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider text-right">
                                            {mentor.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ── Technical Background Elements ── */}


                            {/* Architect Accents */}
                            <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                        </div>
                    </div>
                </aside>

                {/* RIGHT: CONTENT */}
                <div className="lg:col-span-8 lg:pt-16">

                    {/* STATS */}
                    <section className="grid grid-cols-3 gap-8 mb-24 border-b border-white/5 pb-16">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <p className="text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase mb-4 italic">
                                    {stat.label}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black italic tracking-tighter">{stat.val}</span>

                                </div>
                            </div>
                        ))}
                    </section>

                    {/* TABS CONTENT */}
                    <div className="">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Dossier' && (
                                <motion.div
                                    key="dossier"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-16"
                                >
                                    <section>
                                        <h4 className="text-[10px] font-bold tracking-[0.4em] text-orange-500 uppercase mb-8 italic"> Summary</h4>
                                        <p className="mb-4 text-3xl lg:text-4xl font-black italic leading-[1.15] tracking-tighter uppercase text-white/90">
                                            "{mentor.bio || 'No bio provided yet.'}"
                                        </p>
                                    </section>

                                    {mentor.skills?.length > 0 && (
                                        <section className="pt-10 border-t border-white/5">
                                            <h4 className="text-[10px] font-bold tracking-[0.4em] text-orange-500 uppercase mb-8 italic"> Skills</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {mentor.skills.map((skill, i) => (
                                                    <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/60 hover:border-orange-500/30 hover:text-white transition-all">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'Expertise' && (
                                <motion.div
                                    key="expertise"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {mentor.expertise?.length > 0 ? mentor.expertise.map((skill) => (
                                        <div key={skill} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all flex justify-between items-center group">
                                            <span className="text-xl font-black italic uppercase tracking-tighter group-hover:text-orange-500 transition-colors">{skill}</span>
                                            <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-orange-500" />
                                        </div>
                                    )) : (
                                        <p className="text-white/20 text-sm italic col-span-2">No expertise listed yet.</p>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'Availability' && (
                                <motion.div
                                    key="availability"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center h-64"
                                >
                                    <p className="text-white/20 text-sm italic tracking-widest uppercase">Coming Soon</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CTA */}
                    <footer className="relative mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden">
                        {/* -- Background Decorative Element -- */}
                        <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315] to-transparent opacity-20" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-1 bg-[#e87315] rounded-full animate-pulse" />
                                <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
                                    Ready to Connect?
                                </p>
                            </div>
                            <p className="text-[11px] font-mono text-white/40 uppercase tracking-tighter">
                                
                                Responses typically within {mentor.responseTime || '48 hrs'}.
                            </p>
                        </div>

                        <div className="relative group/footer-btn">
                            <button
                                onClick={handleBookSession}
                                disabled={connected || connecting}
                                className={`relative px-14 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden ${connected
                                        ? 'bg-green-500/5 text-green-400 border border-green-500/20 cursor-default'
                                        : connecting
                                            ? 'bg-white/5 text-white/50 cursor-wait border border-white/10'
                                            : 'bg-transparent text-white border border-white/20 hover:border-[#e87315] hover:text-black'
                                    }`}
                            >
                                {/* Hover Background Slide */}
                                {!connected && !connecting && (
                                    <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/footer-btn:translate-y-0 transition-transform duration-300 ease-out" />
                                )}

                                <span className="relative z-10 flex items-center gap-3">
                                    {connected ? (
                                        <>
                                            <Check size={14} strokeWidth={3} />
                                            Request_Sent
                                        </>
                                    ) : connecting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Processing
                                        </>
                                    ) : (
                                        <>
                                            <Calendar size={14} />
                                            Book Session
                                        </>
                                    )}
                                </span>
                            </button>

                            {/* Architect Corner Accents */}
                            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315] opacity-0 group-hover/footer-btn:opacity-100 transition-opacity" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#e87315] opacity-0 group-hover/footer-btn:opacity-100 transition-opacity" />
                        </div>

                        {/* Subtle Scanning Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </footer>
                </div>
            </main>

            <footer className="p-10 text-center opacity-10 border-t border-white/5">
                <p className="text-[8px] font-bold tracking-[1em] uppercase">EVOLVE 2026</p>
            </footer>
        </div>
    );
};

export default MentorProfile;