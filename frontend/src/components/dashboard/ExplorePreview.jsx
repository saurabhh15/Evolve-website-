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
        <div className="h-32 bg-white/[0.02] rounded-2xl animate-pulse" />
    );

    return (
        <div className="card-structured overflow-hidden p-0 relative rounded-4xl">

            {/* Project Cards */}
            <div className="p-0 space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-32 bg-[#080808] border border-white/5 animate-pulse relative">
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-white/5" />
                            </div>
                        ))}
                    </div>
                ) : projects.map((project, index) => (
                    <div
                        key={project._id}
                        onClick={() => navigate(`/dashboard/project/${project._id}`)}
                        className="group cursor-pointer bg-[#080808] border border-white/5 hover:border-[#e87315]/30 transition-all duration-500 relative overflow-hidden"
                    >
                        {/* ── Structural Status Bar ── */}
                        <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-700" />

                        <div className="flex h-32">
                            {/* ── Image Node (Technical Frame) ── */}
                            <div className="relative w-40 h-full overflow-hidden border-r border-white/5">
                                {project.images?.[0] ? (
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                                        <div className="w-4 h-4 border border-white/10 rotate-45" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                            </div>

                            {/* ── Data Node ── */}
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black text-[#e87315] opacity-40 uppercase tracking-widest">
                                                NODE_{index.toString().padStart(2, '0')}
                                            </span>
                                            <div className="h-[1px] w-4 bg-white/10" />
                                        </div>
                                        <h3 className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-[#e87315] transition-colors">
                                            {project.title?.replace(/\s+/g, '_')}
                                        </h3>
                                        <p className="text-[10px] text-white/30 font-medium tracking-wide italic">
                                            {project.tagline}
                                        </p>
                                    </div>

                                    {/* Stage Badge (Hollow) */}
                                    <div className="px-2 py-1 border border-white/10 group-hover:border-[#e87315]/40 transition-colors">
                                        <span className="text-[8px] font-black text-white/40 group-hover:text-[#e87315] uppercase tracking-[0.2em]">
                                            {project.stage || 'STABLE'}
                                        </span>
                                    </div>
                                </div>

                                {/* ── Telemetry (Bottom Row) ── */}
                                <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                                    <div className="flex items-center gap-6 border-t border-white/[0.03] pt-3">
                                        {/* ── View Counter ── */}
                                        <div className="flex items-center gap-2 group/stat">
                                            <Eye
                                                size={12}
                                                className="text-white/20 group-hover/stat:text-[#e87315] transition-colors"
                                            />
                                            <span className="text-[11px] font-light text-white/60 tabular-nums tracking-tighter">
                                                {project.viewCount?.toLocaleString().padStart(2, '0') || '00'}
                                            </span>
                                        </div>

                                        {/* ── Heart Counter ── */}
                                        <div className="flex items-center gap-2 group/stat">
                                            <Heart
                                                size={11}
                                                className="text-white/20 group-hover/stat:text-[#e87315] transition-colors"
                                            />
                                            <span className="text-[11px] font-light text-white/60 tabular-nums tracking-tighter">
                                                {project.likes?.length.toString().padStart(2, '0') || '00'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dynamic Progress Tick */}
                                    <div className="w-1.5 h-1.5 bg-white/10 group-hover:bg-[#e87315] group-hover:rotate-90 transition-all duration-500" />
                                </div>
                            </div>
                        </div>

                        {/* Background Identification Decal */}
                        <div className="absolute top-0 right-0 p-1 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <span className="text-[40px] font-black text-white leading-none tracking-tighter select-none">
                                {project.title?.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Blur overlay at bottom — like the image */}
            <div className="relative -mt-4 border border-white/5 bg-[#080808] overflow-hidden group">
                {/* ── Background Technical Ambient ── */}
                {projects[1]?.images?.[0] && (
                    <div
                        className="absolute inset-0 bg-cover bg-center grayscale opacity-10 group-hover:opacity-20 transition-opacity duration-1000"
                        style={{ backgroundImage: `url(${projects[1].images[0]})` }}
                    />
                )}

                {/* Scanning Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* CTA Content */}
                <div className="relative z-10 px-6 py-8 flex flex-col items-center text-center">
                    {/* Status Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1px] w-4 bg-[#e87315]/30" />
                        <p className="text-[9px] font-black text-[#e87315] uppercase tracking-[0.4em]">
                             Explore Projects Around You
                        </p>
                        <div className="h-[1px] w-4 bg-[#e87315]/30" />
                    </div>

                    <h3 className="text-sm font-black text-white uppercase tracking-tight mb-3">
                        Discover what builders are working on
                    </h3>

                   

                    {/* ── ARCHITECTURAL BUTTON ── */}
                    <button
                        onClick={() => navigate('/dashboard/explore')}
                        className="relative w-full group/btn"
                    >
                        <div className="absolute inset-0 bg-[#e87315]/0 group-hover/btn:bg-[#e87315] transition-all duration-300" />

                        <div className="relative z-10 py-3 border border-white/10 group-hover/btn:border-[#e87315] flex items-center justify-center gap-2 transition-all">
                            <span className="text-[10px] font-black text-white group-hover/btn:text-black uppercase tracking-[0.2em]">
                                Explore
                            </span>
                            <ArrowRight size={14} className="text-[#e87315] group-hover/btn:text-black transition-colors" />
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-white/20 group-hover/btn:bg-white" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/20 group-hover/btn:bg-white" />
                    </button>
                </div>

            </div>

        </div>
    );
};

export default ExplorePreview;