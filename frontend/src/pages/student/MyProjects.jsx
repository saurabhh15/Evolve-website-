import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import { Plus, Edit, Trash2, Eye, Heart, ExternalLink, Cat, Users, TrendingUp, X, FolderOpenDot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const MyProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [likedProjects, setLikedProjects] = useState({});
  const [editTagInput, setEditTagInput] = useState('');

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectAPI.getMyProjects();

        setMyProjects(response.data);
        const initialLikes = {};
        response.data.forEach(p => {
          initialLikes[p._id] = p.likes.includes(user?._id);
        });
        setLikedProjects(initialLikes);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  useEffect(() => {
    if (editingProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingProject]);


  const getStageColor = (stage) => {
    switch (stage) {
      case 'idea': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'prototype': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'mvp': return 'bg-[#e87315] text-[#080808] border border-[#e87315]';
      case 'launched': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

  const handleDelete = (projectId) => {
    setDeleteProjectId(projectId);
  };

  const confirmDelete = async () => {
    try {
      await projectAPI.delete(deleteProjectId);
      setMyProjects(prev => prev.filter(p => p._id !== deleteProjectId));
      setDeleteProjectId(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
      setDeleteProjectId(null);
    }
  };

  const handleToggleLike = async (projectId) => {
    try {
      await projectAPI.toggleLike(projectId);
      setLikedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
      setMyProjects(prev =>
        prev.map(p =>
          p._id === projectId
            ? {
              ...p, likes: likedProjects[projectId]
                ? p.likes.filter(id => id !== user?._id)
                : [...p.likes, user?._id]
            }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };


  const closeEditModal = () => {
    setEditingProject(null);
    setEditForm({});
    setEditTagInput('');
  };


  const handleEditSubmit = async () => {
    try {
      setEditLoading(true);
      const cleanedForm = {
        ...editForm,
        tags: editForm.tags.filter(tag => tag.trim() !== '')
      };
      const response = await projectAPI.update(editingProject._id, cleanedForm);
      setMyProjects(prev =>
        prev.map(p => p._id === editingProject._id ? response.data : p)
      );
      setEditingProject(null);
      setEditForm({});
    } catch (err) {
      console.error('Failed to update project:', err);
    } finally {
      setEditLoading(false);
    }
  };



  if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <p className="text-red-400 font-semibold">{error}</p>
    </div>
  );


  return (


    <div className="w-full space-y-8 px-4 md:px-8 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-evolve-in pt-6">
        <div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white/90 mb-2 tracking-tighter italic uppercase">
            My Projects<span className="text-[#e87315]">.</span>
          </h1>
          <p className="text-white/60 font-medium tracking-wide uppercase text-[14px] sm:text-[16px] italic">
            Create/View Your projects
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/create')}
          className="group relative flex items-center gap-6 sm:gap-10 px-8 sm:px-12 py-4 sm:py-5 bg-white/[0.05] transition-all duration-500 overflow-hidden rounded-sm"
        >
          {/* 1. THE ARCHITECTURAL FRAME */}
          {/* Thin base border */}
          <div className="absolute inset-0 border border-white/20" />

          {/* The "Classy" Orange Accents - Only the corners grow on hover */}
          <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700 ease-in-out" />
          <div className="absolute bottom-0 right-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700 ease-in-out" />

          {/* 2. THE SCAN LINE (Subtle light leak that passes through) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#e87315]/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

          {/* 3. CONTENT LAYER */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            {/* Minimalist Plus: No rotation, just a color shift */}
            <div className="relative flex items-center justify-center">
              <Plus
                size={18}
                strokeWidth={1.5}
                className="text-white/60 group-hover:text-[#e87315] transition-colors duration-500 sm:w-5 sm:h-5"
              />
              {/* Ghost glow behind the plus */}
              <div className="absolute inset-0 blur-sm bg-[#e87315]/0 group-hover:bg-[#e87315]/20 transition-all duration-500 rounded-full" />
            </div>

            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.4em] sm:tracking-[0.6em] uppercase text-white/60 group-hover:text-white/90 transition-colors duration-500">
              Add<span className="text-[#e87315]/0 group-hover:text-[#e87315] transition-colors">_</span>Project
            </span>
          </div>

        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-white/10 mb-12 bg-[#0c0c0c]">
        {[
          { label: 'Total Projects', val: myProjects.length, icon: <FolderOpenDot size={16} /> },
          { label: 'Total Views', val: myProjects.reduce((sum, p) => sum + p.viewCount, 0), icon: <Eye size={16} /> },
          { label: 'Total Likes', val: myProjects.reduce((sum, p) => sum + p.likes.length, 0), icon: <Heart size={16} /> },
          { label: 'Team', val: myProjects.reduce((sum, p) => sum + p.teamSize, 0), icon: <Users size={16} /> }
        ].map((stat, i) => (
          <div
            key={i}
            className={`group relative p-6 sm:p-8 transition-all duration-500 hover:bg-white/[0.02] 
        ${i !== 3 ? 'lg:border-r border-white/10' : ''} 
        border-b sm:border-b-0 border-white/10`}
          >
            {/* 1. TOP INDICATOR LINE */}
            <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-white/20 group-hover:bg-[#e87315] group-hover:w-full transition-all duration-700" />

            {/* 2. HEADER: LABEL + ICON */}
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <p className="text-white/50 text-[10px] sm:text-[11px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase italic group-hover:text-[#e87315] transition-colors">
                {stat.label}
              </p>
              <div className="text-white/40 group-hover:text-[#e87315] transition-all duration-500 transform group-hover:scale-110">
                {stat.icon}
              </div>
            </div>

            {/* 3. VALUE SECTION */}
            <div className="flex items-baseline gap-4">
              <p className="text-4xl sm:text-5xl font-light text-white/90 tracking-tighter tabular-nums group-hover:tracking-normal transition-all duration-500 origin-left">
                {stat.val.toString().padStart(2, '0')}
              </p>

              {/* Optical Divider */}
              <div className="h-[2px] w-4 bg-white/10 group-hover:bg-[#e87315]/60 transition-all" />
            </div>

          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="flex flex-col gap-20 sm:gap-24 py-8 sm:py-12">
        {myProjects.map((project, index) => (
          <div
            key={project._id}
            onClick={() => navigate(`/dashboard/project/${project._id}`)}
            className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 animate-evolve-in"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            {/* 1. PROJECT INDEX & INDICATOR */}
            <div className="md:col-span-1 flex flex-col items-start gap-4 hidden md:flex">
              <span className="text-[11px] sm:text-[12px] font-mono text-white/40 group-hover:text-[#e87315] transition-colors duration-500">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="w-[2px] h-full bg-white/10 group-hover:bg-[#e87315] transition-all duration-700 origin-top" />
            </div>

            {/* 2. IMAGE SECTION */}
            <div className="md:col-span-5 relative overflow-hidden">

              {/* IMAGE OR FALLBACK */}
              {project.images && project.images[0] ? (
                <div className="relative aspect-video border border-white/20">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-[#0c0c0c] border border-white/20 flex items-center justify-center">
                  <span className="text-white/50 text-xs sm:text-sm font-black tracking-widest uppercase">No Image</span>
                </div>
              )}

              {/* ✅ ACTION BUTTONS (ALWAYS RENDER) */}
              <div className="absolute top-4 right-4 flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                    setEditForm({
                      title: project.title || '',
                      tagline: project.tagline || '',
                      description: project.description || '',
                      category: project.category || '',
                      stage: project.stage || '',
                      teamSize: project.teamSize || 1,
                      demoUrl: project.demoUrl || '',
                      githubUrl: project.githubUrl || '',
                      tags: project.tags || [],
                      lookingFor: project.lookingFor || [],
                      images: project.images || [],
                    });
                  }}
                  className="p-3 sm:p-3.5 bg-white/90 text-black hover:bg-[#e87315] hover:text-white transition-colors"
                >
                  <Edit size={16} className="sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project._id);
                  }}
                  className="p-3 sm:p-3.5 bg-white/90 text-black hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Trash2 size={16} className="sm:w-4 sm:h-4" />
                </button>
              </div>

            </div>

            {/* 3. INFO SECTION */}
            <div className="md:col-span-6 flex flex-col justify-between py-2">
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white/90 italic uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-500 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="h-[2px] flex-grow bg-white/10 group-hover:bg-[#e87315]/40 transition-colors" />
                  <span className={`text-[10px] sm:text-[11px] font-black tracking-[0.3em] uppercase px-3 py-1.5 shrink-0 ${getStageColor(project.stage)}`}>
                    {project.stage}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-white/60 font-medium mb-4 italic truncate">{project.tagline}</p>

                {/* LOOKING FOR TAGS - Re-added with minimalist styling */}
                {project.lookingFor && project.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mb-5 sm:mb-6">
                    {project.lookingFor.map((item, i) => (
                      <span key={i} className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-[#e87315] flex items-center gap-2 bg-[#e87315]/5 px-2.5 py-1 border border-[#e87315]/20">
                        <span className="w-1.5 h-1.5 bg-[#e87315]" />
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[12px] sm:text-[13px] text-white/70 line-clamp-2 sm:line-clamp-3 max-w-xl font-medium leading-relaxed mb-6 sm:mb-8">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-2.5">
                  {project.tags.filter(tag => tag.trim() !== '').slice(0, 3).map((tag, i) => (
                    <div key={i} className="group/tag flex items-center gap-1.5 sm:gap-2">
                      {/* Tiny orange bracket that glows on group-hover */}
                      <span className="text-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-mono text-[11px] sm:text-[12px]">
                        [
                      </span>

                      <span className="text-[10px] sm:text-[11px] font-black text-white/40 group-hover:text-white/80 tracking-[0.2em] uppercase transition-all duration-300">
                        {tag}
                      </span>

                      <span className="text-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-mono text-[11px] sm:text-[12px]">
                        ]
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER & LINKS */}
              <div className="flex flex-wrap items-center justify-between mt-8 sm:mt-12 gap-6">
                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-light text-white/90 tabular-nums">{project.viewCount}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest">Views</span>
                  </div>

                  {/* LIKE BUTTON - Updated to Pink Theme */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleLike(project._id); }}
                    className={`flex items-baseline gap-2 transition-colors ${likedProjects[project._id] ? 'text-[#ff69b4]' : 'text-white/50 hover:text-white/90'
                      }`}
                  >
                    <Heart
                      size={18}
                      className="translate-y-0.5 sm:w-5 sm:h-5"
                      fill={likedProjects[project._id] ? 'currentColor' : 'none'}
                    />
                    <span className="text-xl sm:text-2xl font-light tabular-nums">
                      {project.likes.length}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${likedProjects[project._id] ? 'text-[#ff69b4]' : 'text-white/50'}`}>
                      Likes
                    </span>
                  </button>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-light text-white/90 tabular-nums">{project.teamSize}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest">Team member</span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 sm:gap-8 border-l border-white/10 pl-6 sm:pl-8">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link relative flex items-center gap-2 text-white/60 hover:text-[#e87315] transition-all duration-300"
                    >
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-100 sm:opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                        Live_Site
                      </span>
                      <ExternalLink size={18} strokeWidth={2} className="group-hover/link:rotate-12 transition-transform sm:w-[20px] sm:h-[20px]" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link relative flex items-center gap-2 text-white/60 hover:text-[#e87315] transition-all duration-300"
                    >
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-100 sm:opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                        Github
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="group-hover/link:scale-110 transition-transform sm:w-[20px] sm:h-[20px]"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {myProjects.length === 0 && (
        <div className="relative min-h-[60vh] flex flex-col items-start justify-center py-20 px-4 sm:px-8 animate-evolve-in">
          {/* Background Decorative Index */}
          <div className="absolute top-0 left-0 text-[20vw] font-black text-white/[0.03] leading-none select-none pointer-events-none italic tracking-tighter">
            00
          </div>

          <div className="relative z-10 space-y-8 max-w-2xl">
            {/* Structural Accent */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#e87315]" />
              <span className="text-[10px] font-mono text-[#e87315] uppercase tracking-[0.5em]">
                System_Empty
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-5xl sm:text-6xl md:text-7xl font-black text-white/90 italic uppercase tracking-tighter leading-none">
                No Project <br />
                <span className="text-white/40">Detected</span>
              </h3>
              <p className="text-[15px] sm:text-base text-white/60 font-medium italic max-w-md leading-relaxed">
                Create your first project to begin the evolution cycle.
              </p>
            </div>

            {/* The Interaction Point */}
            <button
              onClick={() => navigate('/dashboard/create')}
              className="group relative flex items-center gap-5 sm:gap-6 py-4 transition-all"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 border border-white/20 flex items-center justify-center group-hover:border-[#e87315] transition-colors duration-500">
                <Plus size={24} className="text-white/80 group-hover:text-[#e87315] transition-colors sm:w-7 sm:h-7" strokeWidth={1.5} />
                {/* Animated corner accents for the button */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-[#e87315] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] group-hover:text-[#e87315] transition-colors">
                  Create Project
                </span>
              </div>
            </button>
          </div>

          {/* Technical Crosshair Decoration (Bottom Right) */}
          <div className="absolute bottom-10 right-10 opacity-20 hidden md:block">
            <div className="w-20 h-20 relative">
              <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
              <div className="absolute left-1/2 top-0 w-px h-full bg-white" />
              <div className="absolute inset-4 border border-white rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal - Ghost Architect Design */}
      {editingProject && (
        <div
          className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500"
          onClick={() => { setEditingProject(null); setEditForm({}); }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="relative bg-[#0c0c0c] border border-white/20 w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Visual Accent - Top Progress Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#e87315] to-transparent opacity-70" />

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10">
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-[11px] font-black text-[#e87315] tracking-[0.4em] uppercase">Configuration_Portal</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white/90 italic uppercase tracking-tighter">Edit Project_</h2>
              </div>
              <button
                onClick={() => { setEditingProject(null); setEditForm({}); }}
                className="group p-2 transition-all"
              >
                <X size={24} className="text-white/40 group-hover:text-white transition-colors sm:w-7 sm:h-7" />
              </button>
            </div>

            {/* Modal Body - Technical Inputs */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 sm:gap-y-10">

                {/* Left Column: Core Data */}
                <div className="space-y-8 sm:space-y-10">
                  {/* Title */}
                  <div className="group/input">
                    <label className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-black text-white/60 group-focus-within/input:text-[#e87315] uppercase tracking-[0.3em] mb-3 sm:mb-4 transition-colors">
                      <span className="w-1.5 h-1.5 bg-current" /> Project Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white/[0.05] border-b-2 border-white/20 focus:border-[#e87315] px-4 py-3 sm:py-3.5 text-lg sm:text-xl font-bold text-white/90 focus:outline-none transition-all placeholder:text-white/30"
                      placeholder="Enter project name..."
                    />
                  </div>

                  {/* Tagline */}
                  <div className="group/input">
                    <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">Motto / Tagline</label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={e => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#e87315] px-2 py-2 sm:py-3 text-[12px] sm:text-[13px] font-medium italic text-white/80 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div className="group/input">
                    <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">Executive Summary</label>
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      className="w-full bg-white/[0.05] border border-white/20 focus:border-[#e87315]/50 p-4 sm:p-5 text-[12px] sm:text-[13px] leading-relaxed text-white/80 focus:outline-none transition-all resize-none font-medium"
                    />
                  </div>
                </div>

                {/* Right Column: Specs & Assets */}
                <div className="space-y-8 sm:space-y-10">
                  {/* Image URL */}
                  <div className="group/input">
                    <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">Media_Asset_Source</label>
                    <input
                      type="url"
                      value={editForm.images?.[0] || ''}
                      placeholder="https://source.unsplash.com/..."
                      onChange={e => setEditForm(prev => ({ ...prev, images: [e.target.value] }))}
                      className="w-full bg-white/[0.05] border border-white/20 focus:border-[#e87315]/50 px-4 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-[12px] font-mono text-[#e87315] focus:outline-none transition-all placeholder:text-white/30"
                    />
                  </div>

                  {/* Category + Stage */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">Sector</label>
                      <select
                        value={editForm.category}
                        onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-white/[0.05] border border-white/20 p-3 sm:p-4 text-[11px] sm:text-[12px] font-bold text-white/90 uppercase tracking-widest focus:outline-none focus:border-[#e87315] cursor-pointer"
                      >
                        {['AI/ML', 'Web Dev', 'Mobile App', 'IoT', 'Blockchain', 'HealthTech', 'EdTech', 'FinTech'].map(c => (
                          <option key={c} value={c} className="bg-[#0c0c0c]">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">Lifecycle</label>
                      <select
                        value={editForm.stage}
                        onChange={e => setEditForm(prev => ({ ...prev, stage: e.target.value }))}
                        className="w-full bg-white/[0.05] border border-white/20 p-3 sm:p-4 text-[11px] sm:text-[12px] font-bold text-white/90 uppercase tracking-widest focus:outline-none focus:border-[#e87315] cursor-pointer"
                      >
                        {['idea', 'prototype', 'mvp', 'launched'].map(s => (
                          <option key={s} value={s} className="bg-[#0c0c0c]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="group/input">
                    <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-3 sm:mb-4 block">Tech_Stack_Module</label>
                    <div className="flex flex-wrap gap-2.5 mb-3 sm:mb-4">
                      {editForm.tags?.map((tag, i) => (
                        <span key={i} className="flex items-center gap-2 px-2.5 py-1.5 border border-white/20 bg-white/10 text-[10px] sm:text-[11px] font-black text-white/70 uppercase tracking-tighter">
                          {tag}
                          <button onClick={() => setEditForm(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))}>
                            <X size={12} className="hover:text-red-500 transition-colors" strokeWidth={3} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="ADD_MODULE +"
                      value={editTagInput}
                      onChange={e => setEditTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && editTagInput.trim()) {
                          e.preventDefault();
                          if (!editForm.tags.includes(editTagInput.trim())) {
                            setEditForm(prev => ({ ...prev, tags: [...prev.tags, editTagInput.trim()] }));
                          }
                          setEditTagInput('');
                        }
                      }}
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#e87315] py-2.5 sm:py-3 text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-white/90 placeholder:text-white/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Bottom Sections */}
              <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-12">
                {/* Looking For */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mb-4 sm:mb-5 block text-center">Collaboration_Requirements</label>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    {['mentor', 'co-founder', 'investor', 'feedback', 'team-member'].map(item => (
                      <button
                        key={item}
                        onClick={() => setEditForm(prev => ({
                          ...prev,
                          lookingFor: prev.lookingFor.includes(item)
                            ? prev.lookingFor.filter(i => i !== item)
                            : [...prev.lookingFor, item]
                        }))}
                        className={`px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 border ${editForm.lookingFor?.includes(item)
                            ? 'bg-[#e87315] border-[#e87315] text-black shadow-[0_0_15px_rgba(232,115,21,0.4)]'
                            : 'bg-transparent border-white/20 text-white/50 hover:border-white/40 hover:text-white/90'
                          }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 bg-white/[0.02] p-6 sm:p-8 border border-white/10">
                  <div className="space-y-2.5">
                    <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-widest">Deployment_Link</label>
                    <div className="flex items-center gap-3 border-b-2 border-white/20 focus-within:border-[#e87315] transition-colors">
                      <ExternalLink size={16} className="text-white/40" />
                      <input
                        type="text"
                        value={editForm.demoUrl}
                        onChange={e => setEditForm(prev => ({ ...prev, demoUrl: e.target.value }))}
                        className="w-full bg-transparent py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-bold text-white/80 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] sm:text-[11px] font-black text-white/60 uppercase tracking-widest">Repository_Link</label>
                    <div className="flex items-center gap-3 border-b-2 border-white/20 focus-within:border-[#e87315] transition-colors">
                      <Cat size={16} className="text-white/40" />
                      <input
                        type="text"
                        value={editForm.githubUrl}
                        onChange={e => setEditForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                        className="w-full bg-transparent py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-bold text-white/80 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center bg-[#0c0c0c] p-6 sm:p-8 border-t border-white/10 gap-6">
              <button
                onClick={() => { setEditingProject(null); setEditForm({}); }}
                className="text-[10px] sm:text-[11px] font-black text-white/50 hover:text-white uppercase tracking-[0.4em] transition-colors"
              >
                Abort_Changes
              </button>
              <div className="flex-grow h-[2px] bg-white/10" />
              <button
                onClick={handleEditSubmit}
                disabled={editLoading}
                className="relative px-8 sm:px-12 py-4 sm:py-5 bg-white text-black font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] hover:bg-[#e87315] hover:text-white transition-all disabled:opacity-50"
              >
                {editLoading ? 'Syncing...' : 'Confirm_Update'}
              </button>
            </div>
          </div>
        </div>
      )}
      {
        deleteProjectId && (
          <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={() => {
              setEditingProject(null); // This closes the Edit modal
              setDeleteProjectId(null); // This closes the Delete modal
              setEditForm({});
            }}>
            {/* Container with sharp edges and red thematic border */}
            <div className="relative bg-[#0c0c0c] border border-red-900/50 max-w-md w-full p-8 sm:p-10 shadow-[0_0_60px_rgba(220,38,38,0.1)] animate-evolve-in overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Technical Top Bar Decor */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-600 text-[9px] sm:text-[10px] font-black text-black uppercase tracking-[0.3em] italic">
                Critical_Action
              </div>

              {/* Warning Icon - Square Blueprint Style */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto mb-8 sm:mb-10 relative">
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-red-600" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-red-600" />
                <Trash2 size={36} className="text-red-500 sm:w-10 sm:h-10" strokeWidth={1.5} />
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12">
                <h3 className="text-2xl sm:text-3xl font-black text-white/90 italic uppercase tracking-tighter">
                  Delete This Project?
                </h3>
                <p className="text-[11px] sm:text-[12px] font-mono font-bold text-red-500/80 uppercase tracking-widest leading-relaxed px-4">
                  Warning: This operation will permanently erase the data module. Recovery is not possible.
                </p>
              </div>

              {/* Buttons - High Contrast Square Layout */}
              <div className="flex flex-col gap-3.5 sm:gap-4">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 sm:py-5 bg-red-600 hover:bg-red-500 text-black font-black text-[11px] sm:text-xs uppercase tracking-[0.4em] italic transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  Confirm Deletion
                </button>

                <button
                  onClick={() => setDeleteProjectId(null)}
                  className="w-full py-4 sm:py-5 bg-transparent border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-black text-[11px] sm:text-[12px] uppercase tracking-[0.4em] transition-all"
                >
                  Abort Action
                </button>
              </div>

              {/* Bottom Metadata Label */}
              <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 text-center">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.5em]">
                  Project_UID: {deleteProjectId.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default MyProjects;