import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commentAPI, projectAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Eye, Heart, ArrowUpRight } from 'lucide-react';

const ProjectsCommentedOn = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommentedProjects = async () => {
            try {
                // Get all projects
                const projectsRes = await projectAPI.getAll({ page: 1, limit: 50 });
                const allProjects = projectsRes.data;

                // For each project get comments and filter ones mentor commented on
                const commentedProjects = [];
                await Promise.all(
                    allProjects.map(async (project) => {
                        try {
                            const commentsRes = await commentAPI.getAll(project._id);
                            const myComments = commentsRes.data.filter(
                                c => c.author?._id === user?._id
                            );
                            if (myComments.length > 0) {
                                commentedProjects.push({
                                    ...project,
                                    myCommentCount: myComments.length,
                                    latestComment: myComments[0]
                                });
                            }
                        } catch {
                            // skip
                        }
                    })
                );

                // Sort by latest comment
                commentedProjects.sort((a, b) =>
                    new Date(b.latestComment.createdAt) - new Date(a.latestComment.createdAt)
                );

                setProjects(commentedProjects);
            } catch (err) {
                console.error('Failed to fetch commented projects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommentedProjects();
    }, []);

    return (
        <div className="relative bg-[#0c0c0c] border border-white/10 overflow-hidden group h-full flex flex-col">
            {/* ── Background Architectural Detail ── */}
            <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315]/40 to-transparent" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col relative z-10 h-full">
                {/* Header */}
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/[0.05] border border-white/20 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
                            <MessageSquare size={24} className="text-[#e87315]/80 group-hover:text-[#e87315] sm:w-7 sm:h-7 -rotate-3 group-hover:-rotate-12 transition-transform" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#e87315] animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-[14px] sm:text-[16px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] italic">Projects I Reviewed</h2>
                        <div className="flex items-center gap-2.5 mt-1.5">
                            <div className="h-px w-5 sm:w-6 bg-[#e87315]/60" />
                            <p className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-widest">
                                {loading ? 'SYNCING...' : `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} reviewed`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* List Container */}
                <div className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4 sm:space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 sm:h-32 bg-white/[0.05] border border-white/10 animate-pulse" />
                            ))}
                        </div>
                    ) : projects.length > 0 ? projects.slice(0, 3).map((project) => (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/dashboard/project/${project._id}`)}
                            className="relative group/item bg-transparent border-l border-white/10 hover:border-[#e87315] pl-4 sm:pl-6 py-2 transition-all duration-500 cursor-pointer"
                        >
                            <div className="flex items-start gap-4 sm:gap-6">
                                {/* Image/Icon Section */}
                                <div className="relative shrink-0">
                                    {project.images?.[0] ? (
                                        <img
                                            src={project.images[0]}
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-none object-cover grayscale opacity-70 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500 border border-white/20"
                                            alt={project.title}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#080808] border border-white/20 flex items-center justify-center">
                                            <span className="text-[#e87315]/60 font-black text-lg sm:text-xl">P</span>
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#080808] flex items-center justify-center border border-white/20 group-hover/item:border-[#e87315]/50 transition-colors">
                                        <ArrowUpRight size={10} className="text-white/40 group-hover/item:text-[#e87315] sm:w-3 sm:h-3 transition-colors" />
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                                        <h3 className="text-[12px] sm:text-[14px] font-black text-white/90 uppercase tracking-widest group-hover/item:text-[#e87315] transition-colors truncate">
                                            {project.title}
                                        </h3>
                                    </div>

                                    <p className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-tighter truncate mb-3 sm:mb-4">
                                        {project.tagline}
                                    </p>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
                                        <div className="flex items-center gap-4 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-1.5">
                                                <Eye size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                                <span className="text-[10px] sm:text-[11px] font-mono text-white">{project.viewCount || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Heart size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                                <span className="text-[10px] sm:text-[11px] font-mono text-white">{project.likes?.length || 0}</span>
                                            </div>
                                        </div>

                                        <span className="text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase tracking-widest px-2.5 py-1 sm:py-1.5 bg-[#e87315]/5 border border-[#e87315]/30 inline-block self-start">
                                            {project.myCommentCount} {project.myCommentCount === 1 ? 'comment' : 'comments'}
                                        </span>
                                    </div>

                                    {/* Comment Preview */}
                                    {project.latestComment?.content && (
                                        <div className="relative mt-2 sm:mt-3">
                                            <div className="absolute left-0 top-0 h-full w-[2px] bg-white/20 group-hover/item:bg-[#e87315]/40 transition-colors" />
                                            <p className="text-[11px] sm:text-[12px] text-white/80 italic leading-relaxed pl-4 sm:pl-5 line-clamp-2">
                                                "{project.latestComment.content}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 sm:py-24 border border-dashed border-white/10">
                            <div className="relative mb-6 sm:mb-8">
                                <div className="w-14 h-14 sm:w-20 sm:h-20 border border-white/20 flex items-center justify-center rotate-45 group-hover:border-[#e87315]/40 transition-colors">
                                    <MessageSquare size={24} className="text-white/40 -rotate-45 sm:w-8 sm:h-8 group-hover:text-[#e87315] transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.4em] sm:tracking-[0.5em]">No reviews yet</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest mt-2.5 italic text-center px-4">Projects you comment on will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Technical Corner Accents */}
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#e87315]" />
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
        </div>
    );
};

export default ProjectsCommentedOn;