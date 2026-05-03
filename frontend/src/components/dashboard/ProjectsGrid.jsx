import React, { useState, useEffect } from 'react';
import { Eye, Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProjectsGrid = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectAPI.getMyProjects();
        // Get only the most recent project
        if (response.data.length > 0) {
          setProject(response.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStageColor = (stage) => {
    switch (stage) {
      case 'idea': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'prototype': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'mvp': return 'bg-[#e87315]/10 text-[#e87315] border-[#e87315]/20';
      case 'launched': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="card-structured p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">

      {/* Header */}

      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 gap-4 sm:gap-0">
        <div>
          <h2 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] italic flex items-center gap-2">
            <span className="w-1 h-3 bg-[#e87315]" />
            Latest Project
          </h2>
          <p className="text-[8px] sm:text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 ml-3">
            Your latest deployed project
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/project')}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-transparent hover:bg-[#e87315]/5 border border-white/10 hover:border-[#e87315] text-[9px] font-black text-white/40 hover:text-[#e87315] uppercase tracking-[0.2em] transition-all relative group text-center"
        >
          <span className="relative z-10">[Manage project]</span>
          <div className="absolute top-0 right-0 w-1 h-1 bg-[#e87315]/40" />
        </button>
      </div>

      {/* ── Project Card ── */}
      {loading ? (
        <div className="h-64 bg-white/[0.02] border border-white/5 animate-pulse relative">
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Fetching Data...</div>
        </div>
      ) : project ? (
        <div
          onClick={() => navigate(`/dashboard/project/${project._id}`)}
          className="group bg-[#080808] border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden flex flex-col md:flex-row h-full md:h-72"
        >
          {/* 1. LEFT ACCENT LINE */}
          <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-700 z-20" />

          {/* 2. PROJECT IMAGE (Grayscale to Color) */}
          {project.images?.[0] && (
            <div className="relative w-full md:w-80 h-40 sm:h-48 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5 flex-shrink-0">
              <img
                src={project.images[0]}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                alt={project.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-60" />
            </div>
          )}

          {/* 3. CONTENT AREA */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none hidden sm:block"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3 sm:mb-4 gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#e87315] italic opacity-50">PROJECT TITLE</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-[#e87315] transition-colors uppercase tracking-tight flex items-center gap-2 sm:gap-3 truncate">
                    <span className="truncate">{project.title}</span>
                    <ArrowUpRight size={16} className="text-white/10 group-hover:text-[#e87315] transition-all shrink-0 hidden sm:block" />
                  </h3>
                </div>
                <span className={`px-2 sm:px-3 py-1 border text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] bg-transparent shrink-0 ${getStageColor(project.stage)}`}>
                  {project.stage}
                </span>
              </div>

              <p className="text-[10px] sm:text-[11px] text-white/40 font-medium leading-relaxed max-w-md tracking-wide line-clamp-2 sm:line-clamp-3">
                {project.tagline}
              </p>
            </div>

            {/* 4. TECHNICAL STATS BLOCK */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8 relative z-10 pt-4 sm:pt-6 border-t border-white/5">

              {/* ── View Counter ── */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                  <Eye size={14} className="text-[#e87315] sm:w-4 sm:h-4" />
                </div>
                <p className="text-lg sm:text-xl font-light text-white tabular-nums tracking-tighter">
                  {project.viewCount?.toLocaleString().padStart(2, '0') || '00'}
                </p>
              </div>

              {/* ── Affinity Index ── */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                  <Heart size={14} className="text-[#e87315] sm:w-4 sm:h-4" />
                </div>
                <p className="text-lg sm:text-xl font-light text-white tabular-nums tracking-tighter">
                  {project.likes?.length.toString().padStart(2, '0') || '00'}
                </p>
              </div>

              {/* ── Category Node ── */}
              <div className="hidden lg:block space-y-2">
                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity mb-2.5">
                  <div className="w-1 h-1 bg-[#e87315]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Category</span>
                </div>
                <p className="text-[15px] font-black text-white/60 uppercase tracking-widest truncate italic">
                  {project.category || 'GENERAL_ASSET'}
                </p>
              </div>

              {/* ── Ownership ID Block ── */}
              <div className="flex items-end justify-end col-span-2 lg:col-span-1 absolute right-0 bottom-0 lg:relative">
                <div className="flex items-center group/owner">
                  {/* Profile Image with sharp frame */}
                  <div className="relative">
                    <img
                      src={user?.profileImage}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${user?.name}&bold=true`;
                      }}
                      className="w-7 h-7 sm:w-9 sm:h-9 border border-white/10 grayscale group-hover/owner:grayscale-0 transition-all object-cover relative z-10"
                      alt={user?.name}
                    />
                    {/* Subtle corner accent */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]/40" />
                  </div>

                  {/* Linked Data Tag - No overlap, pure architectural join */}
                  <div className="h-7 sm:h-9 px-2 sm:px-3 flex flex-col justify-center border-y border-r border-white/10 bg-white/[0.02] group-hover/owner:border-[#e87315]/30 transition-colors">
                    <span className="text-[5px] sm:text-[6px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                    <span className="text-[7px] sm:text-[8px] font-black text-[#e87315] uppercase tracking-[0.2em]">
                      OWNER
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => navigate('/dashboard/create')}
          className="h-32 sm:h-48 flex flex-col items-center justify-center bg-transparent border border-dashed border-white/10 relative group cursor-pointer hover:bg-white/[0.01] transition-all"
        >
          <div className="absolute top-2 left-2 w-1 h-1 bg-white/10 group-hover:bg-[#e87315]" />
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/10 group-hover:bg-[#e87315]" />

          <p className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] sm:tracking-[0.5em] group-hover:text-white transition-colors text-center px-4">
            Nothing to show here
          </p>
          <p className="text-[8px] sm:text-[9px] font-bold text-white/10 mt-2 uppercase tracking-[0.2em] group-hover:text-[#e87315] transition-colors text-center px-4">
            Deploy your first project in the evolve
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;