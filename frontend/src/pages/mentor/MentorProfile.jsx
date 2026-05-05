import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { userAPI, connectionAPI } from '../../services/api';
import { MapPin, ArrowLeft, UserPlus, Calendar, MessageSquare, Check } from 'lucide-react';

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

    const getDisplayImage = () => {
        if (mentor?.profileImage && !mentor.profileImage.includes('freepik.com')) {
            return mentor.profileImage;
        }

        if (mentor?.gender === 'female') return '/female.jpg';
        if (mentor?.gender === 'male') return '/male.jpg';

        return `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${mentor?.name || 'User'}&bold=true`;
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

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 md:left-8 z-[100] flex items-center gap-2 text-[12px] md:text-[14px] font-bold tracking-[0.4em] uppercase text-white/50 hover:text-orange-500 transition-colors bg-black/40 md:bg-transparent px-3 py-1.5 md:p-0 rounded-md backdrop-blur-sm"
            >
                <ArrowLeft size={14} />
                Return
            </button>

            <nav className="fixed top-0 left-0 w-full z-[99] px-4 md:px-8 py-4 md:py-6 flex justify-start md:justify-center items-center bg-black/20 backdrop-blur-md border-b border-white/5 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 md:gap-10 min-w-max mx-auto md:mx-0 pl-[100px] md:pl-0 pr-4">
                    {['Dossier', 'Expertise', 'Availability'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[12px] md:text-[14px] font-bold tracking-[0.4em] uppercase transition-all relative py-1 ${activeTab === tab ? 'text-orange-500' : 'text-white/20 hover:text-white'
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

            <div className="relative pt-16">
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="relative -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pb-8 border-b border-white/5 text-center md:text-left">
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-[#050505] shadow-2xl">
                                <img
                                    src={getDisplayImage()}
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

                        <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase text-white mb-1">
                                    {mentor.name}
                                </h1>
                                <p className="text-[10px] font-bold tracking-widest text-orange-500 uppercase italic">
                                    {(mentor.role || 'expert').toUpperCase()}
                                    {mentor.category ? ` / ${mentor.category}` : ''}
                                    {mentor.gender ? ` / ${mentor.gender.toUpperCase()}` : ''}
                                </p>
                                {mentor.location && (
                                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-white/30 mt-2">
                                        <MapPin size={11} />
                                        <span className="text-[10px] font-medium tracking-widest uppercase">{mentor.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-4 md:mt-0 flex-shrink-0 w-full md:w-auto">
                                {mentor.linkedIn && (
                                    <a
                                        href={mentor.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/link relative px-4 py-2 overflow-hidden border border-white/5 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-[#e87315] -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                                        <div className="relative z-10 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[#e87315] group-hover/link:bg-black transition-colors" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 group-hover/link:text-black transition-colors">
                                                LinkedIn
                                            </span>
                                        </div>
                                        <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" />
                                    </a>
                                )}
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
                        </div>

                        <div className="flex flex-col sm:flex-row w-full justify-center md:justify-start items-center sm:gap-6 mt-2 sm:mt-0 pb-4 md:pb-0 text-[10px] tracking-widest font-medium text-white/30">
                            {mentor.college && <span>{mentor.college}</span>}
                            {mentor.isAlumni && (
                                <span className="text-orange-500 mt-2 sm:mt-0">Alumni · Class of {mentor.gradYear}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="relative z-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pb-40 pt-8 lg:pt-12">
                <aside className="lg:col-span-4">
                    <div className="sticky top-24 sm:top-32 space-y-4">
                        <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                    Quick Info
                                </h3>
                            </div>
                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Avg responseTime
                                    </span>
                                    <span className="text-[11px] font-mono text-white tracking-tighter">
                                        {mentor.responseTime || '< 48 HRS'}
                                    </span>
                                </div>
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
                                <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Rating
                                    </span>
                                    <span className="text-[11px] font-black text-[#e87315] tracking-widest italic">
                                        {mentor.rating?.toFixed(1) || '0.0'} / 5.0
                                    </span>
                                </div>
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
                            <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                        </div>
                    </div>
                </aside>

                <div className="lg:col-span-8 lg:pt-0">
                    <section className="grid grid-cols-3 gap-4 md:gap-8 mb-16 md:mb-24 border-b border-white/5 pb-12 md:pb-16 text-center lg:text-left">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <p className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white/20 uppercase mb-2 sm:mb-4 italic">
                                    {stat.label}
                                </p>
                                <div className="flex items-baseline justify-center lg:justify-start gap-1">
                                    <span className="text-3xl sm:text-5xl font-black italic tracking-tighter">{stat.val}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <div>
                        <AnimatePresence mode="wait">
                            {activeTab === 'Dossier' && (
                                <motion.div
                                    key="dossier"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-12 sm:space-y-16 text-center md:text-left"
                                >
                                    <section>
                                        <h4 className="text-[10px] font-bold tracking-[0.4em] text-orange-500 uppercase mb-6 sm:mb-8 italic"> Summary</h4>
                                        <p className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-black italic leading-[1.25] tracking-tighter uppercase text-white/90">
                                            "{mentor.bio || 'No bio provided yet.'}"
                                        </p>
                                    </section>

                                    {mentor.skills?.length > 0 && (
                                        <section className="pt-8 sm:pt-10 border-t border-white/5">
                                            <h4 className="text-[10px] font-bold tracking-[0.4em] text-orange-500 uppercase mb-6 sm:mb-8 italic"> Skills</h4>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
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
                                            <span className="text-[16px] sm:text-xl font-black italic uppercase tracking-tighter group-hover:text-orange-500 transition-colors">{skill}</span>
                                            <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-orange-500" />
                                        </div>
                                    )) : (
                                        <p className="text-white/20 text-sm italic col-span-2 text-center md:text-left">No expertise listed yet.</p>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'Availability' && (
                                <motion.div
                                    key="availability"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center h-48 sm:h-64"
                                >
                                    <p className="text-white/20 text-sm italic tracking-widest uppercase text-center">Coming Soon</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <footer className="relative mt-12 sm:mt-16 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-8 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315] to-transparent opacity-20 hidden sm:block" />

                        <div className="relative z-10 w-full sm:w-auto flex flex-col items-center sm:items-start">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                <div className="w-1 h-1 bg-[#e87315] rounded-full animate-pulse" />
                                <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
                                    Ready to Connect?
                                </p>
                            </div>
                            <p className="text-[11px] font-mono text-white/40 uppercase tracking-tighter">
                                Responses typically within {mentor.responseTime || '48 hrs'}.
                            </p>
                        </div>

                        <div className="relative group/footer-btn w-full sm:w-auto">
                            {isAccepted ? (
                                <button
                                    onClick={() => navigate('/dashboard/messages')}
                                    className="group relative flex w-full justify-center items-center gap-3 px-8 py-5 sm:py-4 bg-[#e87315] overflow-hidden transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                    <div className="relative z-10 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-black" strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
                                            Send Message
                                        </span>
                                    </div>
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-black/10" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleBookSession}
                                    disabled={connected || connecting}
                                    className={`relative flex w-full justify-center sm:w-auto px-8 sm:px-14 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden ${connected
                                        ? 'bg-green-500/5 text-green-400 border border-green-500/20 cursor-default'
                                        : connecting
                                            ? 'bg-white/5 text-white/50 cursor-wait border border-white/10'
                                            : 'bg-transparent text-white border border-white/20 hover:border-[#e87315] hover:text-black'
                                        }`}
                                >
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
                            )}
                            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315] opacity-0 group-hover/footer-btn:opacity-100 transition-opacity hidden sm:block" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#e87315] opacity-0 group-hover/footer-btn:opacity-100 transition-opacity hidden sm:block" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent hidden sm:block" />
                    </footer>
                </div>
            </main>

            <footer className="p-8 sm:p-10 text-center opacity-10 border-t border-white/5">
                <p className="text-[8px] font-bold tracking-[1em] uppercase">EVOLVE 2026</p>
            </footer>
        </div>
    );
};

export default MentorProfile;