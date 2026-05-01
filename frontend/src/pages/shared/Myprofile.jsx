import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, authAPI } from '../../services/api';
import { MapPin, X, LogOut, Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const MyProfile = () => {
    const { user, setUser, logout } = useAuth();
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
        // Mentor specific
        company: '',
        expertise: [],
        mentorStatus: 'Accepting Mentees',
        isAlumni: false,
        gradYear: '',
        responseTime: '< 48 hrs',
    });

    const [skillInput, setSkillInput] = useState('');
    const [expertiseInput, setExpertiseInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Password state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Initialize form from user
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                college: user.college || '',
                profileImage: user.profileImage || '',
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

    const inputClass = "w-full px-4 py-3 bg-[#161616] border border-white/[0.04] hover:border-white/[0.08] focus:border-[#e87315]/30 rounded-xl text-white text-sm focus:outline-none transition-all";
    const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2";
    const cardClass = "bg-[#101010] border border-white/[0.04] rounded-2xl p-6 space-y-5";

    return (
        <div className="w-full pb-20 bg-[#050505] min-h-screen">

            {/* ── Header Banner ── */}
            <div className="relative h-48 w-full overflow-hidden rounded-b-xl">
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


            {/* ── Profile Image + Name ── */}
            <div className="max-w-4xl mx-auto px-6">
                <div className="relative -mt-16 flex items-end gap-6 pb-8 border-b border-white/[0.04]">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-28 h-28  overflow-hidden border-4 border-[#050505] shadow-2xl">
                            <img
                                src={form.profileImage || `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${user?.name}&bold=true`}
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=400&name=${user?.name}&bold=true`;
                                }}
                                className="w-full h-full object-cover"
                                alt={user?.name}
                            />
                        </div>
                    </div>

                    {/* Name + role */}
                    <div className="flex-1 pb-2">
                        <h1 className="text-3xl font-black tracking-tighter text-white">{user?.name}</h1>
                        <p className="text-[#e87315] text-xs font-bold uppercase tracking-widest mt-1">{user?.role || 'Member'}</p>
                        {user?.location && (
                            <div className="flex items-center gap-1.5 text-white/30 mt-1.5">
                                <MapPin size={11} />
                                <span className="text-[10px] font-medium">{user.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`group/save relative flex items-center gap-3 px-8 py-4 overflow-hidden transition-all duration-500 border ${saveSuccess
                            ? 'bg-green-500/5 border-green-500/30 text-green-400'
                            : 'bg-transparent border-[#e87315] text-[#e87315]'
                            }`}
                    >
                        {/* ── Background Slide Fill ── */}
                        {!saveSuccess && (
                            <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/save:translate-y-0 transition-transform duration-300 ease-out" />
                        )}

                        {/* ── Content ── */}
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

                        {/* Architect Accent: Corner Notch */}
                        <div className={`absolute top-0 right-0 w-1.5 h-1.5 transition-colors ${saveSuccess ? 'bg-green-500/50' : 'bg-[#e87315] group-hover/save:bg-black'
                            }`} />
                    </button>
                </div>

                {error && (
                    <p className="text-red-400 text-sm font-semibold mt-4">{error}</p>
                )}

                <div className="space-y-6 mt-8">

                    {/* ── Basic Info ── */}
                    <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                        {/* ── Header Segment ── */}
                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                Basic Info
                            </h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {/* Grid: Name & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                            {/* College Segment */}
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

                            {/* Bio Segment */}
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

                        {/* Architect Background Detail */}
                        <div className="absolute -bottom-6 -right-16 -rotate-30 opacity-[0.02] select-none pointer-events-none z-10">
                            <span className="text-[120px] font-black italic tracking-tighter uppercase">Info</span>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors duration-500" />
                    </div>

                    {/* ── Profile Image ── */}
                    <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                        {/* ── Background Decal ── */}
                        <div className="absolute top-40 -right-10 -rotate-35 p-4 opacity-[0.02] select-none pointer-events-none">
                            <span className="text-[60px] font-black text-white italic leading-none tracking-tighter">Image</span>
                        </div>

                        {/* ── Header Segment ── */}
                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                Profile Image
                            </h2>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            {/* Preview Hex/Box */}
                            <div className="relative group/preview">
                                <div className="w-24 h-24 bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 group-hover/preview:border-[#e87315]/40">
                                    {form.profileImage ? (
                                        <img
                                            src={form.profileImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover grayscale group-hover/preview:grayscale-0 transition-all duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-4 h-4 border border-white/10 rotate-45" />
                                        </div>
                                    )}
                                </div>
                                {/* Architect Corner Ticks */}
                                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]" />
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/20 group-hover/preview:border-[#e87315] transition-colors" />
                            </div>

                            {/* Input Logic */}
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
                                    {/* Scanning line animation on focus */}
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-700" />
                                </div>

                                <div className="flex items-start gap-2 pt-1">
                                    <div className="mt-1 w-1 h-1 bg-white/20" />
                                    <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest leading-relaxed">
                                        Supported: Unsplash, Imgur, Cloudinary. <br />
                                        Ensure the URL terminates in a valid image extension.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Corner Signatures */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>
                    <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                        {/* ── Background Decal ── */}
                        <div className="absolute top-60 right-160 rotate-20 p-4 opacity-[0.02] select-none pointer-events-none">
                            <span className="text-[60px] font-black text-white italic leading-none tracking-tighter uppercase">Header</span>
                        </div>

                        {/* ── Input Segment ── */}
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                                    05  Cover Image
                                </label>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Aspect-Ratio Preview Frame */}
                                <div className="relative w-full h-32 bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-[#e87315]/20">
                                    {form.coverImage ? (
                                        <img
                                            src={form.coverImage}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/5">
                                            <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">Add an profile header...</span>
                                        </div>
                                    )}
                                    {/* Scanning HUD Overlay */}
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
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                                    This deployment serves as your profile header background.
                                </p>
                            </div>
                        </div>

                        {/* Architect Signatures */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    {/* ── Social Links ── */}
                    <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                        {/* ── Section Header ── */}
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                Social Links
                            </h2>
                        </div>

                        {/* ── Input Grid ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {/* LinkedIn Input */}
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

                            {/* GitHub Input */}
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

                            {/* Website Input */}
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

                        {/* ── Background Accents ── */}
                        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[#e87315]/[0.02] rounded-full blur-2xl pointer-events-none" />

                        {/* Architect Signatures */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    {/* ── Skills ── */}
                    <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                        {/* ── Section Header ── */}
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                Skills
                            </h2>
                        </div>

                        <div className="relative z-10 space-y-6">
                            {/* ── Tags Container ── */}
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

                            {/* ── Input Field ── */}
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    placeholder="Type a skill and press Enter"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    className="w-full bg-white/[0.02] border border-white/5 px-4 py-4 text-[12px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#e87315]/30 focus:bg-[#e87315]/[0.01] transition-all font-mono italic"
                                />
                                {/* Animated focus underline */}
                                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-focus-within/input:w-full transition-all duration-700" />

                                {/* Corner Accent for Input */}
                                <div className="absolute top-0 right-0 w-1 h-1 bg-white/5 group-focus-within/input:bg-[#e87315] transition-colors" />
                            </div>
                        </div>

                        {/* ── Background Decal ── */}
                        <div className="absolute -bottom-10 -left-2 opacity-[0.02] select-none pointer-events-none">
                            <span className="text-[80px] font-black text-white italic leading-none tracking-tighter uppercase">Ability</span>
                        </div>

                        {/* Architect Signatures */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                    </div>

                    {/* ── Mentor Specific ── */}
                    {user?.role === 'mentor' && (
                        <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                            {/* ── Section Header ── */}
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <div className="w-1.5 h-1.5 bg-[#e87315] rotate-45" />
                                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                                    Mentor Settings
                                </h2>
                            </div>

                            <div className="space-y-8 relative z-10">
                                {/* Grid: Company & Response Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Selector */}
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
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">▼</div>
                                    </div>
                                </div>

                                {/* Alumni Toggle & Year */}
                                <div className="flex flex-col md:flex-row items-end gap-8 pt-2">
                                    <div className="w-full md:w-auto space-y-3">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mr-2"> Alumni</label>
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

                                {/* Expertise Tags */}
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

                            {/* Architect Details */}
                            <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />
                        </div>
                    )}

                    {/* ── Change Password ── */}
                    <div className="relative bg-[#080808] p-8 border border-white/[0.03] overflow-hidden group">
                        {/* ── Section Header ── */}
                        <div className="flex items-center justify-between mb-10 relative z-10">
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

                        {/* ── Input Fields ── */}
                        <div className="space-y-8 relative z-10">
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

                        {/* ── Error & Action ── */}
                        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-t border-white/5 pt-8">
                            <div className="min-h-[20px]">
                                {passwordError && (
                                    <div className="flex items-center gap-2 text-red-500 animate-in fade-in slide-in-from-left-2">
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
                                className="group/btn relative px-8 py-3 overflow-hidden bg-transparent border border-[#e87315] transition-all duration-300 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#e87315] group-hover/btn:text-black transition-colors">
                                    {passwordSaving ? 'Syncing...' : 'Commit Changes'}
                                </span>
                            </button>
                        </div>

                        {/* Architect Signatures */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-[#e87315] transition-colors" />

                        {/* Decorative background number */}

                    </div>

                    {/* ── Danger Zone ── */}
                    <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-6">
                        <h2 className="text-[10px] font-black text-red-500/70 uppercase tracking-widest mb-4">Danger Zone</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-white">Log Out</p>
                                <p className="text-xs text-gray-600 mt-0.5">Sign out of your account on this device.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
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