import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import { Eye, Heart, ArrowRight } from 'lucide-react';

const ExplorePreview = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectAPI.getAll({ page: 1, limit: 2 });
                setProjects((response.data || []).slice(0, 2));
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const SkeletonCard = () => (
        <div className="h-36 bg-white/[0.05] rounded-2xl animate-pulse" />
    );

    return (
        <div className="card-structured overflow-hidden p-0 relative rounded-2xl sm:rounded-4xl">

            {/* Project Cards */}
            <div className="p-0 space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 sm:h-36 bg-[#0c0c0c] border border-white/10 animate-pulse relative">
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : projects.map((project, index) => (
                    <div
                        key={project._id}
                        onClick={() => navigate(`/dashboard/project/${project._id}`)}
                        className="group cursor-pointer bg-[#0c0c0c] border border-white/10 hover:border-[#e87315]/40 transition-all duration-500 relative overflow-hidden flex flex-col sm:flex-row h-auto sm:h-36"
                    >
                        {/* Structural Status Bar */}
                        <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-700 z-10" />

                        {/* Image Node (Technical Frame) */}
                        <div className="relative w-full sm:w-48 h-40 sm:h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-white/10 shrink-0">
                            {project.images?.[0] ? (
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                                    <div className="w-5 h-5 border border-white/20 rotate-45" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 sm:from-black/40 to-transparent" />
                        </div>

                        {/* Data Node */}
                        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] sm:text-xs font-black text-[#e87315] opacity-90 uppercase tracking-widest whitespace-nowrap">
                                            NODE_{index.toString().padStart(2, '0')}
                                        </span>
                                        <div className="h-[1px] w-6 bg-white/30 shrink-0" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-[#e87315] transition-colors truncate">
                                        {project.title?.replace(/\s+/g, '_')}
                                    </h3>
                                    <p className="text-xs sm:text-[13px] text-white/70 font-medium tracking-wide italic line-clamp-1 sm:line-clamp-2">
                                        {project.tagline}
                                    </p>
                                </div>

                                {/* Stage Badge */}
                                <div className="px-3 py-1.5 border border-white/20 group-hover:border-[#e87315]/50 transition-colors shrink-0 bg-white/[0.02]">
                                    <span className="text-[9px] sm:text-[10px] font-black text-white/90 group-hover:text-[#e87315] uppercase tracking-[0.2em]">
                                        {project.stage || 'STABLE'}
                                    </span>
                                </div>
                            </div>

                            {/* Telemetry (Bottom Row) */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3">
                                <div className="flex items-center gap-5 sm:gap-8">
                                    {/* View Counter */}
                                    <div className="flex items-center gap-2 group/stat">
                                        <Eye
                                            size={14}
                                            className="text-white/60 group-hover/stat:text-[#e87315] transition-colors"
                                        />
                                        <span className="text-xs sm:text-[13px] font-medium text-white/90 tabular-nums tracking-tighter">
                                            {project.viewCount?.toLocaleString().padStart(2, '0') || '00'}
                                        </span>
                                    </div>

                                    {/* Heart Counter */}
                                    <div className="flex items-center gap-2 group/stat">
                                        <Heart
                                            size={13}
                                            className="text-white/60 group-hover/stat:text-[#e87315] transition-colors"
                                        />
                                        <span className="text-xs sm:text-[13px] font-medium text-white/90 tabular-nums tracking-tighter">
                                            {project.likes?.length.toString().padStart(2, '0') || '00'}
                                        </span>
                                    </div>
                                </div>

                                {/* Dynamic Progress Tick */}
                                <div className="w-2 h-2 bg-white/30 group-hover:bg-[#e87315] group-hover:rotate-90 transition-all duration-500" />
                            </div>
                        </div>

                        {/* Background Identification Decal */}
                        <div className="absolute top-0 right-0 p-2 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                            <span className="text-[40px] sm:text-[50px] font-black text-white leading-none tracking-tighter select-none">
                                {project.title?.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Blur overlay at bottom */}
            <div className="relative -mt-4 border border-white/10 bg-[#0c0c0c] overflow-hidden group">
                {/* Background Technical Ambient */}
                {projects[1]?.images?.[0] && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-1000"
                        style={{ backgroundImage: `url(${projects[1].images[0]})` }}
                    />
                )}

                {/* Scanning Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* CTA Content */}
                <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center text-center">
                    {/* Status Header */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="h-[1px] w-4 sm:w-6 bg-[#e87315]/70" />
                        <p className="text-[10px] sm:text-xs font-black text-[#e87315] uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                             Explore Projects Around You
                        </p>
                        <div className="h-[1px] w-4 sm:w-6 bg-[#e87315]/70" />
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mb-6">
                        Discover what builders are working on
                    </h3>

                    {/* Architectural Button */}
                    <button
                        onClick={() => navigate('/dashboard/explore')}
                        className="relative w-full max-w-sm mx-auto group/btn"
                    >
                        <div className="absolute inset-0 bg-[#e87315]/0 group-hover/btn:bg-[#e87315] transition-all duration-300" />

                        <div className="relative z-10 py-3 sm:py-3.5 border border-white/30 group-hover/btn:border-[#e87315] flex items-center justify-center gap-3 transition-all bg-[#080808]/50 group-hover/btn:bg-transparent">
                            <span className="text-[11px] sm:text-xs font-black text-white group-hover/btn:text-black uppercase tracking-[0.2em]">
                                Explore
                            </span>
                            <ArrowRight size={16} className="text-[#e87315] group-hover/btn:text-black transition-colors" />
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-white/50 group-hover/btn:bg-white" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white/50 group-hover/btn:bg-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExplorePreview;