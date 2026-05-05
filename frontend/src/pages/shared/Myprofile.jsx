import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { MapPin, X, LogOut, Save, Eye, EyeOff } from 'lucide-react';


const MyProfile = () => {
    const { user, setUser, logout } = useAuth();
    console.log("USER DATA:", user);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        bio: '',
        location: '',
        college: '',
        profileImage: '',
        linkedIn: '',
        github: '',
        website: '',
        skills: [],
        company: '',
        expertise: [],
        mentorStatus: 'Accepting Mentees',
        isAlumni: false,
        gradYear: '',
        responseTime: '< 48 hrs',
        coverImage: ''
    });

    const [skillInput, setSkillInput] = useState('');
    const [expertiseInput, setExpertiseInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSaving, setPasswordSaving] = useState(false);

    useEffect(() => {
        if (user) {
            const savedImage = user.profileImage || '';
            const cleanImage = savedImage.includes('freepik.com') ? '' : savedImage;

            setForm({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                college: user.college || '',
                profileImage: cleanImage,
                linkedIn: user.linkedIn || '',
                github: user.github || '',
                website: user.website || '',
                skills: user.skills || [],
                company: user.company || '',
                expertise: user.expertise || [],
                mentorStatus: user.mentorStatus || 'Accepting Mentees',
                isAlumni: user.isAlumni || false,
                gradYear: user.gradYear || '',
                responseTime: user.responseTime || '< 48 hrs',
                coverImage: user?.coverImage || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            const response = await userAPI.updateProfile(form);
            setUser(response.data);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!form.skills.includes(skillInput.trim())) {
                setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
            }
            setSkillInput('');
        }
    };

    const handleAddExpertise = (e) => {
        if (e.key === 'Enter' && expertiseInput.trim()) {
            e.preventDefault();
            if (!form.expertise.includes(expertiseInput.trim())) {
                setForm(prev => ({ ...prev, expertise: [...prev.expertise, expertiseInput.trim()] }));
            }
            setExpertiseInput('');
        }
    };

    

    const getDisplayImage = () => {
        if (!user?.profileImage) return '';
        // if it's default image from backend
        if (user.profileImage.startsWith('/')) {
            return `https://evolve-website.onrender.com${user.profileImage}`;
        }

        return user.profileImage;
    };

    return (
        <div className="w-full pb-20 bg-[#050505] min-h-screen font-sans">
            <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-b-xl">
                {form.coverImage ? (
                    <img
                        src={form.coverImage}
                        className="w-full h-full object-cover"
                        alt="Cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#e87315]/10 blur-3xl" />
                        <div className="absolute -bottom-10 right-20 w-96 h-40 rounded-full bg-[#e87315]/5 blur-3xl" />
                        <div className="absolute top-0 right-0 w-40 h-40 border-r border-t border-[#e87315]/10 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-white/5 rounded-tr-full" />
                    </>
                )}
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-white/[0.04]">
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden border-4 border-[#050505] shadow-2xl">
                            <img
                                src={getDisplayImage()}
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${user?.name}&bold=true`;
                                }}
                                className="w-full h-full object-cover"
                                alt={user?.name}
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pb-2 text-center sm:text-left">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">{user?.name}</h1>
                            <p className="text-[#e87315] text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                                {(user?.role || 'member').toUpperCase()}
                                {user?.gender ? ` / ${user.gender.toUpperCase()}` : ''}
                            </p>
                            {user?.location && (
                                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-white/30 mt-1.5">
                                    <MapPin size={11} />
                                    <span className="text-[10px] font-medium">{user.location}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`group/save relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 sm:py-4 overflow-hidden transition-all duration-500 border ${saveSuccess
                                ? 'bg-green-500/5 border-green-500/30 text-green-400'
                                : 'bg-transparent border-[#e87315] text-[#e87315]'
                                }`}
                        >
                            {!saveSuccess && (
                                <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/save:translate-y-0 transition-transform duration-300 ease-out" />
                            )}

                            <div className={`relative z-10 flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${!saveSuccess && 'group-hover/save:text-black'
                                }`}>
                                {saving ? (
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : saveSuccess ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                                        <span>Updating..</span>
                                    </div>
                                ) : (
                                    <>
                                        <Save size={14} className="group-hover/save:scale-110 transition-transform" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </div>

                            <div className={`absolute top-0 right-0 w-1.5 h-1.5 transition-colors ${saveSuccess ? 'bg-green-500/50' : 'bg-[#e87315] group-hover/save:bg-black'
                                }`} />
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-sm font-semibold mt-4 text-center sm:text-left">{error}</p>
                )}

                <div className="space-y-6 mt-8">
                    <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                        <div className="flex items-center gap-3 mb-8 sm:mb-10 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                Basic Info
                            </h2>
                        </div>

                        <div className="space-y-6 sm:space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-2 group/input">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                        01 Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.02] transition-all font-medium"
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                    </div>
                                </div>

                                <div className="space-y-2 group/input">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                        02 Location
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.location}
                                            onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                                            className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.02] transition-all font-medium"
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                    03 College Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={form.college}
                                        onChange={e => setForm(prev => ({ ...prev, college: e.target.value }))}
                                        className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.02] transition-all font-medium"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                </div>
                            </div>

                            <div className="space-y-2 group/input z-20">
                                <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                    04 About
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={form.bio}
                                        onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-black border border-white/5 px-4 py-3 text-[13px] text-white/70 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#0b0500] transition-all font-medium resize-none leading-relaxed"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-16 -rotate-30 opacity-[0.02] select-none pointer-events-none z-10 hidden sm:block">
                            <span className="text-[120px] font-black italic tracking-tighter uppercase">Info</span>
                        </div>
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors duration-500" />
                    </div>

                    <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                        <div className="absolute top-40 -right-10 -rotate-35 p-4 opacity-[0.02] select-none pointer-events-none hidden sm:block">
                            <span className="text-[60px] font-black text-white italic leading-none tracking-tighter">Image</span>
                        </div>

                        <div className="flex items-center gap-3 mb-8 sm:mb-10 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                Profile Image
                            </h2>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                            <div className="relative group/preview w-full sm:w-auto flex justify-center sm:justify-start">
                                <div className="w-24 h-24 bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 group-hover/preview:border-[#e87315]/40">
                                    <img
                                        src={getDisplayImage()}
                                        alt="Preview"
                                        className="w-full h-full object-cover grayscale group-hover/preview:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315] hidden sm:block" />
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/20 group-hover/preview:border-[#e87315] transition-colors hidden sm:block" />
                            </div>

                            <div className="flex-1 w-full space-y-3 group/input">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors flex items-center gap-2">
                                    <span className="text-[#e87315]"></span> Source_Path
                                </label>

                                <div className="relative">
                                    <input
                                        type="url"
                                        value={form.profileImage}
                                        onChange={e => setForm(prev => ({ ...prev, profileImage: e.target.value }))}
                                        placeholder="EXTERNAL_LINK_REQUIRED..."
                                        className="w-full bg-white/[0.02] border border-white/5 px-4 py-4 text-[12px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono tracking-tight"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-700" />
                                </div>

                                <div className="flex items-start gap-2 pt-1">
                                    <div className="mt-1 w-1 h-1 bg-white/20" />
                                    <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest leading-relaxed">
                                        Supported: Unsplash, Imgur, Cloudinary. <br className="hidden sm:block" />
                                        Ensure the URL terminates in a valid image extension.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                        <div className="absolute top-60 right-160 rotate-20 p-4 opacity-[0.02] select-none pointer-events-none hidden lg:block">
                            <span className="text-[60px] font-black text-white italic leading-none tracking-tighter uppercase">Header</span>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                    05 Cover Image
                                </label>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="relative w-full h-24 sm:h-32 bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-[#e87315]/20">
                                    {form.coverImage ? (
                                        <img
                                            src={form.coverImage}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/5">
                                            <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] text-center px-4">Add a profile header...</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 flex gap-1">
                                        <div className="w-1 h-1 bg-[#e87315]/40" />
                                        <div className="w-4 h-[1px] bg-[#e87315]/20 mt-[2px]" />
                                    </div>
                                </div>

                                <div className="relative group/input">
                                    <input
                                        type="url"
                                        value={form.coverImage}
                                        onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                                        placeholder="IMG SOURCE URL"
                                        className="w-full bg-white/[0.02] border border-white/5 px-4 py-4 text-[12px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono tracking-tight"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-700" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-[#e87315]/30" />
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                                    This deployment serves as your profile header background.
                                </p>
                            </div>
                        </div>

                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                Social Links
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div className="space-y-2 group/input">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors flex items-center gap-2">
                                    LinkedIn
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={form.linkedIn}
                                        onChange={e => setForm(prev => ({ ...prev, linkedIn: e.target.value }))}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[12px] text-white placeholder:text-white/5 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                </div>
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors flex items-center gap-2">
                                    GitHub
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={form.github}
                                        onChange={e => setForm(prev => ({ ...prev, github: e.target.value }))}
                                        placeholder="https://github.com/..."
                                        className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[12px] text-white placeholder:text-white/5 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                </div>
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors flex items-center gap-2">
                                    Website
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={form.website}
                                        onChange={e => setForm(prev => ({ ...prev, website: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[12px] text-white placeholder:text-white/5 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[#e87315]/[0.02] rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                Skills
                            </h2>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex flex-wrap gap-3">
                                {form.skills.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="group/tag flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/10 hover:border-[#e87315]/40 transition-all duration-300"
                                    >
                                        <span className="text-[10px] font-bold text-white/60 group-hover/tag:text-white uppercase tracking-wider">
                                            {skill}
                                        </span>
                                        <button
                                            onClick={() => setForm(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }))}
                                            className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
                                        >
                                            <X size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}

                                {form.skills.length === 0 && (
                                    <div className="text-[11px] font-medium text-white/10 uppercase tracking-[0.2em] py-2">
                                        Enter a Skill
                                    </div>
                                )}
                            </div>

                            <div className="relative group/input">
                                <input
                                    type="text"
                                    placeholder="Type a skill and press Enter"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    className="w-full bg-white/[0.02] border border-white/5 px-4 py-4 text-[12px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono italic"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-700" />
                                <div className="absolute top-0 right-0 w-1 h-1 bg-white/5 group-focus-within/input:bg-[#e87315] transition-colors" />
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -left-2 opacity-[0.02] select-none pointer-events-none hidden sm:block">
                            <span className="text-[80px] font-black text-white italic leading-none tracking-tighter uppercase">Ability</span>
                        </div>
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    {user?.role === 'mentor' && (
                        <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                            <div className="flex items-center gap-3 mb-8 sm:mb-10 relative z-10">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                    Mentor Settings
                                </h2>
                            </div>

                            <div className="space-y-6 sm:space-y-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2 group/input">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                            Current Company
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={form.company}
                                                onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
                                                className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#e87315]/30 transition-all font-medium"
                                            />
                                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group/input">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                            Response Time
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={form.responseTime}
                                                onChange={e => setForm(prev => ({ ...prev, responseTime: e.target.value }))}
                                                className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white appearance-none cursor-pointer focus:outline-none focus:border-[#e87315]/30 transition-all"
                                            >
                                                {['< 24 hrs', '< 48 hrs', '< 72 hrs'].map(t => (
                                                    <option key={t} value={t} className="bg-[#0f0f0f] text-white">{t}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">V</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 group/input">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                        Availability Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={form.mentorStatus}
                                            onChange={e => setForm(prev => ({ ...prev, mentorStatus: e.target.value }))}
                                            className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white appearance-none cursor-pointer focus:outline-none focus:border-[#e87315]/30 transition-all"
                                        >
                                            {['Accepting Mentees', 'Limited Capacity', 'Unavailable'].map(s => (
                                                <option key={s} value={s} className="bg-[#0f0f0f] text-white">{s}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">V</div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-end gap-6 sm:gap-8 pt-2">
                                    <div className="w-full md:w-auto space-y-3 flex flex-col">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]"> Alumni</label>
                                        <button
                                            onClick={() => setForm(prev => ({ ...prev, isAlumni: !prev.isAlumni }))}
                                            className={`w-full md:w-32 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${form.isAlumni
                                                ? 'bg-[#e87315] border-[#e87315] text-black italic shadow-[0_0_15px_rgba(232,115,21,0.2)]'
                                                : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
                                                }`}
                                        >
                                            {form.isAlumni ? 'Yes' : 'No'}
                                        </button>
                                    </div>

                                    {form.isAlumni && (
                                        <div className="flex-1 w-full space-y-2 animate-in fade-in slide-in-from-left-2 duration-500">
                                            <label className="text-[9px] font-black text-[#e87315] uppercase tracking-[0.3em]">Graduation Year</label>
                                            <input
                                                type="text"
                                                value={form.gradYear}
                                                onChange={e => setForm(prev => ({ ...prev, gradYear: e.target.value }))}
                                                placeholder="e.g. 2024"
                                                className="w-full bg-white/[0.02] border border-[#e87315]/20 px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#e87315]/60 transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Core Expertise</label>
                                    <div className="flex flex-wrap gap-2">
                                        {form.expertise.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-wider group/tag hover:border-[#e87315]/40 transition-all">
                                                {item}
                                                <button
                                                    onClick={() => setForm(prev => ({ ...prev, expertise: prev.expertise.filter((_, idx) => idx !== i) }))}
                                                    className="text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            placeholder="Add expertise and press Enter"
                                            value={expertiseInput}
                                            onChange={e => setExpertiseInput(e.target.value)}
                                            onKeyDown={handleAddExpertise}
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-[12px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#e87315] transition-all font-mono italic"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                        </div>
                    )}

                    <div className="relative bg-[#080808] p-6 sm:p-8 border border-white/[0.03] overflow-hidden group">
                        <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                    Change Password
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded text-[10px] font-bold text-white/40 hover:text-[#e87315] hover:border-[#e87315]/30 transition-all uppercase tracking-tighter"
                            >
                                <span>{showPasswords ? 'Hide' : 'Show'}</span>
                                {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>

                        <div className="space-y-6 sm:space-y-8 relative z-10">
                            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                                <div key={field} className="space-y-2 group/input">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-focus-within/input:text-[#e87315] transition-colors">
                                        {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Re-Enter New password'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={passwordForm[field]}
                                            onChange={e => setPasswordForm(prev => ({ ...prev, [field]: e.target.value }))}
                                            className="w-full bg-white/[0.02] border border-white/5 px-4 py-3 text-[13px] text-white tracking-[0.2em] focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono"
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-700" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 sm:mt-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-t border-white/5 pt-8">
                            <div className="min-h-[20px] w-full text-center md:text-left">
                                {passwordError && (
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-red-500 animate-in fade-in slide-in-from-left-2">
                                        <div className="w-1 h-1 bg-red-500 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{passwordError}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={passwordSaving}
                                onClick={async () => {
                                    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                                        setPasswordError('Passwords do not match.');
                                        return;
                                    }
                                    if (passwordForm.newPassword.length < 6) {
                                        setPasswordError('Min length: 06 characters.');
                                        return;
                                    }
                                    setPasswordError(null);
                                    setPasswordSaving(true);
                                    try {
                                        console.log('Change password:', passwordForm);
                                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    } catch (err) {
                                        setPasswordError('Security Update Failed.');
                                    } finally {
                                        setPasswordSaving(false);
                                    }
                                }}
                                className="group/btn relative w-full sm:w-auto px-8 py-3.5 sm:py-3 overflow-hidden bg-transparent border border-[#e87315] transition-all duration-300 disabled:opacity-50 text-center flex justify-center"
                            >
                                <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#e87315] group-hover/btn:text-black transition-colors">
                                    {passwordSaving ? 'Syncing...' : 'Commit Changes'}
                                </span>
                            </button>
                        </div>

                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-6">
                        <h2 className="text-[10px] font-black text-red-500/70 uppercase tracking-widest mb-4">Danger Zone</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-white">Log Out</p>
                                <p className="text-xs text-gray-600 mt-0.5">Sign out of your account on this device.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex justify-center items-center gap-2 w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyProfile;