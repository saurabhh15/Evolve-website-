import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { projectAPI, connectionAPI, commentAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import { Heart, Eye, Users, ArrowLeft, ExternalLink, Send, Pencil, Trash2, Zap, X } from 'lucide-react';
import AISuggestionCard from '../../components/shared/AISuggestionCard';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('Overview');
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [showRoleSelector, setShowRoleSelector] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentInput, setCommentInput] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentInput, setEditCommentInput] = useState('');
    const [showMentorModal, setShowMentorModal] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [appliedRoles, setAppliedRoles] = useState(new Set());  
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    // AI Teammates State
    const [aiTeammates, setAiTeammates] = useState([]);
    const [loadingAITeammates, setLoadingAITeammates] = useState(false);
    const [showAITeammates, setShowAITeammates] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectRes, sentRes, commentsRes, networkRes, myApplicationsRes] = await Promise.all([
                    projectAPI.getById(id),
                    connectionAPI.getSent(),
                    commentAPI.getAll(id),
                    connectionAPI.getNetwork(),
                    applicationAPI.getMyApplications()
                ]);
                const p = projectRes.data;
                setProject(p);
                setLikeCount(p.likes?.length || 0);
                setLiked(p.likes?.includes(user?._id));

                const isAccepted = networkRes.data.some(
                    u => u._id.toString() === p.creator?._id?.toString()
                );
                const isPending = sentRes.data.some(
                    c => c.to._id === p.creator?._id &&
                        (c.type === 'peer-request' || c.type === 'mentor-request')
                );
                const appliedToThisProject = new Set(
                    myApplicationsRes.data
                        .filter(a =>
                            (a.project._id === id || a.project === id) &&
                            a.status !== 'rejected' 
                        )
                        .map(a => a.role)
                );

                setAppliedRoles(appliedToThisProject);
                setConnected(isPending && !isAccepted);
                setIsAccepted(isAccepted);
                setComments(commentsRes.data);
                setCommentsLoading(false);
            } catch (err) {
                setError('Failed to load project.');
            } finally {
                setLoading(false);
                setCommentsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (showRoleSelector) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [showRoleSelector]);

    // ✨ BUG FIX: Bulletproof ID comparison logic to ensure it evaluates to TRUE
    const isOwnProject = project && user && 
        (project.creator?._id?.toString() === user._id?.toString() || 
         project.creator?.toString() === user._id?.toString());

    useEffect(() => {
        if (activeSection !== 'Applications' || !isOwnProject) return;
        const load = async () => {
            setApplicationsLoading(true);
            try {
                const res = await applicationAPI.getApplications(id);
                setApplications(res.data);
            } catch (err) {
                console.error('Failed to fetch applications:', err);
            } finally {
                setApplicationsLoading(false);
            }
        };
        load();
    }, [activeSection, isOwnProject]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !id) return;
        socket.emit('join_project', id);
        return () => {
            socket.emit('leave_project', id);
        };
    }, [id]);

    useEffect(() => {
        const handler = (e) => {
            const comment = e.detail;
            if (comment.author?._id === user?._id) return;
            setComments(prev => {
                if (prev.find(c => c._id === comment._id)) return prev;
                return [comment, ...prev];
            });
        };
        window.addEventListener('comment_received', handler);
        return () => window.removeEventListener('comment_received', handler);
    }, [user?._id]);

    useEffect(() => {
        if (showMentorModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showMentorModal]);

    useEffect(() => {
        if (showAboutModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showAboutModal]);

    const handleApplicationStatus = async (applicationId, status) => {
        try {
            await applicationAPI.updateStatus(applicationId, status);
            setApplications(prev =>
                prev.map(a => a._id === applicationId ? { ...a, status } : a)
            );
        } catch (err) {
            console.error('Failed to update application:', err);
        }
    };

    const handleLike = async () => {
        try {
            await projectAPI.toggleLike(id);
            setLiked(prev => !prev);
            setLikeCount(prev => liked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const handleConnect = async () => {
        if (connecting) return;
        setConnecting(true);
        try {
            await applicationAPI.apply(id, {
                role: selectedRole || 'General',
                message: selectedRole
                    ? `Hi ${project.creator.name}, I'm interested in the "${selectedRole}" role for your project "${project.title}"!`
                    : `Hi ${project.creator.name}, I loved your project "${project.title}" and would love to connect!`
            });
            setAppliedRoles(prev => new Set([...prev, selectedRole || 'General']));
            setConnected(true);
            setShowRoleSelector(false);
        } catch (err) {
            if (err.response?.data?.message?.includes('already applied')) {
                setConnected(true);
            }
        } finally {
            setConnecting(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentInput.trim() || commentSubmitting) return;
        setCommentSubmitting(true);
        try {
            const response = await commentAPI.add(id, commentInput.trim());
            setComments(prev => [response.data, ...prev]);
            setCommentInput('');
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editCommentInput.trim()) return;
        try {
            const response = await commentAPI.edit(id, commentId, editCommentInput.trim());
            setComments(prev => prev.map(c => c._id === commentId ? response.data : c));
            setEditingComment(null);
            setEditCommentInput('');
        } catch (err) {
            console.error('Failed to edit comment:', err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentAPI.delete(id, commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const handleFindAITeammates = async () => {
        if (!id) return;
        setLoadingAITeammates(true);
        setShowAITeammates(true);
        try {
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const baseURL = isLocalhost ? 'http://localhost:5000' : 'https://evolve-website.onrender.com';
            const token = localStorage.getItem('token');

            const res = await axios.post(`${baseURL}/api/ai/suggest-teammates/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                withCredentials: true
            });
            setAiTeammates(res.data.suggestions || []);
        } catch (err) {
            console.error("Failed to fetch AI teammates", err);
        } finally {
            setLoadingAITeammates(false);
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

    const getLookingForColor = (item) => {
        switch (item) {
            case 'mentor': return 'bg-purple-500/15 text-purple-300 border-purple-500/25';
            case 'co-founder': return 'bg-blue-500/15 text-blue-300 border-blue-500/25';
            case 'investor': return 'bg-orange-500/15 text-orange-300 border-orange-500/25';
            case 'feedback': return 'bg-green-500/15 text-green-300 border-green-500/25';
            default: return 'bg-white/5 text-gray-400 border-white/10';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
    );

    if (error || !project) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <p className="text-red-400 font-semibold">{error || 'Project not found.'}</p>
        </div>
    );

    const applicableRoles = project.lookingFor?.filter(role => {
        if (user?.role?.toLowerCase() === 'student') {
            return role === 'co-founder' || role === 'team-member';
        }
        return true;
    });

    const mentorComments = comments.filter(c => c.author?.role?.toLowerCase() === 'mentor');
    const userComments = comments.filter(c => c.author?.role?.toLowerCase() !== 'mentor');

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black">
            <div className="sticky top-4 z-25 px-6 pointer-events-none" style={{ marginBottom: '-48px' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 text-[15px] font-bold tracking-widest uppercase text-white/80 hover:text-[#e87315] transition-colors bg-black/40 backdrop-blur-md border border-white/[0.06] px-4 py-2.5 "
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <header className="relative h-[75vh] w-full overflow-hidden border-b border-white/10">
                {project.images?.[0] ? (
                    <img
                        src={project.images[0]}
                        className="absolute inset-0 w-full h-full object-cover brightness-50 grayscale"
                        alt={project.title}
                    />
                ) : (
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
                        <div className="absolute -bottom-20 right-20 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
                        <div className="absolute top-0 right-0 w-64 h-64 border-r border-t border-orange-500/10 rounded-bl-full" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-12 pb-20 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-4 bg-[#e87315]" />
                                <span className={`px-3 py-1 border text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${getStageBadge(project.stage)}`}>
                                    {project.stage || 'Project'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-[#e87315] opacity-40 uppercase tracking-[0.2em]">Category</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                                    {project.category?.replace(/\s+/g, '_')}
                                </span>
                            </div>
                        </div>

                        <div className="relative inline-block mb-8">
                            <span className="absolute -top-12 -left-2 text-[120px] font-black text-white/[0.02] leading-none tracking-tighter italic select-none pointer-events-none">
                                {project.title?.slice(0, 2).toUpperCase()}
                            </span>
                            <h1 className="text-6xl lg:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase text-white relative z-10">
                                {project.title}
                            </h1>
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/20 to-transparent" />
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end gap-8">
                            <p className="text-lg lg:text-2xl font-medium text-white/50 max-w-2xl italic tracking-tight leading-relaxed">
                                {project.tagline}
                            </p>
                        </div>
                    </motion.div>

                    <div className="absolute bottom-10 right-12 hidden lg:block">
                        <div className="relative w-24 h-24 border-r border-b border-white/5">
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#e87315]" />
                            <span className="absolute bottom-6 right-2 text-[8px] font-black text-white/10 [writing-mode:vertical-lr] uppercase tracking-[1em]">
                                Evolve
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="sticky top-0 z-[20] bg-black/80 backdrop-blur-md border-b border-white/[0.03] px-6 lg:px-12 py-4">
                <div className="max-w-7xl mx-30 flex justify-between items-center">
                    <div className="flex gap-10">
                        {['Overview', 'Architecture', 'Team', ...(isOwnProject ? ['Applications'] : [])].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSection(tab)}
                                className={`text-[13px] font-black tracking-[0.5em]  uppercase transition-all relative py-2 group/nav ${activeSection === tab ? 'text-[#e87315]' : 'text-white/20 hover:text-white/60'}`}
                            >
                                {tab}
                                {activeSection === tab && (
                                    <motion.div
                                        layoutId="project_nav"
                                        className="absolute -bottom-[1px] right-1 w-full h-[2px] bg-[#e87315]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-8 border-l border-white/5 pl-8">
                        <div className="flex items-center gap-2.5 group/stat">
                            <div className="relative">
                                <Eye size={19} className="text-white/20 group-hover/stat:text-white transition-colors" />
                                <div className="absolute -top-1 -left-1 w-1 h-1 border-t border-l border-[#e87315] opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[11px] font-black text-white/40 tabular-nums tracking-widest uppercase">
                                {project.viewCount?.toLocaleString() || 0} <span className="text-[8px] opacity-30 ml-1">views</span>
                            </span>
                        </div>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2.5 group/like transition-all ${liked ? 'text-red-500' : 'text-white/20 hover:text-red-400'}`}
                        >
                            <div className="relative">
                                <Heart
                                    size={19}
                                    fill={liked ? 'currentColor' : 'none'}
                                    className="transition-transform duration-300 group-active/like:scale-125"
                                />
                                {liked && (
                                    <div className="absolute -inset-1 border border-red-500/20 animate-ping rounded-full" />
                                )}
                            </div>
                            <span className="text-[11px] font-black tabular-nums tracking-widest uppercase">
                                {likeCount} <span className="text-[8px] opacity-30 ml-1">likes</span>
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-16">
                    <AnimatePresence mode="wait">
                        {activeSection === 'Overview' && (
                            <motion.section
                                key="overview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-20 relative"
                            >
                                <div className="relative group">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-[2px] h-4 bg-[#e87315]" />
                                        <h3 className="text-[#e87315] text-[10px] font-black tracking-[0.6em] uppercase italic">
                                            01 About Project
                                        </h3>
                                    </div>

                                    <p className="text-4xl lg:text-5xl font-black italic tracking-tighter leading-[1.05] uppercase text-white/90 relative z-10 line-clamp-3">
                                        "{project.description || 'Null_Description_Data'}"
                                    </p>

                                    {project.description?.length > 200 && (
                                        <button
                                            onClick={() => setShowAboutModal(true)}
                                            className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#e87315] uppercase tracking-widest hover:gap-4 transition-all"
                                        >
                                            Read Full Description
                                            <div className="h-[1px] w-6 bg-[#e87315]" />
                                        </button>
                                    )}
                                </div>

                                {project.lookingFor?.length > 0 && (
                                    <div className="pt-12 border-t border-white/[0.05] relative">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-[2px] h-4 bg-[#e87315]" />
                                            <h3 className="text-[#e87315] text-[10px] font-black tracking-[0.6em] uppercase italic">
                                                02 Looking for
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {project.lookingFor.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className={`relative px-6 py-3 border transition-all duration-500 group/tag ${getLookingForColor(item)}`}
                                                >
                                                    <div className="absolute top-0 left-0 w-1 h-1 bg-current opacity-40" />
                                                    <span className="text-[11px] font-black tracking-[0.2em] uppercase">
                                                        {item}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-12 border-t border-white/[0.05] grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="relative p-6 border border-white/[0.03] bg-white/[0.01]">
                                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">
                                            Current Project Stage
                                        </h4>
                                        <div className="flex items-baseline gap-3">
                                            <p className="text-3xl font-black italic uppercase text-white tracking-tighter">
                                                {project.stage}
                                            </p>
                                            <span className="text-[8px] font-black text-[#e87315] uppercase animate-pulse">
                                                [Active]
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative p-6 border border-white/[0.03] bg-white/[0.01]">
                                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">
                                            Team size
                                        </h4>
                                        <div className="flex items-baseline gap-3">
                                            <p className="text-3xl font-black italic uppercase text-white tracking-tighter tabular-nums">
                                                {project.teamSize?.toString().padStart(2, '0') || '01'}
                                            </p>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                {project.teamSize === 1 ? 'Student' : 'Students'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {activeSection === 'Architecture' && (
                            <motion.section
                                key="arch"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <h3 className="text-orange-500 text-[10px] font-bold tracking-[0.5em] uppercase italic"> Tech Stack</h3>
                                {project.tags?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                        {project.tags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="bg-[#050505] p-10 text-2xl font-black italic uppercase hover:text-orange-500 hover:bg-white/[0.02] transition-all flex items-center justify-center text-center"
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/20 text-sm italic">No tech stack listed yet.</p>
                                )}
                            </motion.section>
                        )}

                        {activeSection === 'Team' && (
                            <motion.section
                                key="team"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <h3 className="text-orange-500 text-[10px] font-bold tracking-[0.5em] uppercase italic"> Team</h3>
                                {project.teamMembers?.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.teamMembers.map((member, i) => (
                                            <div
                                                key={i}
                                                onClick={() => navigate(`/dashboard/user/${member._id}`)}
                                                className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-orange-500/20 transition-all cursor-pointer group"
                                            >
                                                <img
                                                    src={member.profileImage}
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${member.name}&bold=true`;
                                                    }}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                    alt={member.name}
                                                />
                                                <div>
                                                    <p className="text-sm font-black text-white group-hover:text-orange-500 transition-colors">{member.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/20 text-sm italic">No team members added yet.</p>
                                )}

                                {/* AI TEAMMATE FINDER SECTION FOR CREATOR */}
                                {isOwnProject && (
                                    <div className="mt-12 pt-12 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-[2px] h-4 bg-[#e87315]" />
                                                <h3 className="text-[#e87315] text-[10px] font-black tracking-[0.6em] uppercase italic">
                                                    Find Teammates
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {showAITeammates && (
                                                    <button
                                                        onClick={() => setShowAITeammates(false)}
                                                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/30 hover:bg-red-500/[0.08] text-white/40 hover:text-red-400 transition-all text-[9px] font-black uppercase tracking-widest"
                                                    >
                                                        <X size={14} /> Clear
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleFindAITeammates}
                                                    className="flex items-center gap-2 px-6 py-3 bg-[#e87315]/10 border border-[#e87315]/30 text-[#e87315] hover:bg-[#e87315] hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                                                >
                                                    <Zap size={14} />
                                                    {showAITeammates ? 'Refresh Match' : 'AI Match'}
                                                </button>
                                            </div>
                                        </div>

                                        {showAITeammates && (
                                            <div className="space-y-6">
                                                {loadingAITeammates ? (
                                                    <div className="flex flex-col items-center justify-center py-24 gap-6 border border-white/5 bg-white/[0.01]">
                                                        <div className="relative w-16 h-16">
                                                            <div className="absolute inset-0 border border-[#e87315]/15 animate-ping" style={{ animationDuration: '2s' }} />
                                                            <div className="absolute inset-0 border-2 border-t-[#e87315] border-r-[#e87315]/20 border-b-[#e87315]/10 border-l-[#e87315]/30 rounded-full animate-spin" />
                                                            <div className="absolute inset-[5px] border border-[#e87315]/20 rotate-45 animate-pulse" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Zap size={16} className="text-[#e87315]/60" />
                                                            </div>
                                                        </div>
                                                        <div className="text-center space-y-2">
                                                            <p className="text-[12px] font-black text-[#e87315] uppercase tracking-[0.5em] italic animate-pulse">Running AI Vectors...</p>
                                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Scanning candidates & computing alignment</p>
                                                        </div>
                                                    </div>
                                                ) : aiTeammates.length > 0 ? (
                                                    <div className="flex flex-col gap-6">
                                                        {aiTeammates.map((s, i) => (
                                                            <AISuggestionCard key={i} suggestion={s} type="teammate" projectId={id} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-24 border border-dashed border-white/10 bg-white/[0.01]">
                                                        <p className="text-[12px] font-black text-white/50 uppercase tracking-[0.5em] italic">No Strong AI Matches</p>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-3">Try editing your project looking for tags</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {activeSection === 'Applications' && isOwnProject && (
                            <motion.section
                                key="applications"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-[2px] h-4 bg-[#e87315]" />
                                    <h3 className="text-[#e87315] text-[10px] font-black tracking-[0.6em] uppercase italic">
                                        Applications ({applications.length})
                                    </h3>
                                </div>

                                {applicationsLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-24 bg-white/[0.02] border border-white/5 animate-pulse" />
                                    ))
                                ) : applications.length > 0 ? (
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                                        onWheel={(e) => e.stopPropagation()}
                                    >
                                        {applications.map(app => (
                                            <div
                                                key={app._id}
                                                className="relative bg-[#080808] border border-white/[0.03] p-6 group overflow-hidden"
                                            >
                                                <div className={`absolute top-0 left-0 w-[2px] h-full ${app.status === 'accepted' ? 'bg-green-500' :
                                                    app.status === 'rejected' ? 'bg-red-500' : 'bg-[#e87315]'}`} />

                                                <div className="flex items-start gap-5 pl-4">
                                                    <img
                                                        src={app.applicant?.profileImage}
                                                        onError={e => {
                                                            e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${app.applicant?.name}&bold=true`;
                                                        }}
                                                        onClick={() => navigate(`/dashboard/user/${app.applicant?._id}`)}
                                                        className="w-12 h-12 object-cover border border-white/10 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                                                        alt={app.applicant?.name}
                                                    />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-1">
                                                            <p
                                                                onClick={() => navigate(`/dashboard/user/${app.applicant?._id}`)}
                                                                className="text-sm font-black text-white hover:text-[#e87315] transition-colors cursor-pointer uppercase tracking-tight"
                                                            >
                                                                {app.applicant?.name}
                                                            </p>
                                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest shrink-0">
                                                                {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>

                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">
                                                            {app.applicant?.college || app.applicant?.role}
                                                        </p>

                                                        <div className="inline-flex items-center gap-2 mb-3">
                                                            <span className="text-[9px] font-black text-[#e87315] uppercase tracking-widest">
                                                                Applied for:
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-[#e87315]/10 border border-[#e87315]/20 text-[9px] font-black text-[#e87315] uppercase tracking-widest">
                                                                {app.role}
                                                            </span>
                                                        </div>

                                                        {app.message && (
                                                            <p className="text-xs text-white/40 italic leading-relaxed mb-4">
                                                                "{app.message}"
                                                            </p>
                                                        )}

                                                        {app.status === 'pending' ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleApplicationStatus(app._id, 'accepted')}
                                                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#e87315] hover:bg-[#f97316] text-black text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleApplicationStatus(app._id, 'rejected')}
                                                                    className="flex items-center gap-1.5 px-4 py-2 bg-transparent hover:bg-red-500/10 text-white/30 hover:text-red-400 text-[9px] font-black uppercase tracking-widest border border-white/5 hover:border-red-500/25 transition-all active:scale-95"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                                                - {app.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-1 h-1 bg-white/5 group-hover:bg-[#e87315] transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="relative text-center py-20 border border-dashed border-white/[0.03]">
                                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">
                                            No applications yet
                                        </h3>
                                        <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.2em] mt-2">
                                            Applications will appear here when someone applies for a role
                                        </p>
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                <aside className="lg:col-span-4 h-fit space-y-4">
                    <div className="relative bg-[#080808] p-7 border border-white/[0.03] group overflow-hidden">
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-1 h-3.5 bg-[#e87315]" />
                            <h4 className="text-[10px] font-black tracking-[0.5em] uppercase text-[#e87315] italic">
                                Creator
                            </h4>
                        </div>

                        <div
                            onClick={() => navigate(`/dashboard/user/${project.creator?._id}`)}
                            className="flex items-center gap-5 mb-10 cursor-pointer group/author relative z-10"
                        >
                            <div className="relative flex-shrink-0">
                                <img
                                    src={project.creator?.profileImage || `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${project.creator?.name}&bold=true`}
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${project.creator?.name}&bold=true`; }}
                                    className="w-16 h-16 object-cover border border-white/10 group-hover/author:border-[#e87315]/50 transition-all duration-500"
                                    alt={project.creator?.name}
                                />
                                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315] opacity-0 group-hover/author:opacity-100 transition-opacity" />
                            </div>

                            <div>
                                <p className="text-xl font-black italic uppercase text-white group-hover/author:text-[#e87315] transition-colors tracking-tighter leading-none mb-1">
                                    {project.creator?.name}
                                </p>
                                <p className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase mb-1">
                                    {project.creator?.role}
                                </p>
                                {project.creator?.college && (
                                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest leading-none">
                                        {project.creator.college}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:border-white/20 transition-all"
                                >
                                    <ExternalLink size={10} /> Live
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:border-white/20 transition-all"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg> GitHub
                                </a>
                            )}
                        </div>

                        <div className="relative z-10 space-y-2">
                            {!isOwnProject && (
                                isAccepted ? (
                                    <>
                                        <button
                                            onClick={() => navigate('/dashboard/messages')}
                                            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.5em] transition-all bg-[#e87315] hover:bg-[#ff7e1a] text-black italic"
                                        >
                                            Send Message
                                        </button>
                                        {applicableRoles?.length > 0 && (
                                            appliedRoles.size > 0 ? (
                                                <button
                                                    disabled
                                                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] bg-green-500/5 text-green-500 border border-green-500/20 cursor-default italic"
                                                >
                                                    - Already Applied
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setShowRoleSelector(true)}
                                                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all bg-white/[0.03] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/20 italic"
                                                >
                                                    Apply for Role
                                                </button>
                                            )
                                        )}
                                    </>
                                ) : (
                                    appliedRoles.size > 0 ? (
                                        <button
                                            disabled
                                            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] bg-green-500/5 text-green-500 border border-green-500/20 cursor-default italic"
                                        >
                                            - Already Applied
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowRoleSelector(true)}
                                            disabled={connecting}
                                            className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${connecting
                                                ? 'bg-[#e87315]/20 text-white border-[#e87315]/40 cursor-wait animate-pulse'
                                                : 'bg-white text-black border-transparent hover:bg-[#e87315] hover:text-white italic'
                                                }`}
                                        >
                                            {connecting ? 'Applying...' : 'Apply for Role'}
                                        </button>
                                    )
                                )
                            )}

                            {isOwnProject && (
                                <button
                                    onClick={() => navigate('/dashboard/project')}
                                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all bg-white/[0.03] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/20 italic"
                                >
                                    Manage Project
                                </button>
                            )}
                        </div>

                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    <div className="relative bg-[#080808] p-7 border border-white/[0.03] group overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-1 h-3.5 bg-[#e87315]" />
                            <h4 className="text-[10px] font-black tracking-[0.5em] uppercase text-white/40 italic">
                                Key Stats.
                            </h4>
                        </div>

                        <div className="space-y-4 text-[11px] font-black tracking-widest uppercase tabular-nums relative z-10">
                            <div className="flex justify-between items-center group/stat">
                                <span className="text-white/20 group-hover/stat:text-white/40 transition-colors">VIEWS </span>
                                <span className="text-white bg-white/[0.03] px-2 py-0.5 border border-white/5">
                                    {project.viewCount?.toLocaleString() || 0}
                                </span>
                            </div>

                            <div className="flex justify-between items-center group/stat">
                                <span className="text-white/20 group-hover/stat:text-white/40 transition-colors">LIKES </span>
                                <span className="text-white bg-white/[0.03] px-2 py-0.5 border border-white/5">
                                    {likeCount}
                                </span>
                            </div>

                            <div className="flex justify-between items-center group/stat">
                                <span className="text-white/20 group-hover/stat:text-white/40 transition-colors">TEAM SIZE </span>
                                <span className="text-white bg-white/[0.03] px-2 py-0.5 border border-white/5">
                                    {project.teamSize || 1}
                                </span>
                            </div>

                            <div className="flex justify-between items-center group/stat pt-2">
                                <span className="text-white/20 group-hover/stat:text-white/40 transition-colors">CATEGORY </span>
                                <span className="text-[#e87315] font-black text-[9px] tracking-[0.2em] border border-[#e87315]/20 px-3 py-1 bg-[#e87315]/[0.02]">
                                    {project.category}
                                </span>
                            </div>
                        </div>

                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>
                </aside>

                <div className="col-span-12 mt-8 border-t border-white/5 pt-12">
                    {mentorComments.filter(c => c.author?.role === 'mentor').length > 0 && (
                        <div className="mb-12 p-6 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent border-2 border-purple-500/20 rounded-3xl relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-400">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">Mentor Feedback Zone</h4>
                                    <p className="text-xs text-purple-300/70 font-medium">
                                        Expert insights from verified mentors
                                    </p>
                                </div>
                                <span className="ml-auto px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-black text-purple-400">
                                    {comments.filter(c => c.author?.role === 'mentor').length} {comments.filter(c => c.author?.role === 'mentor').length === 1 ? 'Mentor Insight' : 'Mentors Insights'}
                                </span>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {comments
                                    .filter(c => c.author?.role === 'mentor')
                                    .slice(0, 3) 
                                    .map((comment) => (
                                        <div key={comment._id} className="group p-5 bg-black/40 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/30 rounded-2xl transition-all">
                                            <div className="flex gap-4">
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={comment.author?.profileImage}
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?background=6b21a8&color=fff&size=100&name=${comment.author?.name}&bold=true`;
                                                        }}
                                                        onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)}
                                                        className="w-12 h-12 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-purple-500/20"
                                                        alt={comment.author?.name}
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-md flex items-center justify-center border-2 border-black">
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span
                                                            onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)}
                                                            className="text-sm font-black text-white hover:text-purple-400 transition-colors cursor-pointer"
                                                        >
                                                            {comment.author?.name}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-[9px] font-black text-purple-300 uppercase tracking-widest">
                                                            - Mentor
                                                        </span>
                                                        <span className="text-[10px] text-gray-600">
                                                            {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {comments.filter(c => c.author?.role === 'mentor').length > 3 && (
                                <button
                                    onClick={() => setShowMentorModal(true)}
                                    className="mt-4 w-full py-2.5 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-black text-purple-400 uppercase tracking-widest transition-all"
                                >
                                    View All {comments.filter(c => c.author?.role === 'mentor').length} Mentor Feedbacks
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 mb-10">
                        <img
                            src={user?.profileImage}
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${user?.name}&bold=true`;
                            }}
                            className="w-12 h-12 border border-white/10 object-cover flex-shrink-0  hover:grayscale-0 transition-all duration-500"
                            alt={user?.name}
                        />
                        <div className="flex-1 relative group/input">
                            <div className="absolute -top-[1px] -left-[1px] w-1 h-1 bg-[#e87315] opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                            <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 bg-[#e87315] opacity-0 group-focus-within/input:opacity-100 transition-opacity" />

                            <textarea
                                value={commentInput}
                                onChange={e => setCommentInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                                placeholder="Enter Comment"
                                rows={3}
                                className="w-full px-5 py-4 bg-[#080808] border border-white/5 hover:border-white/10 focus:border-[#e87315]/30 text-white text-[13px] focus:outline-none transition-all resize-none pr-16 placeholder:text-white/10 placeholder:uppercase placeholder:tracking-[0.2em] font-medium"
                            />

                            <button
                                onClick={handleAddComment}
                                disabled={commentSubmitting || !commentInput.trim()}
                                className="absolute right-4 bottom-4 p-2.5 bg-transparent border border-[#e87315] hover:bg-[#e87315] disabled:opacity-20 disabled:grayscale transition-all duration-300 group/send"
                            >
                                {commentSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-[#e87315]/20 border-t-[#e87315] rounded-full animate-spin" />
                                ) : (
                                    <Send size={14} className="text-[#ffffff] group-hover:text-black transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div id="all-comments" className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">
                                Student Comments ({userComments.length})
                            </h4>
                        </div>

                        {commentsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4 animate-pulse">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-white/[0.04] rounded w-32" />
                                            <div className="h-4 bg-white/[0.04] rounded w-full" />
                                            <div className="h-4 bg-white/[0.04] rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : comments.length > 0 ? userComments.map((comment) => {
                            const isMentor = comment.author?.role === 'mentor';
                            const isInvestor = comment.author?.role === 'investor';

                            return (
                                <div
                                    key={comment._id}
                                    className={`flex gap-6 group p-6 transition-all duration-500 relative border-l-2 ${isMentor
                                        ? 'bg-purple-500/[0.02] border-purple-500/40 hover:bg-purple-500/[0.04]'
                                        : isInvestor
                                            ? 'bg-green-500/[0.02] border-green-500/40 hover:bg-green-500/[0.04]'
                                            : 'bg-white/[0.01] border-white/5 hover:border-[#e87315]/30'
                                        }`}
                                >
                                    {(isMentor || isInvestor) && (
                                        <div className="absolute top-0 right-0 px-3 py-1 flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full animate-pulse ${isMentor ? 'bg-purple-400' : 'bg-green-400'}`} />
                                            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${isMentor ? 'text-purple-400' : 'text-green-400'}`}>
                                                {isMentor ? 'Verified Mentor' : 'Verified Investor'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={comment.author?.profileImage}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?background=${isMentor ? '6b21a8' : isInvestor ? '22c55e' : '080808'
                                                    }&color=fff&size=100&name=${comment.author?.name}&bold=true`;
                                            }}
                                            onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)}
                                            className={`w-12 h-12 border object-cover cursor-pointer transition-all duration-500 ${isMentor
                                                ? 'border-purple-500/50 grayscale-0'
                                                : isInvestor
                                                    ? 'border-green-500/50 grayscale-0'
                                                    : 'border-white/10 grayscale group-hover:grayscale-0'
                                                }`}
                                            alt={comment.author?.name}
                                        />

                                        <div className={`absolute -top-1 -left-1 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity ${isMentor ? 'border-purple-400' : isInvestor ? 'border-green-400' : 'border-[#e87315]'
                                            }`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)}
                                                    className={`text-sm font-black hover:text-orange-500 transition-colors cursor-pointer ${isMentor ? 'text-purple-300' : isInvestor ? 'text-green-300' : 'text-white'
                                                        }`}
                                                >
                                                    {comment.author?.name}
                                                </span>

                                                {isMentor && (
                                                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-[9px] font-black text-purple-300 uppercase tracking-widest">
                                                        - Mentor
                                                    </span>
                                                )}
                                                {isInvestor && (
                                                    <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-[9px] font-black text-green-300 uppercase tracking-widest">
                                                        - Investor
                                                    </span>
                                                )}

                                                <span className="text-[10px] text-gray-600">
                                                    {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                {comment.isEdited && (
                                                    <span className="text-[13px] text-gray-600 italic">· edited</span>
                                                )}
                                            </div>

                                            {(comment.author?._id === user?._id || project.creator?._id === user?._id) && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {comment.author?._id === user?._id && (
                                                        <button
                                                            onClick={() => {
                                                                setEditingComment(comment._id);
                                                                setEditCommentInput(comment.content);
                                                            }}
                                                            className="p-1.5 hover:bg-white/[0.05] rounded-lg text-gray-600 hover:text-white transition-all"
                                                        >
                                                            <Pencil size={12} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {editingComment === comment._id ? (
                                            <div className="space-y-4 w-full">
                                                <textarea
                                                    value={editCommentInput}
                                                    onChange={e => setEditCommentInput(e.target.value)}
                                                    rows={3}
                                                    className="w-full px-5 py-4 bg-[#080808] border border-[#e87315]/40 text-white text-[13px] focus:outline-none resize-none font-medium transition-all"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleEditComment(comment._id)}
                                                        className="group/save relative px-5 py-2 overflow-hidden border border-[#e87315] bg-transparent transition-colors duration-300"
                                                    >
                                                        <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/save:translate-y-0 transition-transform duration-300 ease-out" />
                                                        <div className="relative z-10 flex items-center justify-center gap-2 text-[#e87315] group-hover/save:text-black transition-colors duration-300">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                                                Update Comment
                                                            </span>
                                                        </div>
                                                        <div className="absolute top-0 right-0 w-1 h-1 bg-[#e87315] group-hover/save:bg-black" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingComment(null); setEditCommentInput(''); }}
                                                        className="px-6 py-2 border border-white/10 hover:border-white/20 text-white/40 hover:text-white transition-all"
                                                    >
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <p className={`text-[13px] leading-relaxed tracking-tight ${isMentor ? 'text-purple-100/90' : isInvestor ? 'text-green-100/90' : 'text-white/60'
                                                    }`}>
                                                    {comment.content}
                                                </p>
                                                <div className={`mt-4 w-8 h-[1px] ${isMentor ? 'bg-purple-500/20' : isInvestor ? 'bg-green-500/20' : 'bg-white/5'
                                                    }`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="relative text-center py-20 border border-dashed border-white/[0.03] group overflow-hidden">
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center mb-2 group-hover:border-[#e87315]/30 transition-colors duration-500">
                                        <div className="w-1 h-1 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                        It's Empty here
                                    </h3>
                                    <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.2em] max-w-[240px] leading-relaxed">
                                        Write the first comment.
                                    </p>
                                </div>
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-white/10" />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="p-10 border-t border-white/5 opacity-10 text-center">
                <p className="text-[8px] font-bold tracking-[1em] uppercase">EVOLVE 2026</p>
            </footer>

            {showRoleSelector && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md"
                    onClick={() => setShowRoleSelector(false)}
                >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e87315]/10 rounded-full blur-[120px]" />
                    </div>

                    <div
                        className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#e87315]" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#e87315]" />

                        <div className="p-8">
                            <header className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1 h-4 bg-[#e87315]" />
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">
                                        Connect with Creator
                                    </h3>
                                </div>
                                <p className="text-[13px] text-white/40 font-medium italic">
                                    What role are you interested in?
                                </p>
                            </header>

                            <div className="space-y-3 mb-10">
                                {applicableRoles?.length > 0 ? (
                                    <>
                                        {applicableRoles?.map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setSelectedRole(role)}
                                                className={`group relative w-full px-5 py-4 border transition-all duration-300 text-left overflow-hidden ${selectedRole === role
                                                    ? 'border-[#e87315] bg-[#e87315]/5'
                                                    : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === role ? 'text-[#e87315]' : 'text-white/60 group-hover:text-white'
                                                        }`}>
                                                        {role}
                                                    </span>
                                                    {selectedRole === role && (
                                                        <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45 shadow-[0_0_10px_#e87315]" />
                                                    )}
                                                </div>
                                                {selectedRole === role && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#e87315]" />
                                                )}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setSelectedRole('')}
                                            className={`group relative w-full px-5 py-4 border transition-all duration-300 text-left ${selectedRole === ''
                                                ? 'border-[#e87315] bg-[#e87315]/5'
                                                : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                                }`}
                                        >
                                            <div className="relative z-10 flex items-center justify-between">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === '' ? 'text-[#e87315]' : 'text-white/60 group-hover:text-white'
                                                    }`}>
                                                    General Connection
                                                </span>
                                                {selectedRole === '' && (
                                                    <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45 shadow-[0_0_10px_#e87315]" />
                                                )}
                                            </div>
                                            {selectedRole === '' && (
                                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#e87315]" />
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <div className="py-8 text-center border border-dashed border-white/10">
                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                                            No specific roles listed
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowRoleSelector(false)}
                                    className="order-2 sm:order-1 flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white border border-white/5 hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                {applicableRoles?.length > 0 && (
                                    <button
                                        onClick={handleConnect}
                                        disabled={connecting}
                                        className="order-1 sm:order-2 flex-[1.5] py-4 bg-white text-black hover:bg-[#e87315] hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all relative group"
                                    >
                                        <span className="relative z-10">
                                            {connecting ? 'Applying...' : 'Submit Application'}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10">
                            <div className="absolute bottom-2 right-2 w-4 h-[1px] bg-white rotate-45" />
                            <div className="absolute bottom-2 right-2 w-1 h-4 bg-white" />
                        </div>
                    </div>
                </div>
            )}

            {showMentorModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md"
                    onClick={() => setShowMentorModal(false)}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        className="relative bg-[#0a0a0a] border border-purple-500/20 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-500" />

                        <div className="flex items-center justify-between px-8 py-6 border-b border-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-400">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">All Mentor Feedback</h4>
                                    <p className="text-[10px] text-purple-300/70 font-medium">
                                        {comments.filter(c => c.author?.role === 'mentor').length} expert insights
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowMentorModal(false)}
                                className="p-2 border border-purple-500/20 hover:border-purple-500/50 text-purple-400/50 hover:text-purple-400 transition-all"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 mentor-scroll"
                            style={{ overscrollBehavior: 'contain' }}
                        >
                            {comments
                                .filter(c => c.author?.role === 'mentor')
                                .map((comment) => (
                                    <div key={comment._id} className="group p-5 bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition-all">
                                        <div className="flex gap-4">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={comment.author?.profileImage}
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?background=6b21a8&color=fff&size=100&name=${comment.author?.name}&bold=true`;
                                                    }}
                                                    onClick={() => { navigate(`/dashboard/user/${comment.author?._id}`); setShowMentorModal(false); }}
                                                    className="w-12 h-12 object-cover cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-purple-500/20"
                                                    alt={comment.author?.name}
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-md flex items-center justify-center border-2 border-black">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span
                                                        onClick={() => { navigate(`/dashboard/user/${comment.author?._id}`); setShowMentorModal(false); }}
                                                        className="text-sm font-black text-white hover:text-purple-400 transition-colors cursor-pointer"
                                                    >
                                                        {comment.author?.name}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-[9px] font-black text-purple-300 uppercase tracking-widest">
                                                        - Mentor
                                                    </span>
                                                    <span className="text-[10px] text-gray-600">
                                                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {showAboutModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md"
                    onClick={() => setShowAboutModal(false)}
                    onWheel={e => e.stopPropagation()}
                >
                    <div
                        className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                        onWheel={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#e87315]" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#e87315]" />

                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-4 bg-[#e87315]" />
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">About Project</h4>
                                    <p className="text-[10px] text-white/30 font-medium mt-0.5 uppercase tracking-widest">{project.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAboutModal(false)}
                                className="p-2 border border-white/10 hover:border-[#e87315]/50 text-white/30 hover:text-white transition-all"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar"
                            style={{ overscrollBehavior: 'contain' }}
                            onWheel={e => e.stopPropagation()}
                        >
                            <p className="text-base text-white/70 leading-relaxed font-medium">
                                {project.description}
                            </p>
                        </div>

                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#e87315]" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;