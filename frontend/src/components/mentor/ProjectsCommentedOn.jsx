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
    <div className="relative bg-[#080808] border border-white/[0.03] overflow-hidden group">
      {/* ── Background Architectural Detail ── */}
      <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315]/20 to-transparent" />

      <div className="p-4 sm:p-6 md:p-8 flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-10">
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/[0.02] border border-white/5 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <MessageSquare size={20} className="text-[#e87315] sm:w-6 sm:h-6 -rotate-3 group-hover:-rotate-12 transition-transform" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#e87315] animate-pulse" />
          </div>
          <div>
            <h2 className="text-[12px] sm:text-[14px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] italic">Projects I Reviewed</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-4 bg-[#e87315]/40" />
              <p className="text-[8px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {loading ? '...' : `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} reviewed`}
              </p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4 sm:space-y-6 custom-scrollbar max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/[0.01] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : projects.length > 0 ? projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/dashboard/project/${project._id}`)}
              className="relative group/item bg-transparent border-l border-white/5 hover:border-[#e87315] pl-4 sm:pl-6 py-2 transition-all duration-500 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Image/Icon Section */}
                <div className="relative shrink-0 flex sm:block justify-between items-start">
                  {project.images?.[0] ? (
                    <img
                      src={project.images[0]}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-none object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500 border border-white/10"
                      alt={project.title}
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#080808] border border-white/5 flex items-center justify-center">
                      <span className="text-[#e87315] font-black text-base sm:text-lg">E</span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#080808] flex items-center justify-center border border-white/10 hidden sm:flex">
                    <ArrowUpRight size={10} className="text-[#e87315]" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest group-hover/item:text-[#e87315] transition-colors truncate">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-[8px] sm:text-[9px] font-bold text-white/20 uppercase tracking-tighter truncate mb-2 sm:mb-3">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 sm:gap-4 opacity-40 group-hover/item:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1.5">
                        <Eye size={10} className="text-white" />
                        <span className="text-[8px] sm:text-[9px] font-mono text-white">{project.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart size={10} className="text-white" />
                        <span className="text-[8px] sm:text-[9px] font-mono text-white">{project.likes?.length || 0}</span>
                      </div>
                    </div>

                    <span className="text-[7px] sm:text-[8px] font-black text-[#e87315] uppercase tracking-widest px-2 py-1 bg-[#e87315]/5 border border-[#e87315]/20 shrink-0">
                      {project.myCommentCount} {project.myCommentCount === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>

                  {/* Comment Preview */}
                  {project.latestComment?.content && (
                    <div className="relative">
                      <div className="absolute left-0 top-0 h-full w-[1px] bg-white/5" />
                      <p className="text-[9px] sm:text-[10px] text-white/40 italic leading-relaxed pl-3 sm:pl-4 line-clamp-2 sm:line-clamp-1">
                        "{project.latestComment.content}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 border border-dashed border-white/5 mx-1">
              <div className="relative mb-5 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border border-white/5 flex items-center justify-center rotate-45">
                  <MessageSquare size={20} className="text-white/10 sm:w-6 sm:h-6 -rotate-45" />
                </div>
              </div>
              <h3 className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] sm:tracking-[0.5em] text-center">No reviews yet</h3>
              <p className="text-[8px] sm:text-[9px] font-bold text-white/10 uppercase tracking-widest mt-2 italic text-center px-4">Projects you comment on will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Corner Accents */}
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#e87315]" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
    </div>
  );
};

export default ProjectsCommentedOn;