import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft, Globe, Users, Layers, Target, Tag, X } from 'lucide-react';
import { projectAPI } from '../../services/api';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        tagline: '',
        description: '',
        category: '',
        stage: 'idea',
        teamSize: 1,
        lookingFor: [],
        tags: [],
        githubUrl: '',
        demoUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await projectAPI.create(formData);
            navigate('/dashboard/project');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-32 pt-12 px-6 sm:px-8 animate-evolve-in">
            {/* HEADER SYSTEM */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6 sm:gap-8 border-b border-white/20 pb-10 sm:pb-12">
                <div className="space-y-4 sm:space-y-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 sm:gap-3 text-white/60 hover:text-[#e87315] transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform sm:w-6 sm:h-6" />
                        <span className="text-[15px] sm:text-[17px] font-black uppercase tracking-[0.3em]">Go Back</span>
                    </button>

                    <div className="relative pl-6 sm:pl-8">
                        <div className="absolute left-0 top-0 w-1.5 h-full bg-[#e87315]" />
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white/90 italic uppercase tracking-tighter leading-none mb-2 sm:mb-3">
                            New project
                        </h1>
                        <p className="text-white/60 text-xs sm:text-sm font-bold italic tracking-wide">
                            Add the new project in the Ecosystem.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-20 sm:space-y-28">
                {/* SECTION 01: IDENTITY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <Target size={20} className="text-[#e87315] sm:w-6 sm:h-6" />
                            <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/90">01 Core Identity</h2>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-white/60 font-bold uppercase tracking-widest leading-loose">
                            Define primary identifiers and market positioning.
                        </p>
                    </div>

                    <div className="lg:col-span-8 space-y-10 sm:space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
                            <div className="group">
                                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-3 sm:mb-4 group-focus-within:text-[#e87315] transition-colors">Project title</label>
                                <input
                                    type="text"
                                    placeholder="PULSEUP AI"
                                    className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#e87315] py-3 text-2xl sm:text-3xl font-black text-white/90 focus:outline-none transition-all placeholder:text-white/20 uppercase italic"
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-3 sm:mb-4 group-focus-within:text-[#e87315] transition-colors">Tagline</label>
                                <input
                                    type="text"
                                    placeholder="THE FUTURE OF..."
                                    className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#e87315] py-3 text-2xl sm:text-3xl font-black text-white/90 focus:outline-none transition-all placeholder:text-white/20 uppercase italic"
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-3 sm:mb-4">Sector Classification</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white/[0.05] border border-white/20 p-5 text-[12px] sm:text-[13px] font-black text-white/90 uppercase tracking-[0.2em] focus:outline-none focus:border-[#e87315] cursor-pointer appearance-none italic"
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        value={formData.category}
                                    >
                                        <option value="" className="bg-[#0c0c0c]">SELECT</option>
                                        {['AI/ML', 'Web Dev', 'Mobile App', 'IoT', 'Blockchain', 'HealthTech', 'EdTech', 'FinTech'].map(c => (
                                            <option key={c} value={c} className="bg-[#0c0c0c]">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-3 sm:mb-4">Unit Size</label>
                                <div className="flex items-center bg-white/[0.05] border border-white/20 p-5">
                                    <Users size={18} className="text-[#e87315] mr-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="number"
                                        placeholder="00"
                                        className="bg-transparent w-full text-white/90 outline-none text-sm sm:text-base font-black tracking-widest"
                                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-3 sm:mb-4">Elevator Pitch</label>
                            <textarea
                                rows="5"
                                placeholder="DEFINE PROBLEM_SOLUTION ARCHITECTURE..."
                                className="w-full bg-white/[0.05] border border-white/20 focus:border-[#e87315]/60 p-6 text-[13px] sm:text-[14px] leading-relaxed text-white/90 font-medium focus:outline-none transition-all resize-none uppercase tracking-tight placeholder:text-white/30"
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 02: DEPLOYMENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 border-t border-white/20 pt-20 sm:pt-28">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <Globe size={20} className="text-[#e87315] sm:w-6 sm:h-6" />
                            <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/90">02 Deployment</h2>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-white/60 font-bold uppercase tracking-widest leading-loose">
                            Asset storage and repository synchronization.
                        </p>
                    </div>

                    <div className="lg:col-span-8 space-y-10 sm:space-y-12">
                        <div className="p-6 sm:p-8 bg-[#0c0c0c] border border-white/20 relative">
                            <div className="absolute top-0 right-0 px-4 py-1 bg-white/20 text-[10px] sm:text-[11px] font-black text-white/90 uppercase tracking-widest">Asset Module</div>
                            <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-5 sm:mb-6 mt-4 sm:mt-0">Project Visual URL</label>
                            <input
                                type="url"
                                placeholder="HTTPS://STORAGE.ENTITY/PATH_TO_IMAGE"
                                className="w-full bg-white/[0.05] border border-white/20 focus:border-[#e87315] p-5 text-[12px] sm:text-[13px] font-bold text-[#e87315] placeholder:text-white/30 focus:outline-none transition-all tracking-wide"
                                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-3 sm:mb-4">Ecosystem Phase</label>
                                <select
                                    className="w-full bg-[#0c0c0c] border border-white/20 p-5 text-[12px] sm:text-[13px] font-black text-white/90 uppercase tracking-[0.2em] focus:outline-none focus:border-[#e87315] cursor-pointer appearance-none italic"
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    <option value="idea" className="bg-[#0c0c0c]">IDEA PHASE</option>
                                    <option value="prototype" className="bg-[#0c0c0c]">MVP PROTOTYPE</option>
                                    <option value="launched" className="bg-[#0c0c0c]">LAUNCHED ALPHA</option>
                                </select>
                            </div>
                            <div className="space-y-5 sm:space-y-6">
                                <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em]">Network Nodes</label>
                                {/* Custom SVG Github Implementation */}
                                <div className="relative group/link">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/50 group-focus-within/link:text-[#e87315] transition-colors sm:w-6 sm:h-6">
                                            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C20.58 21.78 24 17.31 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="REPOSITORY_URL"
                                        className="w-full bg-transparent border border-white/20 pl-16 pr-5 py-4 text-[12px] sm:text-[13px] font-black text-white/90 placeholder:text-white/30 focus:border-[#e87315] focus:outline-none transition-all italic"
                                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    />
                                </div>
                                <div className="relative group/link">
                                    <Globe size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within/link:text-[#e87315] transition-colors sm:w-6 sm:h-6" />
                                    <input
                                        type="url"
                                        placeholder="LIVE_DEPLOYMENT_URL"
                                        className="w-full bg-transparent border border-white/20 pl-16 pr-5 py-4 text-[12px] sm:text-[13px] font-black text-white/90 placeholder:text-white/30 focus:border-[#e87315] focus:outline-none transition-all italic"
                                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 03: DISCOVERY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 border-t border-white/20 pt-20 sm:pt-28">
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <Tag size={20} className="text-[#e87315] sm:w-6 sm:h-6" />
                            <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/90">03 Discovery</h2>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-white/60 font-bold uppercase tracking-widest leading-loose">
                            Define tech stack modules.
                        </p>
                    </div>

                    <div className="lg:col-span-8 space-y-14 sm:space-y-16">
                        <div>
                            <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-5 sm:mb-6">Tech Stack </label>
                            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                                {formData.tags.map((tag, i) => (
                                    <span key={i} className="flex items-center gap-4 px-5 py-2.5 bg-white text-black text-[12px] sm:text-[13px] font-black uppercase italic shadow-[4px_4px_0px_#e87315]">
                                        {tag}
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))}>
                                            <X size={16} strokeWidth={3} className="sm:w-5 sm:h-5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="ADD Tag and Enter +"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="w-full bg-[#0c0c0c] border-2 border-dashed border-white/20 placeholder:text-white/30 p-6 text-[12px] sm:text-[13px] font-black text-[#e87315] focus:outline-none focus:border-[#e87315] transition-all text-center tracking-[0.2em]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.3em] mb-5 sm:mb-6">Required Collaborators</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                                {['mentor', 'co-founder', 'investor', 'feedback', 'team-member'].map(item => (
                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            lookingFor: prev.lookingFor.includes(item)
                                                ? prev.lookingFor.filter(i => i !== item)
                                                : [...prev.lookingFor, item]
                                        }))}
                                        className={`px-4 py-5 text-[11px] sm:text-[12px] font-black tracking-[0.2em] uppercase transition-all duration-300 border-2 ${formData.lookingFor.includes(item)
                                                ? 'bg-[#e87315] border-[#e87315] text-black italic scale-105 shadow-[0_0_20px_rgba(232,115,21,0.4)]'
                                                : 'bg-transparent border-white/20 text-white/50 hover:border-white/50 hover:text-white/90'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBMIT SYSTEM */}
                <div className="pt-16 sm:pt-20">
                    {error && (
                        <div className="mb-6 sm:mb-8 p-5 sm:p-6 border-l-4 border-red-600 bg-red-600/10 text-red-500 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                            ERROR_CODE_01: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-8 sm:py-10 bg-white text-black font-black text-xl sm:text-2xl italic uppercase tracking-[0.5em] hover:bg-[#e87315] hover:text-white transition-all duration-500 disabled:opacity-50 group/submit shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-5 sm:gap-6">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 border-[5px] border-black/20 border-t-black rounded-full animate-spin" />
                                SYNCHRONIZING...
                            </span>
                        ) : 'Deploy'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;