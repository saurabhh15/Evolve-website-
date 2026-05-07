import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI, connectionAPI, projectAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ArrowLeft, ExternalLink, Heart, Eye, UserPlus, Settings, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, projectsRes, sentRes, networkRes] = await Promise.all([
                    userAPI.getById(id),
                    userAPI.getUserProjects(id),
                    connectionAPI.getSent(),
                    connectionAPI.getNetwork()
                ]);
                setProfile(profileRes.data);
                setProjects(projectsRes.data);

                const accepted = networkRes.data.some(
                    u => u._id.toString() === id
                );
                const isPending = sentRes.data.some(
                    c => c.to._id === id &&
                        (c.type === 'peer-request' || c.type === 'mentor-request') &&
                        c.status === 'pending'
                );

                setConnected(isPending && !accepted);
                setIsAccepted(accepted);

            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleConnect = async () => {
        if (connected || connecting) return;
        setConnecting(true);
        try {
            await connectionAPI.send({
                to: id,
                type: profile.role === 'mentor' ? 'mentor-request' : 'peer-request',
                message: `Hi ${profile.name}, I'd love to connect!`
            });
            setConnected(true);
        } catch (err) {
            console.error('Failed to connect:', err);
        } finally {
            setConnecting(false);
        }
    };

    const getStageBadge = (stage) => {
        switch (stage) {
            case 'idea': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'prototype': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'mvp': return 'bg-[#e87315]/20 text-[#e87315] border-[#e87315]/40';
            case 'launched': return 'bg-green-500/20 text-green-300 border-green-500/30';
            default: return 'bg-white/10 text-white/70 border-white/20';
        }
    };

    const getDisplayImage = () => {
        // if custom uploaded image exists
        if (profile?.profileImage && !profile.profileImage.includes('freepik.com')) {
            return profile.profileImage;
        }

        // fallback to gender image
        if (profile?.gender === 'female') return '/female.jpg';
        if (profile?.gender === 'male') return '/male.jpg';

        // fallback avatar
        return `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${profile?.name || 'User'}&bold=true`;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin" />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <p className="text-red-400 font-semibold">{error || 'Profile not found.'}</p>
        </div>
    );

    const isOwnProfile = profile._id === user?._id;

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden selection:bg-[#e87315] selection:text-black">
            <div className="sticky top-4 z-50 px-4 sm:px-6 md:px-8 pointer-events-none" style={{ marginBottom: '-48px' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 text-[12px] sm:text-[13px] font-black tracking-[0.3em] uppercase text-white/60 hover:text-[#e87315] transition-colors bg-black/40 backdrop-blur-md border border-white/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg"
                >
                    <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                    Back
                </button>
            </div>

            <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-white/5">
                {profile.coverImage ? (
                    <img
                        src={profile.coverImage}
                        className="w-full h-full object-cover brightness-75 opacity-80"
                        alt="Cover"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[#0c0c0c]" />
                        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#e87315]/10 blur-3xl" />
                        <div className="absolute -bottom-10 right-20 w-96 h-40 rounded-full bg-[#e87315]/5 blur-3xl" />
                        <div className="absolute top-0 right-0 w-40 h-40 border-r border-t border-[#e87315]/20 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-white/10 rounded-tr-full" />
                    </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 sm:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-white/10">
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-[#050505] shadow-2xl bg-[#0c0c0c]">
                            <img
                                src={getDisplayImage()}
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${profile.name}&bold=true`;
                                }}
                                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                                alt={profile.name}
                            />
                        </div>
                        <div className={`absolute -bottom-2 -right-2 px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-sm shadow-lg ${profile.role === 'Mentor'
                                ? 'bg-[#e87315] text-black'
                                : profile.role === 'Investor'
                                    ? 'bg-green-500 text-black'
                                    : 'bg-white/10 text-white/90 border border-white/20'
                            }`}>
                            {profile.role || 'Member'}
                        </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-2 text-center md:text-left">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white/90 italic uppercase">{profile.name}</h1>
                            <p className="text-[11px] sm:text-[12px] font-bold text-[#e87315] uppercase tracking-widest mt-1.5 italic">
                                {(profile.role || 'member').toUpperCase()}
                                {profile.gender ? ` / ${profile.gender.toUpperCase()}` : ''}
                            </p>
                            {profile.college && (
                                <p className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-widest mt-1.5">{profile.college}</p>
                            )}
                            {profile.location && (
                                <div className="flex items-center justify-center md:justify-start gap-1.5 text-white/50 mt-2">
                                    <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">{profile.location}</span>
                                </div>
                            )}
                        </div>

                        {!isOwnProfile && (
                            <div className="relative group/action flex items-center w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0">
                                {isAccepted ? (
                                    <button
                                        onClick={() => navigate('/dashboard/messages')}
                                        className="relative flex justify-center items-center gap-3 w-full md:w-auto px-8 sm:px-10 py-4 sm:py-4.5 bg-[#e87315] overflow-hidden transition-all duration-300 group/msg"
                                    >
                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/msg:translate-x-0 transition-transform duration-500" />
                                        <span className="relative z-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-black flex items-center gap-2">
                                            <MessageSquare size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
                                            Send Message
                                        </span>
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-black/20" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleConnect}
                                        disabled={connected || connecting}
                                        className={`relative flex justify-center items-center gap-3 w-full md:w-auto px-8 sm:px-10 py-4 sm:py-4.5 border overflow-hidden transition-all duration-500 ${connected
                                                ? 'bg-green-500/10 border-green-500/40 text-green-400'
                                                : 'bg-[#0c0c0c] border-white/20 hover:border-[#e87315] text-[#e87315]'
                                            }`}
                                    >
                                        {!connected && !connecting && (
                                            <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/action:translate-y-0 transition-transform duration-300 ease-out" />
                                        )}
                                        <div className={`relative z-10 flex items-center gap-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-colors duration-300 ${!connected && !connecting && 'group-hover/action:text-black'
                                            }`}>
                                            {connecting ? (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-3.5 h-3.5 border-[2.5px] border-current border-t-transparent rounded-full animate-spin" />
                                                    <span>Linking...</span>
                                                </div>
                                            ) : connected ? (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                    <span>Request_Sent</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <UserPlus size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
                                                    <span>Connect</span>
                                                </>
                                            )}
                                        </div>
                                        <div className={`absolute top-0 right-0 w-2 h-2 transition-colors ${connected ? 'bg-green-500/50' : 'bg-[#e87315] group-hover/action:bg-black'
                                            }`} />
                                    </button>
                                )}
                            </div>
                        )}

                        {isOwnProfile && (
                            <button
                                onClick={() => navigate('/dashboard/myprofile')}
                                className="relative group/edit flex items-center justify-center w-full md:w-auto overflow-hidden px-8 sm:px-10 py-4 sm:py-4.5 mt-4 md:mt-0 bg-[#0c0c0c] border border-white/20 hover:border-[#e87315]/50 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-[#e87315]/10 translate-y-full group-hover/edit:translate-y-0 transition-transform duration-500 ease-out" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <Settings size={16} className="text-[#e87315] group-hover/edit:rotate-90 transition-transform duration-500 sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/70 group-hover/edit:text-white/90 transition-colors">
                                        Edit Profile
                                    </span>
                                </div>
                                <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315] opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20" />
                                <div className="absolute top-0 right-0 w-[2px] h-0 bg-[#e87315] group-hover/edit:h-full transition-all duration-500" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-8 sm:mt-10">
                    {profile.linkedIn && (
                        <a
                            href={profile.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative px-5 sm:px-6 py-2.5 sm:py-3 overflow-hidden bg-[#0c0c0c] border border-white/20 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-[#e87315] -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                            <div className="relative z-10 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#e87315] group-hover/link:bg-black transition-colors" />
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/link:text-black transition-colors">
                                    LinkedIn
                                </span>
                            </div>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white/30 group-hover/link:bg-black/30 transition-colors" />
                        </a>
                    )}

                    {profile.github && (
                        <a
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative px-5 sm:px-6 py-2.5 sm:py-3 overflow-hidden bg-[#0c0c0c] border border-white/20 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-white -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                            <div className="relative z-10 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white group-hover/link:bg-black transition-colors" />
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/link:text-black transition-colors">
                                    GitHub
                                </span>
                            </div>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white/30 group-hover/link:bg-black/30 transition-colors" />
                        </a>
                    )}

                    {profile.website && (
                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link relative px-5 sm:px-6 py-2.5 sm:py-3 overflow-hidden bg-[#0c0c0c] border border-white/20 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-[#e87315] -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                            <div className="relative z-10 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#e87315] group-hover/link:bg-black transition-colors" />
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/link:text-black transition-colors">
                                    Website
                                </span>
                            </div>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white/30 group-hover/link:bg-black/30 transition-colors" />
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12 sm:mt-16">
                    <aside className="lg:col-span-4 space-y-8 sm:space-y-10">
                        <div className="space-y-8 sm:space-y-10">
                            {profile.bio && (
                                <div className="relative bg-[#0c0c0c] p-6 sm:p-8 border border-white/10 overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-6 sm:mb-8 relative z-10">
                                        <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                        <h3 className="text-[11px] sm:text-[12px] font-black text-white/90 uppercase tracking-[0.5em] italic">
                                            Bio
                                        </h3>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[13px] sm:text-[14px] text-white/70 leading-relaxed font-medium italic">
                                            {profile.bio}
                                        </p>
                                    </div>
                                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                                </div>
                            )}

                            {profile.skills?.length > 0 && (
                                <div className="relative bg-[#0c0c0c] p-6 sm:p-8 border border-white/10 overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-8 sm:mb-10 relative z-10">
                                        <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                        <h3 className="text-[11px] sm:text-[12px] font-black text-white/90 uppercase tracking-[0.5em] italic">
                                            Skills
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3 sm:gap-4 relative z-10">
                                        {profile.skills.map((skill, i) => (
                                            <div
                                                key={i}
                                                className="group/tag flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/[0.05] border border-white/20 hover:border-[#e87315]/50 transition-all duration-300"
                                            >
                                                <div className="w-1.5 h-1.5 bg-white/30 group-hover/tag:bg-[#e87315] transition-colors" />
                                                <span className="text-[11px] sm:text-[12px] font-bold text-white/60 group-hover/tag:text-white/90 uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                                </div>
                            )}
                        </div>

                        <div className="relative bg-[#0c0c0c] p-6 sm:p-8 border border-white/10 overflow-hidden group">
                            <div className="flex items-center gap-3 mb-8 sm:mb-10 relative z-10">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <h3 className="text-[11px] sm:text-[12px] font-black text-white/90 uppercase tracking-[0.5em] italic">
                                    Quick Info
                                </h3>
                            </div>
                            <div className="space-y-5 sm:space-y-6 relative z-10">
                                <div className="flex justify-between items-end border-b border-white/10 pb-2.5 group/item">
                                    <span className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Role
                                    </span>
                                    <span className="text-[12px] sm:text-[13px] font-black text-white/90 tracking-wider uppercase italic">
                                        {profile.role || 'Member'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-2.5 group/item">
                                    <span className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Projects
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[13px] sm:text-[14px] font-mono font-bold text-white/90 tabular-nums">
                                            {projects.length.toString().padStart(2, '0')}
                                        </span>
                                        <div className="w-8 sm:w-10 h-[2px] bg-white/20" />
                                    </div>
                                </div>
                                {profile.college && (
                                    <div className="flex justify-between items-start border-b border-white/10 pb-2.5 group/item">
                                        <span className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mt-1 group-hover/item:text-[#e87315] transition-colors">
                                            College
                                        </span>
                                        <span className="text-[11px] sm:text-[12px] font-bold text-white/80 text-right max-w-[65%] leading-relaxed uppercase tracking-widest italic">
                                            {profile.college}
                                        </span>
                                    </div>
                                )}
                                {profile.location && (
                                    <div className="flex justify-between items-end border-b border-white/10 pb-2.5 group/item">
                                        <span className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                            Location
                                        </span>
                                        <span className="text-[11px] sm:text-[12px] font-bold text-white/90 tracking-widest uppercase flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#e87315] rounded-full animate-pulse" />
                                            {profile.location}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 border-r border-t border-white/[0.05] -mr-12 -mt-12 rotate-45 pointer-events-none" />
                            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                        </div>
                    </aside>

                    <div className="lg:col-span-8 mt-10 lg:mt-0">
                        <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-12">
                            <div className="w-2.5 h-2.5 bg-[#e87315] rotate-45 animate-pulse" />
                            <h3 className="text-[13px] sm:text-[14px] font-black tracking-[0.5em] uppercase text-white/90 italic">
                                Projects <span className="text-[#e87315] ml-2">[{projects.length.toString().padStart(2, '0')}]</span>
                            </h3>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-white/20 to-transparent" />
                        </div>

                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => navigate(`/dashboard/project/${project._id}`)}
                                        className="group relative bg-[#0c0c0c] border border-white/20 overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#e87315] shadow-2xl"
                                    >
                                        <div className="relative h-48 sm:h-56 overflow-hidden border-b border-white/10">
                                            {project.images?.[0] ? (
                                                <img
                                                    src={project.images[0]}
                                                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                                                    alt={project.title}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#0c0c0c] flex items-center justify-center group-hover:bg-[#111]">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 border border-[#e87315]/40 rotate-45 flex items-center justify-center">
                                                            <span className="text-[#e87315] font-black text-2xl -rotate-45">P</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-90" />
                                            <div className="absolute inset-0 bg-[#e87315]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                                                <span className={`px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-xl ${getStageBadge(project.stage)}`}>
                                                    {project.stage}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 sm:p-8 relative">
                                            <div className="absolute top-0 left-6 sm:left-8 w-10 sm:w-12 h-[2px] bg-[#e87315] -translate-y-1/2 group-hover:w-24 transition-all duration-500" />
                                            <h4 className="text-[15px] sm:text-[16px] font-black text-white/90 uppercase tracking-wider group-hover:text-[#e87315] transition-colors mb-2.5 truncate italic">
                                                {project.title}
                                            </h4>
                                            <p className="text-[11px] sm:text-[12px] text-white/60 font-bold line-clamp-2 mb-6 sm:mb-8 leading-relaxed uppercase tracking-widest italic">
                                                {project.tagline}
                                            </p>
                                            <div className="flex items-center justify-between pt-5 sm:pt-6 border-t border-white/10">
                                                <div className="flex items-center gap-5 sm:gap-6">
                                                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-widest">
                                                        <Eye size={14} className="text-[#e87315]/80 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                                        {project.viewCount || 0}
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-[10px] sm:text-[11px] font-black transition-colors uppercase tracking-widest ${project.likes?.includes(user?._id) ? 'text-[#e87315]' : 'text-white/50'
                                                        }`}>
                                                        <Heart
                                                            size={14}
                                                            className="sm:w-4 sm:h-4"
                                                            strokeWidth={2.5}
                                                            fill={project.likes?.includes(user?._id) ? 'currentColor' : 'none'}
                                                        />
                                                        {project.likes?.length || 0}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase tracking-[0.3em] bg-[#e87315]/10 px-3 py-1 border border-[#e87315]/30 italic">
                                                    {project.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-0 right-0 w-[2px] h-0 bg-gradient-to-b from-[#e87315] to-transparent group-hover:h-full transition-all duration-700" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative group overflow-hidden bg-[#0c0c0c] border border-dashed border-white/20 py-24 sm:py-32 flex flex-col items-center justify-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e87315]/10 via-transparent to-transparent opacity-50" />
                                <p className="relative z-10 text-white/50 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.5em] italic">
                                    No projects posted yet
                                </p>
                                <div className="absolute bottom-5 right-5 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-r-2 border-white/20 group-hover:border-[#e87315]/40 transition-colors" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;