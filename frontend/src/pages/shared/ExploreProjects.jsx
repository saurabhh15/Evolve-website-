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

  // projects fetch
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectAPI.getAll({ page: 1, limit: 12 });

        setAllProjects(response.data);
        const initialLikes = {};
        response.data.forEach(p => {
          initialLikes[p._id] = p.likes.includes(user?._id);
        });
        setLikedProjects(initialLikes);
        setHasMore(response.data.length === 12);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
                ? p.likes.filter(id => id !== 'me')
                : [...p.likes, 'me']
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
      const response = await projectAPI.getAll({ page: nextPage, limit: 12 });
      setAllProjects(prev => [...prev, ...response.data]);
      const moreLikes = {};
      response.data.forEach(p => {
        moreLikes[p._id] = p.likes.includes(user?._id);
      });
      setLikedProjects(prev => ({ ...prev, ...moreLikes }));
      setHasMore(response.data.length === 12);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredProjects = useMemo(() => allProjects.filter(p => {
    const matchesSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStage = !selectedStage || selectedStage === 'All' || p.stage === selectedStage;
    const matchesLookingFor = !selectedLookingFor || selectedLookingFor === 'All' || p.lookingFor.includes(selectedLookingFor);
    return matchesSearch && matchesCategory && matchesStage && matchesLookingFor;
  }), [searchTerm, selectedCategory, selectedStage, selectedLookingFor, allProjects]);

  // ========== HELPER FUNCTIONS ==========
  const getStageBadge = (stage) => {
    switch (stage) {
      case 'idea': return { label: 'Idea', classes: 'bg-purple-500 text-white' };
      case 'prototype': return { label: 'Prototype', classes: 'bg-blue-500 text-white' };
      case 'mvp': return { label: 'MVP', classes: 'bg-[#e87315] text-[#080808]' };
      case 'launched': return { label: 'Launched', classes: 'bg-green-500 text-white' };
      default: return { label: stage, classes: 'bg-gray-600 text-white' };
    }
  };

  const getLookingForColor = (item) => {
    switch (item) {
      case 'mentor': return 'bg-purple-500/15 text-purple-300 border-purple-500/25';
      case 'co-founder': return 'bg-blue-500/15 text-blue-300 border-blue-500/25';
      case 'investor': return 'bg-[#e87315]/15 text-[#e87315] border-[#e87315]/25';
      case 'feedback': return 'bg-green-500/15 text-green-300 border-green-500/25';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };


  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e87315]/30 border-t-[#e87315] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="card-structured max-w-md text-center py-12">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X size={32} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Failed to Load Projects</h3>
          <p className="text-gray-500 mb-6">{error}</p>
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

      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10 pb-16 border-b border-white/5">
        <div className="relative">
          {/* Vertical Technical Accent */}
          <div className="absolute -left-6 top-0 w-[2px] h-full bg-[#e87315] hidden md:block" />

          <h1 className="text-7xl md:text-7xl font-black text-white mb-4 tracking-tighter italic uppercase leading-[0.8]">
            Explore Project<span className="text-[#e87315]">.</span>
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[#e87315]/30" />
            <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-[12px] italic">
              Browse real student-built products in motion. Find ideas,<br></br>
               join teams, or contribute to systems that are actively evolving.

            </p>
          </div>

          <p className="mt-6 text-white/20 font-medium tracking-wide uppercase text-[15px] max-w-xl leading-relaxed">
          </p>
        </div>

        {/* Search Module */}
        <div className="relative w-full md:w-[450px] flex-shrink-0 group">
          {/* Top Label */}


          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#e87315] transition-colors z-10"
            size={18}
            strokeWidth={3}
          />

          <input
            type="text"
            placeholder="Skill / Name / Company"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 group-hover:border-white/20 focus:border-[#e87315] rounded-none pl-16 pr-8 py-6 text-[13px] font-black text-white placeholder-white/10 focus:outline-none transition-all uppercase tracking-widest italic"
          />

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-700" />

          {/* Corner Decals */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
        </div>
      </header>

      {/* ── Filters System ── */}
      <div className="py-12 border-b border-white/5 animate-evolve-in" style={{ animationDelay: '0.08s' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-[#e87315]" />
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={18} className="text-[#e87315]" strokeWidth={2.5} />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Filter Parameters</h3>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="group flex items-center gap-3 px-4 py-2 bg-white text-black hover:bg-[#e87315] hover:text-white transition-all duration-300"
            >
              <X size={14} strokeWidth={4} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Reset All Modules</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { label: 'Category', value: selectedCategory, onChange: setSelectedCategory, options: categories },
            { label: 'Stage', value: selectedStage, onChange: setSelectedStage, options: stages },
            { label: 'Collaboration Type', value: selectedLookingFor, onChange: setSelectedLookingFor, options: lookingForOptions },
          ].map(({ label, value, onChange, options }, index) => (
            <div key={label} className="relative group">
              {/* Architectural Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">0{index + 1}</span>
                <label className="block text-[10px] font-black text-white uppercase tracking-[0.3em] group-hover:text-[#e87315] transition-colors">
                  {label}
                </label>
              </div>


              <div className="relative">
                <select
                  value={value}
                  onChange={e => onChange(e.target.value === 'All' ? '' : e.target.value)}
                  className="w-full appearance-none bg-[#0a0a0a] border border-white/10 group-hover:border-white/30 px-5 py-4 text-[11px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-[#e87315] cursor-pointer transition-all italic"
                >
                  {options.map(opt => (
                    <option key={opt} value={opt} className="bg-[#0a0a0a] text-white py-4">
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Custom Architectural Arrow (The Chevron) */}
                <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none border-l border-white/5 bg-white/[0.02]">
                  <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-[#e87315] rotate-45 mb-1 opacity-60" />
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#e87315] group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
              Results Found: <span className="text-white italic">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </p>
            <div className="h-px w-12 bg-[#e87315]/30" />
          </div>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project, index) => {
            const badge = getStageBadge(project.stage);

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/dashboard/project/${project._id}`)}
                className="group relative flex flex-col bg-[#080808] border border-white/10 hover:border-[#e87315] transition-all duration-500 cursor-pointer animate-evolve-in shadow-2xl"
                style={{ animationDelay: `${0.15 + (index % 6) * 0.06}s` }}
              >
                {/* ── Image Module ── */}
                <div className="relative h-56 overflow-hidden border-b border-white/5">
                  <img
                    src={project.images?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

                  <div className="absolute top-0 left-0">
                    <span className={`px-5 py-2 text-[10px] font-black uppercase italic tracking-[0.2em] inline-block ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="absolute bottom-5 right-6">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] border-r-4 border-[#e87315] pr-3 italic">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="flex flex-col flex-1 p-8 gap-7">

                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white group-hover:text-[#e87315] transition-colors leading-none uppercase italic tracking-tighter">
                      {project.title}
                    </h3>
                    <p className="text-[11px] font-bold text-white/50 leading-relaxed line-clamp-2 uppercase tracking-widest italic">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Creator Module */}
                  <div className="flex items-center gap-4 py-4 border-y border-white/5 bg-white/[0.01] px-4">
                    <img
                      src={project.creator?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/user/${project.creator?._id}`); }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${project.creator?.name || 'U'}&bold=true`;
                      }}
                      alt={project.creator?.name || 'Creator'}
                      className="w-10 h-10 object-cover border border-white/10 group-hover:border-[#e87315] transition-colors"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{project.creator?.name || 'Anonymous'}</p>
                      <p className="text-[9px] font-bold text-[#e87315] uppercase tracking-widest italic">{project.creator?.role || 'Lead Architect'}</p>
                    </div>
                  </div>

                  {/* RESTORED: Tech Tags (The "Specs") */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-tighter"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Looking For - Using your helper */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3 bg-[#ffaf6e]" />
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                        Looking for
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.lookingFor?.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className={`px-4 py-2 border text-[10px] font-black tracking-tighter uppercase italic shadow-[4px_4px_0px_rgba(255,255,255,0.05)] ${getLookingForColor(item)}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats Architecture */}
                  <div className="mt-2 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white/30">
                          <Eye size={12} strokeWidth={3} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Views</span>
                        </div>
                        <span className="text-sm font-black text-white">{project.viewCount?.toLocaleString() || 0}</span>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleLike(project._id); }}
                        className="flex flex-col group/like"
                      >
                        <div className={`flex items-center gap-2 transition-colors ${likedProjects[project._id] ? 'text-red-500' : 'text-white/30 group-hover/like:text-red-500'}`}>
                          <Heart size={12} fill={likedProjects[project._id] ? 'currentColor' : 'none'} strokeWidth={3} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Like</span>
                        </div>
                        <span className={`text-sm font-black ${likedProjects[project._id] ? 'text-red-500' : 'text-white'}`}>
                          {project.likes?.length || 0}
                        </span>
                      </button>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white/30">
                          <Users size={12} strokeWidth={3} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Team</span>
                        </div>
                        <span className="text-sm font-black text-white">{project.teamSize || 1}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border border-white/10 group-hover:bg-[#e87315] group-hover:border-[#e87315] transition-all duration-300">
                      <ArrowUpRight size={20} className="text-white/40 group-hover:text-black" strokeWidth={3} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>



      ) : (
        /* ── System Null State ── */
        <div className="relative border border-white/5 bg-white/[0.01] py-32 px-10 animate-evolve-in flex flex-col items-center justify-center overflow-hidden" style={{ animationDelay: '0.2s' }}>
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#e87315_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

          {/* Technical Icon Module */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-black border border-white/10 flex items-center justify-center">
              <Search size={32} className="text-[#e87315] opacity-50" strokeWidth={1.5} />
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#e87315]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#e87315]" />
            </div>
          </div>

          {/* Text Architecture */}
          <div className="text-center space-y-2 mb-10 relative z-10">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Zero Results Found
            </h3>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-[#e87315]/30" />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">
                Database Query Returned Null
              </p>
              <div className="h-[1px] w-8 bg-[#e87315]/30" />
            </div>
          </div>

          {/* Reset Command */}
          <button
            onClick={clearAll}
            className="group relative px-10 py-4 bg-transparent border border-[#e87315] overflow-hidden transition-all"
          >
            <span className="relative z-10 text-[11px] font-black text-[#e87315] uppercase tracking-[0.3em] group-hover:text-black transition-colors">
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
            className={`group relative flex items-center justify-center gap-6 px-12 py-5 border transition-all duration-500 overflow-hidden ${loadingMore
              ? 'bg-white/5 border-white/5 cursor-wait'
              : 'bg-[#0a0a0a] border-white/10 hover:border-[#e87315] cursor-pointer'
              }`}
          >
            {/* Background Structural Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5" />

            {loadingMore ? (
              <div className="relative z-10 flex items-center gap-4">
                {/* Technical Loading Indicator */}
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-3 bg-[#e87315] animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-[#e87315] uppercase tracking-[0.5em]">
                  Synchronizing...
                </span>
              </div>
            ) : (
              <>
                <span className="relative z-10 text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.5em] transition-colors">
                  Fetch Next Data Batch
                </span>

                {/* Action Node */}
                <div className="relative z-10 w-8 h-8 bg-white/5 group-hover:bg-[#e87315] flex items-center justify-center transition-all duration-500 border border-white/10 group-hover:border-[#e87315]">
                  <div className="w-2 h-2 border-b-2 border-r-2 border-white/40 group-hover:border-black rotate-45 mb-1" />
                </div>
              </>
            )}

            {/* Hover Fill Effect (Only when not loading) */}
            {!loadingMore && (
              <div className="absolute inset-0 bg-[#e87315]/[0.02] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};


export default ExploreProjects;