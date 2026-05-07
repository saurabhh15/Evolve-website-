import React, { useState, useEffect, useMemo } from 'react';
import { Search, Heart, Eye, Users, ArrowUpRight, X, SlidersHorizontal } from 'lucide-react';
import { projectAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const ExploreProjects = () => {
  // state
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProjects, setLikedProjects] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedLookingFor, setSelectedLookingFor] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'AI/ML', 'Web Dev', 'Mobile App', 'IoT', 'Blockchain', 'HealthTech', 'EdTech', 'FinTech'];
  const stages = ['All', 'idea', 'prototype', 'mvp', 'launched'];
  const lookingForOptions = ['All', 'mentor', 'co-founder', 'investor', 'feedback', 'team-member'];

  const PAGE_LIMIT = 10;

  // projects fetch
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectAPI.getAll({ page: 1, limit: PAGE_LIMIT });

        // Safely extract projects based on standard backend pagination formats
        const fetchedProjects = Array.isArray(response.data) 
          ? response.data 
          : (response.data.projects || response.data.data || []);

        setAllProjects(fetchedProjects);
        const initialLikes = {};
        fetchedProjects.forEach(p => {
          initialLikes[p._id] = p.likes?.includes(user?._id);
        });
        setLikedProjects(initialLikes);

        // Calculate hasMore based on backend totals or array length
        const totalPages = response.data.totalPages || response.data.pagination?.pages;
        if (totalPages !== undefined) {
          setHasMore(1 < totalPages);
        } else {
          setHasMore(fetchedProjects.length === PAGE_LIMIT);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user?._id]);

  // ========== FILTERS ==========
  const hasActiveFilters = searchTerm || selectedCategory || selectedStage || selectedLookingFor;

  const clearAll = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStage('');
    setSelectedLookingFor('');
  };

  const handleToggleLike = async (projectId) => {
    try {
      await projectAPI.toggleLike(projectId);
      setLikedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
      setAllProjects(prev =>
        prev.map(p =>
          p._id === projectId
            ? {
              ...p, likes: likedProjects[projectId]
                ? p.likes.filter(id => id !== user?._id && id !== 'me')
                : [...(p.likes || []), user?._id || 'me']
            }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await projectAPI.getAll({ page: nextPage, limit: PAGE_LIMIT });
      
      const fetchedProjects = Array.isArray(response.data) 
          ? response.data 
          : (response.data.projects || response.data.data || []);

      setAllProjects(prev => [...prev, ...fetchedProjects]);
      const moreLikes = {};
      fetchedProjects.forEach(p => {
        moreLikes[p._id] = p.likes?.includes(user?._id);
      });
      setLikedProjects(prev => ({ ...prev, ...moreLikes }));
      
      const totalPages = response.data.totalPages || response.data.pagination?.pages;
      if (totalPages !== undefined) {
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(fetchedProjects.length === PAGE_LIMIT);
      }
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredProjects = useMemo(() => allProjects.filter(p => {
    const matchesSearch = !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStage = !selectedStage || selectedStage === 'All' || p.stage === selectedStage;
    const matchesLookingFor = !selectedLookingFor || selectedLookingFor === 'All' || p.lookingFor?.includes(selectedLookingFor);
    return matchesSearch && matchesCategory && matchesStage && matchesLookingFor;
  }), [searchTerm, selectedCategory, selectedStage, selectedLookingFor, allProjects]);

  // ========== HELPER FUNCTIONS ==========
  const getStageBadge = (stage) => {
    switch (stage) {
      case 'idea': return { label: 'Idea', classes: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' };
      case 'prototype': return { label: 'Prototype', classes: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' };
      case 'mvp': return { label: 'MVP', classes: 'bg-[#e87315] text-[#080808] border border-[#e87315]' };
      case 'launched': return { label: 'Launched', classes: 'bg-green-500/20 text-green-300 border border-green-500/30' };
      default: return { label: stage, classes: 'bg-white/10 text-white/70 border border-white/20' };
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


  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/50 font-black uppercase tracking-widest text-[11px]">Loading projects...</p>
        </div>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="card-structured max-w-md text-center py-12">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X size={32} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-white/90 mb-2">Failed to Load Projects</h3>
          <p className="text-white/50 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-evolve btn-evolve-primary inline-flex"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-10">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10 pb-16 border-b border-white/10">
        <div className="relative">
          {/* Vertical Technical Accent */}
          <div className="absolute -left-6 top-0 w-[2px] h-full bg-[#e87315] hidden md:block" />

          <h1 className="text-5xl md:text-7xl font-black text-white/90 mb-4 tracking-tighter italic uppercase leading-[0.8]">
            Explore Project<span className="text-[#e87315]">.</span>
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-12 h-[2px] bg-[#e87315]/60" />
            <p className="text-white/60 font-bold tracking-[0.2em] uppercase text-[11px] sm:text-[12px] italic leading-relaxed max-w-lg">
              Browse real student-built products in motion. Find ideas, join teams, or contribute to systems that are actively evolving.
            </p>
          </div>
        </div>

        {/* Search Module */}
        <div className="relative w-full md:w-[450px] flex-shrink-0 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-[#e87315] transition-colors z-10"
            size={20}
            strokeWidth={2.5}
          />

          <input
            type="text"
            placeholder="Skill / Name / Company"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c0c0c] border border-white/20 group-hover:border-white/40 focus:border-[#e87315] rounded-none pl-16 pr-8 py-5 sm:py-6 text-[12px] sm:text-[13px] font-black text-white/90 placeholder-white/30 focus:outline-none transition-all uppercase tracking-widest italic"
          />

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700" />

          {/* Corner Decals */}
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/30" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/30" />
        </div>
      </header>

      {/* Filters System */}
      <div className="py-10 border-b border-white/10 animate-evolve-in" style={{ animationDelay: '0.08s' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-[#e87315]" />
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={20} className="text-[#e87315]" strokeWidth={2.5} />
              <h3 className="text-[11px] sm:text-xs font-black text-white/90 uppercase tracking-[0.4em]">Filter Parameters</h3>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="group flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-[#e87315] text-black transition-all duration-300"
            >
              <X size={16} strokeWidth={3} />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest italic">Reset All Modules</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            { label: 'Category', value: selectedCategory, onChange: setSelectedCategory, options: categories },
            { label: 'Stage', value: selectedStage, onChange: setSelectedStage, options: stages },
            { label: 'Collaboration Type', value: selectedLookingFor, onChange: setSelectedLookingFor, options: lookingForOptions },
          ].map(({ label, value, onChange, options }, index) => (
            <div key={label} className="relative group">
              {/* Architectural Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] sm:text-[11px] font-mono text-white/40 uppercase tracking-widest">0{index + 1}</span>
                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] group-hover:text-[#e87315] transition-colors">
                  {label}
                </label>
              </div>

              <div className="relative">
                <select
                  value={value}
                  onChange={e => onChange(e.target.value === 'All' ? '' : e.target.value)}
                  className="w-full appearance-none bg-[#0c0c0c] border border-white/20 group-hover:border-white/40 px-5 py-4 text-[12px] sm:text-[13px] font-black text-white/90 uppercase tracking-widest focus:outline-none focus:border-[#e87315] cursor-pointer transition-all italic"
                >
                  {options.map(opt => (
                    <option key={opt} value={opt} className="bg-[#0c0c0c] text-white py-4">
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Custom Architectural Arrow (The Chevron) */}
                <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none border-l border-white/10 bg-white/[0.02]">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-[#e87315] rotate-45 mb-1 opacity-80" />
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-[10px] sm:text-[11px] text-white/60 font-black uppercase tracking-[0.2em]">
              Results Found: <span className="text-white italic">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </p>
            <div className="h-px w-12 bg-[#e87315]/50" />
          </div>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredProjects.map((project, index) => {
            const badge = getStageBadge(project.stage);

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/dashboard/project/${project._id}`)}
                className="group relative flex flex-col bg-[#0c0c0c] border border-white/20 hover:border-[#e87315] transition-all duration-500 cursor-pointer animate-evolve-in shadow-2xl"
                style={{ animationDelay: `${0.15 + (index % 6) * 0.06}s` }}
              >
                {/* Image Module */}
                <div className="relative h-56 overflow-hidden border-b border-white/10">
                  <img
                    src={project.images?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />

                  <div className="absolute top-0 left-0">
                    <span className={`px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] font-black uppercase italic tracking-[0.2em] inline-block ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="absolute bottom-5 right-6">
                    <span className="text-[10px] sm:text-[11px] font-black text-white/70 uppercase tracking-[0.4em] border-r-4 border-[#e87315] pr-3 italic">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6 sm:p-8 gap-6 sm:gap-7">

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white/90 group-hover:text-[#e87315] transition-colors leading-none uppercase italic tracking-tighter line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] sm:text-[12px] font-bold text-white/60 leading-relaxed line-clamp-2 uppercase tracking-widest italic">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Creator Module */}
                  <div className="flex items-center gap-4 py-4 border-y border-white/10 bg-white/[0.02] px-4">
                    <img
                      src={project.creator?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/user/${project.creator?._id}`); }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${project.creator?.name || 'U'}&bold=true`;
                      }}
                      alt={project.creator?.name || 'Creator'}
                      className="w-12 h-12 object-cover border border-white/20 group-hover:border-[#e87315] transition-colors"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-[12px] font-black text-white/90 uppercase tracking-widest">{project.creator?.name || 'Anonymous'}</p>
                      <p className="text-[10px] sm:text-[11px] font-bold text-[#e87315] uppercase tracking-widest italic mt-0.5">{project.creator?.role || 'Lead Architect'}</p>
                    </div>
                  </div>

                  {/* RESTORED: Tech Tags (The "Specs") */}
                  <div className="flex flex-wrap gap-2.5">
                    {project.tags?.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/10 border border-white/20 text-[10px] font-black text-white/70 uppercase tracking-tighter"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Looking For - Using your helper */}
                  <div className="flex flex-col gap-2.5 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3.5 bg-[#e87315]" />
                      <h4 className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">
                        Looking for
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.lookingFor?.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 border text-[10px] sm:text-[11px] font-black tracking-tighter uppercase italic shadow-[4px_4px_0px_rgba(255,255,255,0.05)] ${getLookingForColor(item)}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats Architecture */}
                  <div className="mt-3 pt-6 border-t border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white/50 mb-1">
                          <Eye size={14} strokeWidth={2.5} />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Views</span>
                        </div>
                        <span className="text-[14px] sm:text-[15px] font-black text-white/90">{project.viewCount?.toLocaleString() || 0}</span>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleLike(project._id); }}
                        className="flex flex-col group/like"
                      >
                        <div className={`flex items-center gap-2 transition-colors mb-1 ${likedProjects[project._id] ? 'text-red-500' : 'text-white/50 group-hover/like:text-red-500'}`}>
                          <Heart size={14} fill={likedProjects[project._id] ? 'currentColor' : 'none'} strokeWidth={2.5} />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Like</span>
                        </div>
                        <span className={`text-[14px] sm:text-[15px] font-black transition-colors ${likedProjects[project._id] ? 'text-red-500' : 'text-white/90 group-hover/like:text-white'}`}>
                          {project.likes?.length || 0}
                        </span>
                      </button>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white/50 mb-1">
                          <Users size={14} strokeWidth={2.5} />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Team</span>
                        </div>
                        <span className="text-[14px] sm:text-[15px] font-black text-white/90">{project.teamSize || 1}</span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-white/10 border border-white/20 group-hover:bg-[#e87315] group-hover:border-[#e87315] transition-all duration-300">
                      <ArrowUpRight size={20} className="text-white/60 group-hover:text-black" strokeWidth={3} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* System Null State */
        <div className="relative border border-dashed border-white/20 bg-[#0c0c0c] py-32 px-10 animate-evolve-in flex flex-col items-center justify-center overflow-hidden" style={{ animationDelay: '0.2s' }}>
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#e87315_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

          {/* Technical Icon Module */}
          <div className="relative mb-8 sm:mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#080808] border border-white/20 flex items-center justify-center shadow-2xl">
              <Search size={32} className="text-[#e87315] opacity-60 sm:w-10 sm:h-10" strokeWidth={2} />
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#e87315]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#e87315]" />
            </div>
          </div>

          {/* Text Architecture */}
          <div className="text-center space-y-3 mb-10 sm:mb-12 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black text-white/90 uppercase italic tracking-tighter">
              Zero Results Found
            </h3>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 sm:w-12 bg-[#e87315]/50" />
              <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-[0.4em]">
                Database Query Returned Null
              </p>
              <div className="h-[1px] w-8 sm:w-12 bg-[#e87315]/50" />
            </div>
          </div>

          {/* Reset Command */}
          <button
            onClick={clearAll}
            className="group relative px-10 sm:px-12 py-4 sm:py-5 bg-[#0c0c0c] border border-[#e87315] overflow-hidden transition-all"
          >
            <span className="relative z-10 text-[11px] sm:text-[12px] font-black text-[#e87315] uppercase tracking-[0.3em] group-hover:text-black transition-colors">
              Clear All Filters
            </span>
            <div className="absolute inset-0 bg-[#e87315] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      )}

      {hasMore && !loading && filteredProjects.length > 0 && (
        <div className="flex justify-center pt-16 pb-24">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`group relative flex items-center justify-center gap-6 px-10 sm:px-12 py-5 sm:py-6 border transition-all duration-500 overflow-hidden ${loadingMore
              ? 'bg-white/10 border-white/20 cursor-wait'
              : 'bg-[#0c0c0c] border-white/20 hover:border-[#e87315] cursor-pointer'
              }`}
          >
            {/* Background Structural Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10" />

            {loadingMore ? (
              <div className="relative z-10 flex items-center gap-4">
                {/* Technical Loading Indicator */}
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-3.5 bg-[#e87315] animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-[12px] font-black text-[#e87315] uppercase tracking-[0.5em]">
                  Synchronizing...
                </span>
              </div>
            ) : (
              <>
                <span className="relative z-10 text-[11px] sm:text-[12px] font-black text-white/60 group-hover:text-white uppercase tracking-[0.5em] transition-colors bg-[#0c0c0c] px-4 group-hover:bg-transparent">
                  Fetch Next Data Batch
                </span>

                {/* Action Node */}
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 bg-[#080808] group-hover:bg-[#e87315] flex items-center justify-center transition-all duration-500 border border-white/20 group-hover:border-[#e87315]">
                  <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-white/60 group-hover:border-black rotate-45 mb-1" />
                </div>
              </>
            )}

            {/* Hover Fill Effect (Only when not loading) */}
            {!loadingMore && (
              <div className="absolute inset-0 bg-[#e87315]/[0.05] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreProjects;