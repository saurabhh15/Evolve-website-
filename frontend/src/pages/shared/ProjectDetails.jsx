import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectAPI, connectionAPI, commentAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import { Heart, Eye, Users, ArrowLeft, ExternalLink, Send, Pencil, Trash2, Sparkles, Loader2, X, Zap, MapPin, Star, Cat } from 'lucide-react';

// ── AI Suggestion Card (Architect Theme) ────────────────────────────────────
const AITeammateCard = ({ suggestion }) => {
    const navigate = useNavigate();
    const { user, matchScore, reason } = suggestion;
    if (!user) return null;

    const scoreColor =
        matchScore >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
        matchScore >= 60 ? 'text-[#e87315] border-[#e87315]/40 bg-[#e87315]/10' :
        'text-white/50 border-white/20 bg-white/5';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 transition-all duration-500 overflow-hidden cursor-pointer"
            onClick={() => navigate(`/dashboard/user/${user._id}`)}
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315]/60 via-[#e87315]/20 to-transparent" />
            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />

            <div className="p-5 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            <img
                                src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                onError={e => {
                                    e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${user.name}&bold=true`;
                                }}
                                alt={user.name}
                                className="w-12 h-12 object-cover border border-white/20 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-black text-white/90 uppercase tracking-tight group-hover:text-[#e87315] transition-colors truncate">
                                {user.name}
                            </p>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest truncate mt-0.5">
                                {user.college || 'Freelancer'}
                            </p>
                        </div>
                    </div>

                    {/* Match Score */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-black uppercase tracking-wider flex-shrink-0 ${scoreColor}`}>
                        <Zap size={11} />
                        {matchScore}%
                    </div>
                </div>

                {/* AI Reason */}
                <div className="relative bg-[#080808] border border-[#e87315]/20 p-3.5">
                    <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]/60" />
                    <p className="text-[10px] font-black text-[#e87315] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Sparkles size={10} /> AI Match Reason
                    </p>
                    <p className="text-[11px] text-white/70 font-medium leading-relaxed italic">
                        "{reason}"
                    </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                    {user.skills?.slice(0, 4).map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-[9px] font-black text-white/50 uppercase tracking-tighter">
                            {s}
                        </span>
                    ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest border-t border-white/10 pt-3">
                    {user.location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={10} /> {user.location.split(',')[0]}
                        </span>
                    )}
                    {user.Cat && (
                        <span className="flex items-center gap-1">
                            <Cat size={10} /> Cat
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom corner detail */}
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
        </motion.div>
    );
};

