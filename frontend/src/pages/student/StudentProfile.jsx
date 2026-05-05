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
            case 'idea': return 'bg-purple-500 text-white';
            case 'prototype': return 'bg-blue-500 text-white';
            case 'mvp': return 'bg-orange-500 text-black';
            case 'launched': return 'bg-green-500 text-white';
            default: return 'bg-gray-600 text-white';
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
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <p className="text-red-400 font-semibold">{error || 'Profile not found.'}</p>
        </div>
    );

    const isOwnProfile = profile._id === user?._id;

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden">
            <div className="sticky top-4 z-50 px-4 sm:px-6 pointer-events-none" style={{ marginBottom: '-48px' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 text-[14px] sm:text-[17px] font-bold tracking-widest uppercase text-white/50 hover:text-[#e87315] transition-colors bg-black/40 backdrop-blur-md border border-white/[0.06] px-4 py-2 sm:py-2.5 rounded-xs"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                {profile.coverImage ? (
                    <img
                        src={profile.coverImage}
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="relative -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 pb-8 border-b border-white/[0.04]">
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-4 border-[#050505] shadow-2xl">
                            <img
                                src={getDisplayImage()}
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${profile.name}&bold=true`;
                                }}
                                className="w-full h-full object-cover"
                                alt={profile.name}
                            />
                        </div>
                        <div className={`absolute -bottom-2 -right-2 px-2 py-1 text-[7px] font-black uppercase tracking-widest rounded-sm ${profile.role === 'Mentor'
                            ? 'bg-[#e87315] text-black'
                            : profile.role === 'Investor'
                                ? 'bg-green-500 text-black'
                                : 'bg-white/10 text-white'
                            }`}>
                            {profile.role || 'Member'}
                        </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-2 text-center md:text-left">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">{profile.name}</h1>
                            <p className="text-xs font-bold text-[#e87315] uppercase tracking-widest mt-0.5">
                                {(profile.role || 'member').toUpperCase()} 
                                {profile.gender ? ` / ${profile.gender.toUpperCase()}` : ''}
                            </p>
                            {profile.college && (
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">{profile.college}</p>
                            )}
                            {profile.location && (
                                <div className="flex items-center justify-center md:justify-start gap-1.5 text-white/30 mt-1.5">
                                    <MapPin size={11} />
                                    <span className="text-[10px] font-medium">{profile.location}</span>
                                </div>
                            )}
                        </div>

                        {!isOwnProfile && (
                            <div className="relative group/action flex items-center w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0">
                                {isAccepted ? (
                                    <button
                                        onClick={() => navigate('/dashboard/messages')}
                                        className="relative flex justify-center items-center gap-3 w-full md:w-auto px-8 py-3.5 sm:py-4 bg-[#e87315] overflow-hidden transition-all duration-300 group/msg"
                                    >
                                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/msg:translate-x-0 transition-transform duration-500" />
                                        <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-black flex items-center gap-2">
                                            <MessageSquare size={14} strokeWidth={3} />
                                            Send Message
                                        </span>
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-black/20" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleConnect}
                                        disabled={connected || connecting}
                                        className={`relative flex justify-center items-center gap-3 w-full md:w-auto px-8 py-3.5 sm:py-4 border overflow-hidden transition-all duration-500 ${connected
                                            ? 'bg-green-500/5 border-green-500/30 text-green-400'
                                            : 'bg-transparent border-[#e87315] text-[#e87315]'
                                            }`}
                                    >
                                        {!connected && !connecting && (
                                            <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/action:translate-y-0 transition-transform duration-300 ease-out" />
                                        )}
                                        <div className={`relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300 ${!connected && !connecting && 'group-hover/action:text-black'
                                            }`}>
                                            {connecting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    <span>Linking...</span>
                                                </div>
                                            ) : connected ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                                    <span>Request_Sent</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <UserPlus size={14} strokeWidth={3} />
                                                    <span>Connect</span>
                                                </>
                                            )}
                                        </div>
                                        <div className={`absolute top-0 right-0 w-1.5 h-1.5 transition-colors ${connected ? 'bg-green-500/50' : 'bg-[#e87315] group-hover/action:bg-black'
                                            }`} />
                                    </button>
                                )}
                            </div>
                        )}

                        {isOwnProfile && (
                            <button
                                onClick={() => navigate('/dashboard/myprofile')}
                                className="relative group/edit flex items-center justify-center w-full md:w-auto overflow-hidden px-8 py-3.5 sm:py-4 mt-4 md:mt-0 bg-white/[0.02] border border-white/10 hover:border-[#e87315]/40 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-[#e87315]/[0.03] translate-y-full group-hover/edit:translate-y-0 transition-transform duration-500 ease-out" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <Settings size={14} className="text-[#e87315] group-hover/edit:rotate-90 transition-transform duration-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 group-hover/edit:text-white transition-colors">
                                        Edit Profile
                                    </span>
                                </div>
                                <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315] opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/20" />
                                <div className="absolute top-0 right-0 w-[1px] h-0 bg-[#e87315] group-hover/edit:h-full transition-all duration-500" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                    {profile.linkedIn && (
                        <a
                            href={profile.linkedIn}
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

                    {profile.github && (
                        <a
                            href={profile.github}
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

                    {profile.website && (
                        <a
                            href={profile.website}
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-10">
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="space-y-6">
                            {profile.bio && (
                                <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-6 relative z-10">
                                        <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                            Bio
                                        </h3>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[13px] text-white/60 leading-relaxed font-medium italic">
                                            {profile.bio}
                                        </p>
                                    </div>
                                    <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                                </div>
                            )}

                            {profile.skills?.length > 0 && (
                                <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-8 relative z-10">
                                        <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                            Skills
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3 relative z-10">
                                        {profile.skills.map((skill, i) => (
                                            <div
                                                key={i}
                                                className="group/tag flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-[#e87315]/40 transition-all duration-300"
                                            >
                                                <div className="w-1 h-1 bg-white/20 group-hover/tag:bg-[#e87315] transition-colors" />
                                                <span className="text-[11px] font-bold text-white/40 group-hover/tag:text-white uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                                </div>
                            )}
                        </div>

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
                                        Role
                                    </span>
                                    <span className="text-[12px] font-mono text-white tracking-wider uppercase">
                                        {profile.role || 'Member'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                        Projects
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-mono text-white">
                                            {projects.length.toString().padStart(2, '0')}
                                        </span>
                                        <div className="w-8 h-[1px] bg-white/10" />
                                    </div>
                                </div>
                                {profile.college && (
                                    <div className="flex justify-between items-start border-b border-white/[0.03] pb-2 group/item">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mt-1 group-hover/item:text-[#e87315] transition-colors">
                                            College
                                        </span>
                                        <span className="text-[11px] font-medium text-white text-right max-w-[65%] leading-relaxed italic">
                                            {profile.college}
                                        </span>
                                    </div>
                                )}
                                {profile.location && (
                                    <div className="flex justify-between items-end border-b border-white/[0.03] pb-2 group/item">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover/item:text-[#e87315] transition-colors">
                                            Location
                                        </span>
                                        <span className="text-[11px] font-bold text-white tracking-widest uppercase flex items-center gap-2">
                                            <span className="w-1 h-1 bg-[#e87315] rounded-full animate-pulse" />
                                            {profile.location}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-white/[0.02] -mr-12 -mt-12 rotate-45 pointer-events-none" />
                            <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                        </div>
                    </aside>

                    <div className="lg:col-span-8 mt-6 lg:mt-0">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-2 h-2 bg-[#e87315] rotate-45 animate-pulse" />
                            <h3 className="text-[12px] font-black tracking-[0.5em] uppercase text-white italic">
                                Projects <span className="text-[#e87315] ml-2">[{projects.length.toString().padStart(2, '0')}]</span>
                            </h3>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => navigate(`/dashboard/project/${project._id}`)}
                                        className="group relative bg-[#080808] border border-white/[0.03] overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#e87315]/40 shadow-2xl"
                                    >
                                        <div className="relative h-44 overflow-hidden">
                                            {project.images?.[0] ? (
                                                <img
                                                    src={project.images[0]}
                                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                                                    alt={project.title}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#0c0c0c] flex items-center justify-center group-hover:bg-[#111]">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 border border-[#e87315]/20 rotate-45 flex items-center justify-center">
                                                            <span className="text-[#e87315] font-black text-xl -rotate-45">P</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
                                            <div className="absolute inset-0 bg-[#e87315]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/10 shadow-xl ${getStageBadge(project.stage)}`}>
                                                    {project.stage}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 relative">
                                            <div className="absolute top-0 left-5 w-8 h-[2px] bg-[#e87315] -translate-y-1/2 group-hover:w-20 transition-all duration-500" />
                                            <h4 className="text-[14px] font-black text-white uppercase tracking-wider group-hover:text-[#e87315] transition-colors mb-2 truncate">
                                                {project.title}
                                            </h4>
                                            <p className="text-[11px] text-white/40 font-medium line-clamp-2 mb-5 leading-relaxed italic">
                                                {project.tagline}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-white/30 group-hover:text-white/60 transition-colors">
                                                        <Eye size={12} className="text-[#e87315]/60" />
                                                        {project.viewCount || 0}
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 text-[9px] font-black transition-colors ${project.likes?.includes(user?._id) ? 'text-[#e87315]' : 'text-white/30'
                                                        }`}>
                                                        <Heart
                                                            size={12}
                                                            fill={project.likes?.includes(user?._id) ? 'currentColor' : 'none'}
                                                        />
                                                        {project.likes?.length || 0}
                                                    </div>
                                                </div>
                                                <span className="text-[8px] font-black text-[#e87315] uppercase tracking-[0.2em] bg-[#e87315]/5 px-2 py-0.5 border border-[#e87315]/10">
                                                    {project.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-0 right-0 w-[1px] h-0 bg-gradient-to-b from-[#e87315] to-transparent group-hover:h-full transition-all duration-700" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative group overflow-hidden bg-[#080808] border border-white/[0.03] py-24 flex flex-col items-center justify-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e87315]/5 via-transparent to-transparent" />
                                <p className="relative z-10 text-white/20 text-[10px] font-black uppercase tracking-[0.5em] italic">
                                    No projects posted yet
                                </p>
                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/5 group-hover:border-[#e87315]/20 transition-colors" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;