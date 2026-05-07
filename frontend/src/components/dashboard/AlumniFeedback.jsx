import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, GraduationCap, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, commentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AlumniFeedback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const myProjectIds = useRef(new Set());
    const myProjectsRef = useRef([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const projectsRes = await projectAPI.getMyProjects();
                const myProjects = projectsRes.data;

                myProjectsRef.current = myProjects;
                myProjectIds.current = new Set(myProjects.map(p => p._id.toString())); // ← moved here, strings

                if (myProjects.length === 0) {
                    setLoading(false);
                    return;
                }

                const commentsResults = await Promise.all(
                    myProjects.map(p => commentAPI.getAll(p._id))
                );

                const allComments = commentsResults.flatMap((res, i) =>
                    res.data.map(comment => ({
                        ...comment,
                        projectName: myProjects[i].title,
                        projectId: myProjects[i]._id
                    }))
                );

                const mentorComments = allComments.filter(
                    comment => comment.author?.role === 'mentor'
                );

                mentorComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComments(mentorComments);

            } catch (err) {
                console.error('Failed to fetch feedback:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    useEffect(() => {
        const handler = (e) => {

            const comment = e.detail;

            if (comment.author?.role?.toLowerCase() !== 'mentor') return;

            const projectId = (comment.project?._id || comment.project)?.toString(); // ← toString here
            if (!myProjectIds.current.has(projectId)) return;

            const project = myProjectsRef.current.find(p => p._id.toString() === projectId);

            const enrichedComment = {
                ...comment,
                projectName: project?.title || '',
                projectId: projectId
            };

            setComments(prev => {
                if (prev.find(c => c._id === enrichedComment._id)) return prev;
                return [enrichedComment, ...prev];
            });
        };

        window.addEventListener('comment_received', handler);
        return () => window.removeEventListener('comment_received', handler);
    }, []);

    const handleDelete = async (commentId) => {
        try {
            await commentAPI.delete(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const getTypeBadge = (role) => {
        switch (role) {
            case 'mentor': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'investor': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <div className="card-structured p-4 sm:p-6 md:p-8 h-full flex flex-col border border-white/10">
            {/* Header */}
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10 group">
                {/* ── Technical Icon Node ── */}
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-transparent border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:border-[#e87315]/40 group-hover:bg-[#e87315]/[0.05]">
                        <MessageSquare size={24} className="text-[#e87315]/80 group-hover:text-[#e87315] transition-colors" strokeWidth={1.5} />
                    </div>

                    {/* Architect Corner Ticks */}
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315]" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-[#e87315]" />
                </div>

                {/* ── Header Labels ── */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter italic">
                            Mentors feedback
                        </h2>
                        <div className="hidden sm:block h-[1px] w-8 bg-white/20" />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase tracking-[0.3em] opacity-80">
                            Status:
                        </span>
                        <p className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-widest tabular-nums">
                            {loading ? 'SYNCING...' : `${comments.length.toString().padStart(2, '0')} Feedbacks`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-[#0c0c0c] border border-white/10 animate-pulse relative">
                                <div className="absolute left-0 top-0 w-[2px] h-full bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : comments.length > 0 ? comments.slice(0, 2).map((comment) => (
                    <div
                        key={comment._id}
                        className="group relative bg-[#0c0c0c] p-5 sm:p-6 border border-white/10 hover:border-[#e87315]/40 transition-all duration-500 overflow-hidden"
                    >
                        {/* ── Status Lead (Architect Signature) ── */}
                        <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-700" />

                        <div className="flex items-start justify-between mb-5 sm:mb-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                {/* ── Author Node ── */}
                                <div
                                    className="relative cursor-pointer group/avatar shrink-0"
                                    onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)}
                                >
                                    <img
                                        src={comment.author?.profileImage}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${comment.author?.name}&bold=true`;
                                        }}
                                        alt={comment.author?.name}
                                        className="w-10 h-10 sm:w-12 sm:h-12 grayscale opacity-70 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 border border-white/20 transition-all duration-500 object-cover"
                                    />
                                    {/* Technical Border Ticks */}
                                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315]/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />

                                    {comment.author?.role === 'Mentor' && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#e87315] flex items-center justify-center border border-[#080808]">
                                            <GraduationCap size={10} className="text-black sm:w-3 sm:h-3" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 sm:space-y-1.5 min-w-0">
                                    {/* TITLE */}
                                    <h3
                                        className="text-[13px] sm:text-[14px] font-black text-white/90 uppercase tracking-tight cursor-pointer hover:text-[#e87315] transition-colors truncate"
                                        onClick={() => navigate(`/dashboard/user/${comment.author?._id}`)}
                                    >
                                        {comment.author?.name?.replace(/\s+/g, '_')}
                                    </h3>
                                    {/* SUBTITLE */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] sm:text-[9px] font-black text-[#e87315] opacity-80 uppercase tracking-[0.2em] shrink-0">Project</span>
                                        <span
                                            className="text-[10px] sm:text-[11px] text-white/60 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors truncate"
                                            onClick={() => navigate(`/dashboard/project/${comment.projectId}`)}
                                        >
                                            {comment.projectName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Role & Actions ── */}
                            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                <span className={`px-2.5 sm:px-3 py-1.5 border text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 bg-[#080808]/50 ${getTypeBadge(comment.author?.role)}`}>
                                    {comment.author?.role || 'Contributor'}
                                </span>

                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className="p-2 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-white/40 hover:text-red-500 transition-all border border-transparent hover:border-red-500/40"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* ── Content Log ── */}
                        <div className="relative pl-4 sm:pl-6 mb-5 sm:mb-6">
                            <div className="absolute left-0 top-0 w-[2px] h-full bg-white/10 group-hover:bg-[#e87315]/40 transition-colors" />
                            <p className="text-[12px] sm:text-[13px] text-white/80 leading-relaxed font-medium italic">
                                "{comment.content}"
                            </p>
                            {comment.isEdited && (
                                <span className="text-[8px] sm:text-[9px] font-black text-[#e87315]/60 uppercase tracking-widest block mt-2.5">
                                    [ MODIFIED ]
                                </span>
                            )}
                        </div>

                        {/* ── Entry Metadata ── */}
                        <div className="flex items-center justify-between opacity-50 group-hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] tabular-nums">
                                    Time: {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="relative flex flex-col items-center justify-center py-16 sm:py-24 px-6 border border-dashed border-white/20 bg-[#0c0c0c] overflow-hidden group">
                        {/* ── Icon Node (Geometric Frame) ── */}
                        <div className="relative mb-6 sm:mb-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-transparent border border-white/20 flex items-center justify-center transition-all duration-700 group-hover:bg-[#e87315]/[0.05] group-hover:border-[#e87315]/40">
                                <MessageSquare size={24} className="text-white/40 group-hover:text-[#e87315] group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                            </div>

                            {/* Architect Signature Ticks */}
                            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315]/60" />
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-[#e87315]/60" />

                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#e87315]/40 animate-scan pointer-events-none" />
                        </div>

                        {/* ── Status Content ── */}
                        <div className="text-center space-y-3 sm:space-y-4 relative z-10">
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <div className="h-[1px] w-6 bg-white/20" />
                                <h3 className="text-[11px] sm:text-xs font-black text-white/90 uppercase tracking-[0.6em] italic">
                                    No feedbacks Right Now
                                </h3>
                                <div className="h-[1px] w-6 bg-white/20" />
                            </div>

                            <div className="space-y-1">
                                <p className="text-[9px] sm:text-[10px] font-bold text-[#e87315]/80 uppercase tracking-[0.2em]">
                                    Signal Status: <span className="text-white/40 animate-pulse">No Feedback</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {comments.length > 0 && (
                <button
                    onClick={() => navigate('/dashboard/project')}
                    className="relative w-full mt-6 sm:mt-8 group/cmd overflow-hidden transition-all duration-500"
                >
                    {/* ── Structural Frame ── */}
                    <div className="relative flex items-center justify-center gap-3 px-6 py-4 sm:py-5 bg-[#0c0c0c] hover:bg-transparent border border-white/20 group-hover/cmd:border-[#e87315]/50 transition-all duration-500">

                        {/* Architect Corner Ticks (Left Side) */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-white/30 group-hover/cmd:bg-[#e87315]" />
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-white/30 group-hover/cmd:bg-[#e87315]" />

                        {/* The Label */}
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] sm:text-[11px] font-black text-white/60 group-hover/cmd:text-[#e87315] transition-colors uppercase tracking-[0.3em]">
                                View all project
                            </span>
                        </div>

                        {/* Decorative Progress Bar (Right) */}
                        <div className="absolute right-4 flex items-center gap-1.5 opacity-0 group-hover/cmd:opacity-100 transition-opacity duration-500">
                            <div className="w-1.5 h-1.5 bg-[#e87315] animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-[#e87315]/60" />
                            <div className="w-1.5 h-1.5 bg-[#e87315]/30" />
                        </div>
                    </div>

                    {/* Bottom Scan Line */}
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent group-hover/cmd:w-full transition-all duration-700" />
                </button>
            )}
        </div>
    );
};

export default AlumniFeedback;