// ── AI Teammate Panel ────────────────────────────────────────────────────────
const AITeammatePanel = ({ projectId, isVisible, onClose }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!isVisible || fetched) return;
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/ai/suggest-teammates/${projectId}`, {
                    method: 'POST',
                    credentials: 'include',
                });
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            } catch (err) {
                console.error('AI suggestion failed:', err);
            } finally {
                setLoading(false);
                setFetched(true);
            }
        };
        fetch();
    }, [isVisible, projectId, fetched]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-10 relative bg-[#080808] border border-[#e87315]/30 overflow-hidden"
        >
            {/* Header accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/40 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#e87315]/40 bg-[#e87315]/10 flex items-center justify-center">
                        <Sparkles size={18} className="text-[#e87315]" />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-black text-white/90 uppercase tracking-[0.4em] italic">
                            AI Teammate Finder
                        </h4>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-0.5">
                            Ranked by tech stack compatibility
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-5">
                        {/* Architect loader */}
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-2 border-[#e87315]/20 animate-ping" />
                            <div className="absolute inset-0 border-2 border-t-[#e87315] border-[#e87315]/10 rounded-full animate-spin" />
                            <div className="absolute inset-3 border border-[#e87315]/30 rotate-45 animate-pulse" />
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] font-black text-[#e87315] uppercase tracking-[0.4em] italic animate-pulse">
                                Scanning Profiles...
                            </p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5">
                                AI analyzing tech stack compatibility
                            </p>
                        </div>
                    </div>
                ) : suggestions.length > 0 ? (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-[2px] h-4 bg-[#e87315]" />
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">
                                {suggestions.length} Best Matches Found
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {suggestions.map((s, i) => (
                                <AITeammateCard key={i} suggestion={s} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 border border-dashed border-white/10">
                        <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em] italic">
                            No Matches Found
                        </p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2">
                            Add more tags to your project for better results
                        </p>
                    </div>
                )}
            </div>

            {/* Corner accents */}
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20" />
        </motion.div>
    );
};


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

    // ── AI State ──────────────────────────────────────────────
    const [showAIPanel, setShowAIPanel] = useState(false);

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
    }, [activeSection]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !id) return;
        socket.emit('join_project', id);
        return () => { socket.emit('leave_project', id); };
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
        const handler = (e) => {
            const { projectId, role } = e.detail;
            if (projectId?.toString() !== id) return;
            setAppliedRoles(prev => {
                const updated = new Set(prev);
                updated.delete(role);
                return updated;
            });
        };
        window.addEventListener('application_rejected', handler);
        return () => window.removeEventListener('application_rejected', handler);
    }, [id]);

    useEffect(() => {
        const handler = (e) => {
            const { projectId, teamSize, newMember } = e.detail;
            if (projectId?.toString() !== id) return;
            setProject(prev => ({
                ...prev,
                teamSize,
                teamMembers: [...(prev.teamMembers || []), newMember]
            }));
        };
        window.addEventListener('team_updated', handler);
        return () => window.removeEventListener('team_updated', handler);
    }, [id]);

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
            console.error('Failed to apply:', err);
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

    const getStageBadge = (stage) => {
        switch (stage) {
            case 'idea': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'prototype': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'mvp': return 'bg-[#e87315]/20 text-[#e87315] border-[#e87315]/40';
            case 'launched': return 'bg-green-500/20 text-green-300 border-green-500/30';
            default: return 'bg-white/10 text-white/70 border-white/20';
        }
    };

    const getLookingForColor = (item) => {
        switch (item) {
            case 'mentor': return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
            case 'co-founder': return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
            case 'investor': return 'bg-[#e87315]/15 text-[#e87315] border-[#e87315]/40';
            case 'feedback': return 'bg-green-500/15 text-green-300 border-green-500/40';
            default: return 'bg-white/5 text-white/60 border-white/20';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin" />
        </div>
    );

    if (error || !project) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <p className="text-red-400 font-semibold">{error || 'Project not found.'}</p>
        </div>
    );

    const isOwnProject = project.creator?._id === user?._id;

    const applicableRoles = project.lookingFor?.filter(role => {
        if (user?.role?.toLowerCase() === 'student') {
            return role === 'co-founder' || role === 'team-member';
        }
        return true;
    });

    const mentorComments = comments.filter(c => c.author?.role?.toLowerCase() === 'mentor');
    const userComments = comments.filter(c => c.author?.role?.toLowerCase() !== 'mentor');

    // Show AI button only to non-owner students or anyone looking for team-member/co-founder
    const canSeeAITeammates = !isOwnProject &&
        (project.lookingFor?.includes('team-member') || project.lookingFor?.includes('co-founder'));

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#e87315] selection:text-black">

            <div className="sticky top-4 z-25 px-6 pointer-events-none" style={{ marginBottom: '-48px' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 text-[11px] sm:text-[12px] font-black tracking-[0.3em] uppercase text-white/60 hover:text-[#e87315] transition-colors bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-lg"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {/* 1. HERO */}
            <header className="relative h-[75vh] w-full overflow-hidden border-b border-white/10">
                {project.images?.[0] ? (
                    <img
                        src={project.images[0]}
                        className="absolute inset-0 w-full h-full object-cover brightness-50 grayscale"
                        alt={project.title}
                    />
                ) : (
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[#0c0c0c]" />
                        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#e87315]/10 blur-3xl" />
                        <div className="absolute -bottom-20 right-20 w-96 h-96 rounded-full bg-[#e87315]/5 blur-3xl" />
                        <div className="absolute top-0 right-0 w-64 h-64 border-r border-t border-[#e87315]/10 rounded-bl-full" />
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
                        <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-4 bg-[#e87315]" />
                                <span className={`px-3 py-1 border text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${getStageBadge(project.stage)}`}>
                                    {project.stage || 'Project'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-[10px] sm:text-[11px] font-black text-[#e87315] opacity-60 uppercase tracking-[0.2em]">Category</span>
                                <span className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-[0.4em]">
                                    {project.category?.replace(/\s+/g, '_')}
                                </span>
                            </div>
                        </div>

                        <div className="relative inline-block mb-6 sm:mb-8">
                            <span className="absolute -top-12 -left-2 text-[100px] sm:text-[120px] font-black text-white/[0.02] leading-none tracking-tighter italic select-none pointer-events-none">
                                {project.title?.slice(0, 2).toUpperCase()}
                            </span>
                            <h1 className="text-5xl sm:text-6xl lg:text-9xl font-black italic tracking-tighter leading-[0.8] uppercase text-white/90 relative z-10">
                                {project.title}
                            </h1>
                            <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-[#e87315] via-[#e87315]/40 to-transparent" />
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end gap-6 sm:gap-8">
                            <p className="text-base sm:text-lg lg:text-2xl font-medium text-white/70 max-w-2xl italic tracking-tight leading-relaxed">
                                {project.tagline}
                            </p>
                        </div>
                    </motion.div>

                    <div className="absolute bottom-10 right-12 hidden lg:block">
                        <div className="relative w-24 h-24 border-r border-b border-white/10">
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#e87315]" />
                            <span className="absolute bottom-6 right-2 text-[9px] font-black text-white/30 [writing-mode:vertical-lr] uppercase tracking-[1em]">
                                Evolve
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. STICKY NAV */}
            <nav className="sticky top-0 z-[20] bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/10 px-6 lg:px-12 py-4">
                <div className="max-w-7xl mx-30 flex justify-between items-center">
                    <div className="flex gap-6 sm:gap-10">
                        {['Overview', 'Architecture', 'Team', ...(isOwnProject ? ['Applications'] : [])].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSection(tab)}
                                className={`text-[11px] sm:text-[13px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase transition-all relative py-2 group/nav ${activeSection === tab ? 'text-[#e87315]' : 'text-white/50 hover:text-white/80'}`}
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

                    <div className="flex items-center gap-6 sm:gap-8 border-l border-white/10 pl-6 sm:pl-8">
                        <div className="flex items-center gap-2 sm:gap-2.5 group/stat">
                            <div className="relative">
                                <Eye size={18} className="text-white/40 group-hover/stat:text-white/80 transition-colors sm:w-[19px] sm:h-[19px]" />
                                <div className="absolute -top-1 -left-1 w-1 h-1 border-t border-l border-[#e87315] opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[11px] sm:text-[12px] font-black text-white/60 tabular-nums tracking-widest uppercase">
                                {project.viewCount?.toLocaleString() || 0} <span className="text-[9px] sm:text-[10px] text-white/40 ml-1">views</span>
                            </span>
                        </div>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 sm:gap-2.5 group/like transition-all ${liked ? 'text-red-500' : 'text-white/50 hover:text-red-400'}`}
                        >
                            <div className="relative">
                                <Heart size={18} fill={liked ? 'currentColor' : 'none'} className="transition-transform duration-300 group-active/like:scale-125 sm:w-[19px] sm:h-[19px]" />
                                {liked && <div className="absolute -inset-1 border border-red-500/30 animate-ping rounded-full" />}
                            </div>
                            <span className="text-[11px] sm:text-[12px] font-black tabular-nums tracking-widest uppercase">
                                {likeCount} <span className="text-[9px] sm:text-[10px] opacity-60 ml-1">likes</span>
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* 3. MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">

                {/* LEFT: CONTENT */}
                <div className="lg:col-span-8 space-y-12 sm:space-y-16">
                    <AnimatePresence mode="wait">

                        {activeSection === 'Overview' && (
                            <motion.section
                                key="overview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-16 sm:space-y-20 relative"
                            >
                                {/* Description Node */}
                                <div className="relative group">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                                        <div className="w-[2px] h-4 bg-[#e87315]" />
                                        <h3 className="text-[#e87315] text-[11px] sm:text-[12px] font-black tracking-[0.5em] sm:tracking-[0.6em] uppercase italic">
                                            01 About Project
                                        </h3>
                                    </div>
                                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter leading-[1.1] uppercase text-white/80 relative z-10 line-clamp-3">
                                        "{project.description || 'Null_Description_Data'}"
                                    </p>
                                    {project.description?.length > 200 && (
                                        <button
                                            onClick={() => setShowAboutModal(true)}
                                            className="mt-6 flex items-center gap-2 text-[11px] sm:text-[12px] font-black text-[#e87315] uppercase tracking-widest hover:gap-4 transition-all"
                                        >
                                            Read Full Description
                                            <div className="h-[1px] w-6 bg-[#e87315]" />
                                        </button>
                                    )}
                                </div>

                                {/* Looking For Module */}
                                {project.lookingFor?.length > 0 && (
                                    <div className="pt-10 sm:pt-12 border-t border-white/10 relative">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                                            <div className="w-[2px] h-4 bg-[#e87315]" />
                                            <h3 className="text-[#e87315] text-[11px] sm:text-[12px] font-black tracking-[0.5em] sm:tracking-[0.6em] uppercase italic">
                                                02 Looking for
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {project.lookingFor.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className={`relative px-5 sm:px-6 py-2.5 sm:py-3 border transition-all duration-500 group/tag ${getLookingForColor(item)}`}
                                                >
                                                    <div className="absolute top-0 left-0 w-1 h-1 bg-current opacity-60" />
                                                    <span className="text-[11px] sm:text-[12px] font-black tracking-[0.2em] uppercase">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── AI FIND TEAMMATES BUTTON ── */}
                                {canSeeAITeammates && (
                                    <div className="pt-10 sm:pt-12 border-t border-white/10">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-6">
                                            <div className="w-[2px] h-4 bg-[#e87315]" />
                                            <h3 className="text-[#e87315] text-[11px] sm:text-[12px] font-black tracking-[0.5em] sm:tracking-[0.6em] uppercase italic">
                                                03 AI Teammate Finder
                                            </h3>
                                        </div>

                                        <p className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-6 max-w-lg leading-relaxed">
                                            Let AI scan all profiles and recommend the best teammates based on this project's tech stack, stage, and needs.
                                        </p>

                                        <button
                                            onClick={() => setShowAIPanel(prev => !prev)}
                                            className={`group relative flex items-center gap-4 px-8 py-5 border overflow-hidden transition-all duration-500 ${showAIPanel
                                                ? 'border-[#e87315]/60 bg-[#e87315]/10 text-[#e87315]'
                                                : 'border-white/20 bg-white/[0.03] text-white/70 hover:border-[#e87315]/40 hover:text-white'
                                                }`}
                                        >
                                            {/* Hover fill */}
                                            <div className="absolute inset-0 bg-[#e87315]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                                            {/* Corner accents */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#e87315]" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#e87315]" />

                                            <div className="relative flex items-center gap-3">
                                                {showAIPanel ? (
                                                    <X size={18} />
                                                ) : (
                                                    <Sparkles size={18} className="text-[#e87315]" />
                                                )}
                                                <span className="text-[11px] font-black uppercase tracking-[0.4em] italic relative z-10">
                                                    {showAIPanel ? 'Close AI Panel' : 'Find AI Teammates'}
                                                </span>
                                            </div>

                                            {/* Live indicator */}
                                            {!showAIPanel && (
                                                <div className="relative flex items-center gap-2 ml-2">
                                                    <span className="animate-ping absolute w-2 h-2 bg-[#e87315]/40 rounded-full" />
                                                    <span className="relative w-2 h-2 bg-[#e87315] rounded-full" />
                                                    <span className="text-[9px] font-black text-[#e87315] uppercase tracking-widest">AI</span>
                                                </div>
                                            )}
                                        </button>

                                        {/* AI Panel */}
                                        <AnimatePresence>
                                            {showAIPanel && (
                                                <AITeammatePanel
                                                    projectId={id}
                                                    isVisible={showAIPanel}
                                                    onClose={() => setShowAIPanel(false)}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Telemetry Grid */}
                                <div className="pt-10 sm:pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                    <div className="relative p-6 sm:p-8 border border-white/10 bg-[#0c0c0c]">
                                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                                        <h4 className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.4em] mb-3 sm:mb-4">
                                            Current Project Stage
                                        </h4>
                                        <div className="flex items-baseline gap-3">
                                            <p className="text-3xl sm:text-4xl font-black italic uppercase text-white/90 tracking-tighter">
                                                {project.stage}
                                            </p>
                                            <span className="text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase animate-pulse">
                                                [Active]
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative p-6 sm:p-8 border border-white/10 bg-[#0c0c0c]">
                                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                                        <h4 className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.4em] mb-3 sm:mb-4">
                                            Team size
                                        </h4>
                                        <div className="flex items-baseline gap-3">
                                            <p className="text-3xl sm:text-4xl font-black italic uppercase text-white/90 tracking-tighter tabular-nums">
                                                {project.teamSize?.toString().padStart(2, '0') || '01'}
                                            </p>
                                            <span className="text-[10px] sm:text-[11px] font-black text-white/40 uppercase tracking-widest">
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
                                <h3 className="text-[#e87315] text-[11px] sm:text-[12px] font-bold tracking-[0.5em] uppercase italic"> Tech Stack</h3>
                                {project.tags?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                                        {project.tags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="bg-[#0c0c0c] border border-white/10 p-8 sm:p-10 text-xl sm:text-2xl font-black italic uppercase text-white/80 hover:text-white hover:border-[#e87315]/40 transition-all flex items-center justify-center text-center cursor-default"
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/40 text-sm italic font-medium">No tech stack listed yet.</p>
                                )}
                            </motion.section>
                        )}

                        {activeSection === 'Team' && (
                            <motion.section
                                key="team"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6 sm:space-y-8"
                            >
                                <h3 className="text-[#e87315] text-[11px] sm:text-[12px] font-bold tracking-[0.5em] uppercase italic"> Team</h3>
                                {project.teamMembers?.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.teamMembers.map((member, i) => (
                                            <div
                                                key={i}
                                                onClick={() => navigate(`/dashboard/user/${member._id}`)}
                                                className="flex items-center gap-4 sm:gap-5 p-5 sm:p-6 bg-[#0c0c0c] border border-white/10 rounded-2xl hover:border-[#e87315]/40 transition-all cursor-pointer group"
                                            >
                                                <img
                                                    src={member.profileImage}
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${member.name}&bold=true`;
                                                    }}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 border border-white/20"
                                                    alt={member.name}
                                                />
                                                <div>
                                                    <p className="text-[13px] sm:text-[14px] font-black text-white/90 group-hover:text-[#e87315] transition-colors uppercase tracking-tight">{member.name}</p>
                                                    <p className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest mt-0.5">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/40 text-sm italic font-medium">No team members added yet.</p>
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
                                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                    <div className="w-[2px] h-4 bg-[#e87315]" />
                                    <h3 className="text-[#e87315] text-[11px] sm:text-[12px] font-black tracking-[0.5em] sm:tracking-[0.6em] uppercase italic">
                                        Applications ({applications.length})
                                    </h3>
                                </div>

                                {applicationsLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-24 bg-[#0c0c0c] border border-white/10 animate-pulse" />
                                    ))
                                ) : applications.length > 0 ? (
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                                        onWheel={(e) => e.stopPropagation()}
                                    >
                                        {applications.map(app => (
                                            <div
                                                key={app._id}
                                                className="relative bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 transition-colors p-6 group overflow-hidden"
                                            >
                                                <div className={`absolute top-0 left-0 w-[3px] h-full transition-colors ${app.status === 'accepted' ? 'bg-green-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-[#e87315]'}`} />

                                                <div className="flex items-start gap-4 sm:gap-5 pl-4 sm:pl-5">
                                                    <img
                                                        src={app.applicant?.profileImage}
                                                        onError={e => {
                                                            e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${app.applicant?.name}&bold=true`;
                                                        }}
                                                        onClick={() => navigate(`/dashboard/user/${app.applicant?._id}`)}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover border border-white/20 cursor-pointer opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all flex-shrink-0"
                                                        alt={app.applicant?.name}
                                                    />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-1.5">
                                                            <p
                                                                onClick={() => navigate(`/dashboard/user/${app.applicant?._id}`)}
                                                                className="text-[13px] sm:text-[14px] font-black text-white/90 hover:text-[#e87315] transition-colors cursor-pointer uppercase tracking-tight"
                                                            >
                                                                {app.applicant?.name}
                                                            </p>
                                                            <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest shrink-0">
                                                                {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>

                                                        <p className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-widest mb-2 sm:mb-2.5">
                                                            {app.applicant?.college || app.applicant?.role}
                                                        </p>

                                                        <div className="inline-flex items-center gap-2 mb-3.5">
                                                            <span className="text-[10px] sm:text-[11px] font-black text-[#e87315] uppercase tracking-widest">Applied for:</span>
                                                            <span className="px-2.5 py-1 bg-[#e87315]/10 border border-[#e87315]/30 text-[10px] sm:text-[11px] font-black text-[#e87315] uppercase tracking-widest">
                                                                {app.role}
                                                            </span>
                                                        </div>

                                                        {app.message && (
                                                            <p className="text-[12px] sm:text-[13px] text-white/70 italic leading-relaxed mb-4 sm:mb-5">
                                                                "{app.message}"
                                                            </p>
                                                        )}

                                                        {app.status === 'pending' ? (
                                                            <div className="flex gap-3 sm:gap-4">
                                                                <button onClick={() => handleApplicationStatus(app._id, 'accepted')} className="flex items-center gap-2 px-5 py-2.5 bg-[#e87315] hover:bg-[#f97316] text-black text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all active:scale-95">Accept</button>
                                                                <button onClick={() => handleApplicationStatus(app._id, 'rejected')} className="flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-red-500/10 text-white/60 hover:text-red-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border border-white/10 hover:border-red-500/40 transition-all active:scale-95">Reject</button>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                                                ✓ {app.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="relative text-center py-20 border border-dashed border-white/10 bg-[#0c0c0c]">
                                        <h3 className="text-[11px] sm:text-[12px] font-black text-white/50 uppercase tracking-[0.5em] italic">No applications yet</h3>
                                        <p className="text-[10px] sm:text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2.5">Applications will appear here when someone applies for a role</p>
                                    </div>
                                )}
                            </motion.section>
                        )}

                    </AnimatePresence>
                </div>

                {/* RIGHT: CREATOR CARD */}
                <aside className="lg:col-span-4 h-fit space-y-4 sm:space-y-6">

                    {/* Creator */}
                    <div className="relative bg-[#0c0c0c] p-6 sm:p-8 border border-white/10 group overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8 relative z-10">
                            <div className="w-1.5 h-4 bg-[#e87315]" />
                            <h4 className="text-[11px] sm:text-[12px] font-black tracking-[0.5em] uppercase text-[#e87315] italic">Creater</h4>
                        </div>

                        <div
                            onClick={() => navigate(`/dashboard/user/${project.creator?._id}`)}
                            className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-10 cursor-pointer group/author relative z-10"
                        >
                            <div className="relative flex-shrink-0">
                                <img
                                    src={project.creator?.profileImage || `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${project.creator?.name}&bold=true`}
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${project.creator?.name}&bold=true`; }}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover border border-white/20 opacity-80 grayscale group-hover/author:opacity-100 group-hover/author:grayscale-0 group-hover/author:border-[#e87315]/50 transition-all duration-500"
                                    alt={project.creator?.name}
                                />
                                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315] opacity-0 group-hover/author:opacity-100 transition-opacity" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-black italic uppercase text-white/90 group-hover/author:text-[#e87315] transition-colors tracking-tighter leading-none mb-1.5 truncate">
                                    {project.creator?.name}
                                </p>
                                <p className="text-[10px] sm:text-[11px] font-black tracking-[0.3em] text-white/60 uppercase mb-1.5 truncate">{project.creator?.role}</p>
                                {project.creator?.college && (
                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none truncate">{project.creator.college}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mb-6 sm:mb-8">
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 border border-white/10 bg-white/[0.05] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-white/30 transition-all">
                                    <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" /> Live
                                </a>
                            )}
                            {project.CatUrl && (
                                <a href={project.CatUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 border border-white/10 bg-white/[0.05] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-white/30 transition-all">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg> Cat
                                </a>
                            )}
                        </div>

                        <div className="relative z-10 space-y-2">
                            {!isOwnProject && (
                                isAccepted ? (
                                    <>
                                        <button onClick={() => navigate('/dashboard/messages')} className="w-full py-4 sm:py-4.5 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.5em] transition-all bg-[#e87315] hover:bg-[#ff7e1a] text-black italic">
                                            Send Message
                                        </button>
                                        {applicableRoles?.length > 0 && (
                                            appliedRoles.size > 0 ? (
                                                <button disabled className="w-full py-4 sm:py-4.5 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.4em] bg-green-500/10 text-green-400 border border-green-500/30 cursor-default italic mt-3">
                                                    ✓ Already Applied
                                                </button>
                                            ) : (
                                                <button onClick={() => setShowRoleSelector(true)} className="w-full py-4 sm:py-4.5 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.4em] transition-all bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.1] hover:border-white/30 italic mt-3">
                                                    Apply for Role
                                                </button>
                                            )
                                        )}
                                    </>
                                ) : (
                                    appliedRoles.size > 0 ? (
                                        <button disabled className="w-full py-4 sm:py-4.5 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.4em] bg-green-500/10 text-green-400 border border-green-500/30 cursor-default italic">
                                            ✓ Already Applied
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowRoleSelector(true)}
                                            disabled={connecting}
                                            className={`w-full py-4 sm:py-4.5 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.4em] transition-all border ${connecting ? 'bg-[#e87315]/20 text-white border-[#e87315]/40 cursor-wait animate-pulse' : 'bg-white/10 text-white/90 border-transparent hover:bg-[#e87315] hover:text-black italic'}`}
                                        >
                                            {connecting ? 'Applying...' : 'Apply for Role'}
                                        </button>
                                    )
                                )
                            )}

                            {isOwnProject && (
                                <button onClick={() => navigate('/dashboard/project')} className="w-full py-4 sm:py-4.5 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.4em] transition-all bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.1] hover:border-white/30 italic">
                                    Manage Project
                                </button>
                            )}
                        </div>

                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    {/* Stats card */}
                    <div className="relative bg-[#0c0c0c] p-6 sm:p-8 border border-white/10 group overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8 relative z-10">
                            <div className="w-1.5 h-4 bg-[#e87315]" />
                            <h4 className="text-[11px] sm:text-[12px] font-black tracking-[0.5em] uppercase text-white/60 italic">Key Stats.</h4>
                        </div>

                        <div className="space-y-4 sm:space-y-5 text-[11px] sm:text-[12px] font-black tracking-widest uppercase tabular-nums relative z-10">
                            <div className="flex justify-between items-center group/stat">
                                <span className="text-white/50 group-hover/stat:text-white/80 transition-colors">VIEWS</span>
                                <span className="text-white/90 bg-white/[0.05] px-2.5 py-1 border border-white/10">{project.viewCount?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between items-center group/stat">
                                <span className="text-white/50 group-hover/stat:text-white/80 transition-colors">LIKES</span>
                                <span className="text-white/90 bg-white/[0.05] px-2.5 py-1 border border-white/10">{likeCount}</span>
                            </div>
                            <div className="flex justify-between items-center group/stat">
                                <span className="text-white/50 group-hover/stat:text-white/80 transition-colors">TEAM SIZE</span>
                                <span className="text-white/90 bg-white/[0.05] px-2.5 py-1 border border-white/10">{project.teamSize || 1}</span>
                            </div>
                            <div className="flex justify-between items-center group/stat pt-2 sm:pt-3">
                                <span className="text-white/50 group-hover/stat:text-white/80 transition-colors">CATEGORY</span>
                                <span className="text-[#e87315] font-black text-[10px] sm:text-[11px] tracking-[0.2em] border border-[#e87315]/40 px-3 sm:px-4 py-1.5 bg-[#e87315]/[0.05]">{project.category}</span>
                            </div>
                        </div>

                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                </aside>

                {/* ── Comments Section ── */}
                <div className="col-span-12 mt-8 sm:mt-10 border-t border-white/10 pt-12 sm:pt-16">

                    {mentorComments.filter(c => c.author?.role === 'mentor').length > 0 && (
                        <div className="mb-12 sm:mb-16 p-6 sm:p-8 bg-[#0c0c0c]/80 backdrop-blur-md border-2 border-purple-500/30 rounded-3xl relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/40 rounded-xl flex items-center justify-center shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-400"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xl sm:text-2xl font-black text-white/90 uppercase tracking-tight">Mentor Feedback Zone</h4>
                                        <p className="text-[11px] sm:text-xs text-purple-300/80 font-medium mt-1">Expert insights from verified mentors</p>
                                    </div>
                                </div>
                                <span className="sm:ml-auto px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-[10px] sm:text-[11px] font-black text-purple-400 self-start sm:self-auto">
                                    {comments.filter(c => c.author?.role === 'mentor').length} {comments.filter(c => c.author?.role === 'mentor').length === 1 ? 'Mentor Insight' : 'Mentors Insights'}
                                </span>
                            </div>

                            <div className="space-y-4 sm:space-y-5 relative z-10">
                                {comments.filter(c => c.author?.role === 'mentor').slice(0, 3).map((comment) => (
                                    <div key={comment._id} className="group p-5 sm:p-6 bg-[#0c0c0c] border border-purple-500/20 hover:border-purple-500/50 rounded-2xl transition-all">
                                        <div className="flex gap-4 sm:gap-5">
                                            <div className="relative flex-shrink-0">
                                                <img src={comment.author?.profileImage} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=6b21a8&color=fff&size=100&name=${comment.author?.name}&bold=true`; }} onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover cursor-pointer grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all ring-2 ring-purple-500/30" alt={comment.author?.name} />
                                                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-md flex items-center justify-center border-2 border-[#0c0c0c]">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-2 sm:mb-2.5 flex-wrap">
                                                    <span onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)} className="text-[13px] sm:text-[14px] font-black text-white/90 hover:text-purple-400 transition-colors cursor-pointer">{comment.author?.name}</span>
                                                    <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded-full text-[9px] sm:text-[10px] font-black text-purple-300 uppercase tracking-widest">✦ Mentor</span>
                                                    <span className="text-[10px] sm:text-[11px] text-white/50">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <p className="text-[12px] sm:text-[13px] text-white/80 leading-relaxed font-medium">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {comments.filter(c => c.author?.role === 'mentor').length > 3 && (
                                <button onClick={() => setShowMentorModal(true)} className="mt-5 sm:mt-6 w-full py-3 sm:py-3.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-[11px] sm:text-[12px] font-black text-purple-400 uppercase tracking-widest transition-all">
                                    View All {comments.filter(c => c.author?.role === 'mentor').length} Mentor Feedbacks ↗
                                </button>
                            )}
                        </div>
                    )}

                    {/* Comment Input */}
                    <div className="flex gap-4 sm:gap-5 mb-10 sm:mb-12">
                        <img src={user?.profileImage} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${user?.name}&bold=true`; }} className="w-12 h-12 sm:w-14 sm:h-14 border border-white/20 object-cover flex-shrink-0 opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" alt={user?.name} />
                        <div className="flex-1 relative group/input">
                            <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-[#e87315] opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                            <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-[#e87315] opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                            <textarea value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }} placeholder="Enter Comment" rows={3} className="w-full px-5 sm:px-6 py-4 sm:py-5 bg-[#0c0c0c] border border-white/10 hover:border-white/20 focus:border-[#e87315]/50 text-white/90 text-[13px] sm:text-[14px] focus:outline-none transition-all resize-none pr-16 placeholder:text-white/30 placeholder:uppercase placeholder:tracking-[0.2em] font-medium" />
                            <button onClick={handleAddComment} disabled={commentSubmitting || !commentInput.trim()} className="absolute right-4 sm:right-5 bottom-4 sm:bottom-5 p-2.5 sm:p-3 bg-transparent border border-[#e87315] hover:bg-[#e87315] disabled:opacity-20 disabled:grayscale transition-all duration-300 group/send">
                                {commentSubmitting ? (<div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin" />) : (<Send size={16} className="text-[#ffffff] group-hover:text-black transition-colors sm:w-5 sm:h-5" />)}
                            </button>
                        </div>
                    </div>

                    {/* All Comments */}
                    <div id="all-comments" className="space-y-6 sm:space-y-8">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h4 className="text-[11px] sm:text-[12px] font-black text-white/60 uppercase tracking-widest">
                                Student Comments ({userComments.length})
                            </h4>
                        </div>

                        {commentsLoading ? (
                            <div className="space-y-4 sm:space-y-5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4 sm:gap-5 animate-pulse">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 flex-shrink-0 border border-white/20" />
                                        <div className="flex-1 space-y-2.5 mt-1">
                                            <div className="h-3 sm:h-3.5 bg-white/10 rounded w-32 sm:w-40" />
                                            <div className="h-4 sm:h-4.5 bg-white/10 rounded w-full" />
                                            <div className="h-4 sm:h-4.5 bg-white/10 rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : comments.length > 0 ? userComments.map((comment) => {
                            const isMentor = comment.author?.role === 'mentor';
                            const isInvestor = comment.author?.role === 'investor';

                            return (
                                <div key={comment._id} className={`flex gap-5 sm:gap-6 group p-6 sm:p-7 transition-all duration-500 relative border-l-2 ${isMentor ? 'bg-purple-500/[0.03] border-purple-500/50 hover:bg-purple-500/[0.06]' : isInvestor ? 'bg-green-500/[0.03] border-green-500/50 hover:bg-green-500/[0.06]' : 'bg-[#0c0c0c] border-white/10 hover:border-[#e87315]/40'}`}>
                                    {(isMentor || isInvestor) && (
                                        <div className="absolute top-0 right-0 px-3 py-1.5 flex items-center gap-2 sm:gap-2.5">
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMentor ? 'bg-purple-400' : 'bg-green-400'}`} />
                                            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] ${isMentor ? 'text-purple-400' : 'text-green-400'}`}>{isMentor ? 'Verified Mentor' : 'Verified Investor'}</span>
                                        </div>
                                    )}

                                    <div className="relative flex-shrink-0">
                                        <img src={comment.author?.profileImage} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=${isMentor ? '6b21a8' : isInvestor ? '22c55e' : '080808'}&color=fff&size=100&name=${comment.author?.name}&bold=true`; }} onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)} className={`w-12 h-12 sm:w-14 sm:h-14 border object-cover cursor-pointer transition-all duration-500 ${isMentor ? 'border-purple-500/60 grayscale-0' : isInvestor ? 'border-green-500/60 grayscale-0' : 'border-white/20 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100'}`} alt={comment.author?.name} />
                                        <div className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity ${isMentor ? 'border-purple-400' : isInvestor ? 'border-green-400' : 'border-[#e87315]'}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                                            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                                                <span onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)} className={`text-[13px] sm:text-[14px] font-black hover:text-orange-500 transition-colors cursor-pointer ${isMentor ? 'text-purple-300' : isInvestor ? 'text-green-300' : 'text-white/90'}`}>{comment.author?.name}</span>
                                                {isMentor && <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded-full text-[9px] sm:text-[10px] font-black text-purple-300 uppercase tracking-widest">✦ Mentor</span>}
                                                {isInvestor && <span className="px-2.5 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full text-[9px] sm:text-[10px] font-black text-green-300 uppercase tracking-widest">✦ Investor</span>}
                                                <span className="text-[10px] sm:text-[11px] text-white/50 font-medium">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                {comment.isEdited && <span className="text-[11px] sm:text-[12px] text-white/40 italic">· edited</span>}
                                            </div>

                                            {(comment.author?._id === user?._id || project.creator?._id === user?._id) && (
                                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {comment.author?._id === user?._id && (
                                                        <button onClick={() => { setEditingComment(comment._id); setEditCommentInput(comment.content); }} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><Pencil size={14} className="sm:w-4 sm:h-4" /></button>
                                                    )}
                                                    <button onClick={() => handleDeleteComment(comment._id)} className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-all"><Trash2 size={14} className="sm:w-4 sm:h-4" /></button>
                                                </div>
                                            )}
                                        </div>

                                        {editingComment === comment._id ? (
                                            <div className="space-y-4 mt-3 w-full">
                                                <textarea value={editCommentInput} onChange={e => setEditCommentInput(e.target.value)} rows={3} className="w-full px-5 py-4 bg-[#0c0c0c] border border-[#e87315]/50 text-white/90 text-[13px] sm:text-[14px] focus:outline-none resize-none font-medium transition-all" />
                                                <div className="flex gap-3 sm:gap-4">
                                                    <button onClick={() => handleEditComment(comment._id)} className="group/save relative px-6 py-2.5 overflow-hidden border border-[#e87315] bg-transparent transition-colors duration-300">
                                                        <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/save:translate-y-0 transition-transform duration-300 ease-out" />
                                                        <div className="relative z-10 flex items-center justify-center gap-2 text-[#e87315] group-hover/save:text-black transition-colors duration-300">
                                                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em]">Update Comment</span>
                                                        </div>
                                                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#e87315] group-hover/save:bg-black" />
                                                    </button>
                                                    <button onClick={() => { setEditingComment(null); setEditCommentInput(''); }} className="px-6 py-2.5 border border-white/20 hover:border-white/40 text-white/60 hover:text-white transition-all">
                                                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative mt-1.5 sm:mt-2">
                                                <p className={`text-[12px] sm:text-[13px] leading-relaxed tracking-tight ${isMentor ? 'text-purple-100/90' : isInvestor ? 'text-green-100/90' : 'text-white/80'}`}>{comment.content}</p>
                                                <div className={`mt-4 sm:mt-5 w-8 sm:w-10 h-[2px] ${isMentor ? 'bg-purple-500/40' : isInvestor ? 'bg-green-500/40' : 'bg-white/20'}`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="relative text-center py-20 sm:py-24 border border-dashed border-white/10 bg-[#0c0c0c] group overflow-hidden">
                                <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 border border-white/20 flex items-center justify-center mb-2 group-hover:border-[#e87315]/50 transition-colors duration-500">
                                        <div className="w-1.5 h-1.5 bg-white/40 group-hover:bg-[#e87315] transition-colors" />
                                    </div>
                                    <h3 className="text-[11px] sm:text-[12px] font-black text-white/60 uppercase tracking-[0.5em] italic">It's Empty here</h3>
                                    <p className="text-[11px] sm:text-[12px] font-bold text-white/40 uppercase tracking-[0.2em] max-w-[280px] leading-relaxed">Write the first comment.</p>
                                </div>
                                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20" />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="p-8 sm:p-12 text-center opacity-30 border-t border-white/10 mt-12 sm:mt-16">
                <p className="text-[10px] sm:text-[11px] font-black tracking-[1em] uppercase">EVOLVE 2026</p>
            </footer>

            {/* Role Selector Modal */}
            {showRoleSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050505]/90 backdrop-blur-md" onClick={() => setShowRoleSelector(false)}>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-[#e87315]/10 rounded-full blur-[120px]" />
                    </div>
                    <div className="relative bg-[#0c0c0c] border border-white/20 w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent" />
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#e87315]" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#e87315]" />
                        <div className="p-6 sm:p-8">
                            <header className="mb-8">
                                <div className="flex items-center gap-3 sm:gap-4 mb-2.5">
                                    <div className="w-1.5 h-4 sm:h-5 bg-[#e87315]" />
                                    <h3 className="text-[12px] sm:text-[13px] font-black text-white/90 uppercase tracking-[0.4em]">Connect with Creator</h3>
                                </div>
                                <p className="text-[13px] sm:text-[14px] text-white/60 font-medium italic">What role are you interested in?</p>
                            </header>
                            <div className="space-y-3 sm:space-y-4 mb-10">
                                {applicableRoles?.length > 0 ? (
                                    <>
                                        {applicableRoles?.map((role) => (
                                            <button key={role} onClick={() => setSelectedRole(role)} className={`group relative w-full px-5 sm:px-6 py-4 sm:py-4.5 border transition-all duration-300 text-left overflow-hidden ${selectedRole === role ? 'border-[#e87315] bg-[#e87315]/10' : 'border-white/10 bg-[#0c0c0c] hover:border-[#e87315]/40 hover:bg-white/[0.05]'}`}>
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${selectedRole === role ? 'text-[#e87315]' : 'text-white/60 group-hover:text-white/90'}`}>{role}</span>
                                                    {selectedRole === role && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#e87315] rotate-45 shadow-[0_0_10px_#e87315]" />}
                                                </div>
                                                {selectedRole === role && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e87315]" />}
                                            </button>
                                        ))}
                                        <button onClick={() => setSelectedRole('')} className={`group relative w-full px-5 sm:px-6 py-4 sm:py-4.5 border transition-all duration-300 text-left ${selectedRole === '' ? 'border-[#e87315] bg-[#e87315]/10' : 'border-white/10 bg-[#0c0c0c] hover:border-[#e87315]/40 hover:bg-white/[0.05]'}`}>
                                            <div className="relative z-10 flex items-center justify-between">
                                                <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${selectedRole === '' ? 'text-[#e87315]' : 'text-white/60 group-hover:text-white/90'}`}>General Connection</span>
                                                {selectedRole === '' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#e87315] rotate-45 shadow-[0_0_10px_#e87315]" />}
                                            </div>
                                            {selectedRole === '' && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e87315]" />}
                                        </button>
                                    </>
                                ) : (
                                    <div className="py-10 sm:py-12 text-center border border-dashed border-white/20 bg-[#0c0c0c]">
                                        <p className="text-[11px] sm:text-[12px] text-white/50 uppercase font-black tracking-widest">No specific roles listed</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button onClick={() => setShowRoleSelector(false)} className="order-2 sm:order-1 flex-1 py-4 sm:py-4.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all">Cancel</button>
                                {applicableRoles?.length > 0 && (
                                    <button onClick={handleConnect} disabled={connecting} className="order-1 sm:order-2 flex-[1.5] py-4 sm:py-4.5 bg-white text-black hover:bg-[#e87315] hover:text-white font-black text-[10px] sm:text-[11px] uppercase tracking-[0.3em] transition-all relative group">
                                        <span className="relative z-10">{connecting ? 'Applying...' : 'Submit Application'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 opacity-20">
                            <div className="absolute bottom-2.5 right-2.5 w-4 h-[1px] bg-white rotate-45" />
                            <div className="absolute bottom-2.5 right-2.5 w-1 h-4 bg-white" />
                        </div>
                    </div>
                </div>
            )}

            {/* Mentor Modal */}
            {showMentorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050505]/90 backdrop-blur-md" onClick={() => setShowMentorModal(false)} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                    <div className="relative bg-[#0c0c0c] border border-purple-500/40 w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-purple-500" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-purple-500" />
                        <div className="flex items-center justify-between px-6 sm:px-8 py-6 sm:py-7 border-b border-purple-500/20 bg-purple-500/[0.02]">
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 border border-purple-500/40 rounded-xl flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-400 sm:w-6 sm:h-6"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-[15px] sm:text-[16px] font-black text-white/90 uppercase tracking-tight">All Mentor Feedback</h4>
                                    <p className="text-[11px] sm:text-[12px] text-purple-300/80 font-medium mt-0.5">{comments.filter(c => c.author?.role === 'mentor').length} expert insights</p>
                                </div>
                            </div>
                            <button onClick={() => setShowMentorModal(false)} className="p-2 sm:p-2.5 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 text-purple-400/60 hover:text-purple-400 transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="sm:w-5 sm:h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 sm:space-y-5 mentor-scroll" style={{ overscrollBehavior: 'contain' }}>
                            {comments.filter(c => c.author?.role === 'mentor').map((comment) => (
                                <div key={comment._id} className="group p-5 sm:p-6 bg-[#0c0c0c] border border-purple-500/20 hover:border-purple-500/50 rounded-2xl transition-all">
                                    <div className="flex gap-4 sm:gap-5">
                                        <div className="relative flex-shrink-0">
                                            <img src={comment.author?.profileImage} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=6b21a8&color=fff&size=100&name=${comment.author?.name}&bold=true`; }} onClick={() => { navigate(`/dashboard/user/${comment.author?._id}`); setShowMentorModal(false); }} className="w-12 h-12 sm:w-14 sm:h-14 object-cover cursor-pointer grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all ring-2 ring-purple-500/30" alt={comment.author?.name} />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 flex items-center justify-center border-2 border-[#0c0c0c]">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 mb-2 sm:mb-3 flex-wrap">
                                                <span onClick={() => { navigate(`/dashboard/user/${comment.author?._id}`); setShowMentorModal(false); }} className="text-[13px] sm:text-[14px] font-black text-white/90 hover:text-purple-400 transition-colors cursor-pointer">{comment.author?.name}</span>
                                                <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded-full text-[9px] sm:text-[10px] font-black text-purple-300 uppercase tracking-widest">✦ Mentor</span>
                                                <span className="text-[10px] sm:text-[11px] text-white/50">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <p className="text-[12px] sm:text-[13px] text-white/80 leading-relaxed font-medium">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;