import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const GetStarted = () => {
    const { login, setUser } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength++;
        if (pass.length > 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const passwordStrength = getStrength(formData.password);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const waves = [
            { amplitude: 80, frequency: 0.002, speed: 0.015, offset: 0, color: { r: 249, g: 115, b: 22 }, opacity: 0.12 },
            { amplitude: 100, frequency: 0.0015, speed: 0.012, offset: 100, color: { r: 253, g: 186, b: 116 }, opacity: 0.1 },
            { amplitude: 120, frequency: 0.0018, speed: 0.01, offset: 200, color: { r: 234, g: 88, b: 12 }, opacity: 0.08 },
            { amplitude: 90, frequency: 0.0025, speed: 0.018, offset: 300, color: { r: 255, g: 237, b: 213 }, opacity: 0.06 },
        ];

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);

            time += 0.5;

            waves.forEach((wave, index) => {
                ctx.beginPath();
                for (let x = 0; x <= w; x += 5) {
                    const angle = (x * wave.frequency) + (time * wave.speed) + wave.offset;
                    const y = (h / 2) + Math.sin(angle) * wave.amplitude + (index * 30);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineTo(w, h);
                ctx.lineTo(0, h);
                ctx.closePath();

                const waveGradient = ctx.createLinearGradient(0, 0, 0, h);
                const { r, g, b } = wave.color;
                waveGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wave.opacity})`);
                waveGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                ctx.fillStyle = waveGradient;
                ctx.fill();
            });

            const glowGradient = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.6);
            glowGradient.addColorStop(0, 'rgba(249, 115, 22, 0.08)');
            glowGradient.addColorStop(0.5, 'rgba(234, 88, 12, 0.04)');
            glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, w, h);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        if (errors.server) {
            const timer = setTimeout(() => {
                setErrors(prev => ({ ...prev, server: '' }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors.server]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            } else if (!/^[a-zA-Z0-9_\s]+$/.test(formData.firstName)) {
                newErrors.firstName = 'Only letters, numbers, and underscores allowed';
            } else if (formData.firstName.length < 2) {
                newErrors.firstName = 'Name must be at least 2 characters';
            }
            if (formData.lastName && !/^[a-zA-Z0-9_\s]+$/.test(formData.lastName)) {
                newErrors.lastName = 'Only letters, numbers, and underscores allowed';
            }
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        setIsLoading(true);

        try {
            if (isLogin) {
                const user = await login(formData.email, formData.password);
                if (user.hasCompletedOnboarding) navigate('/dashboard');
                else navigate('/onboarding-protocol');
            } else {
                const res = await api.post('/auth/register', {
                    name: fullName,
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('token', res.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                setUser(res.data.user);
                navigate('/onboarding-protocol');
            }
        } catch (err) {
            console.error('Auth error:', err);
            const errorMessage = err.response?.data?.message || '';
            if (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('user already')) {
                setErrors({ email: 'This email is already registered. Try logging in instead.' });
            } else if (errorMessage.toLowerCase().includes('invalid credentials')) {
                setErrors({ password: 'Invalid email or password' });
            } else {
                setErrors({ server: errorMessage || 'Connection failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = (provider) => {
        // Changed to directly use production backend URL
        const base = 'https://evolve-website.onrender.com';
        const authUrls = {
            Google: `${base}/api/auth/google`,
            GitHub: `${base}/api/auth/github`
        };
        window.location.href = authUrls[provider];
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="min-h-[100dvh] w-full relative overflow-hidden bg-black">
            {/* Animated Wave Background */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Grain Overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Main Content */}
            <div className="relative z-20 min-h-[100dvh] flex flex-col lg:flex-row w-full">

                {/* ===== LEFT SIDE - visible on ALL screens ===== */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 xl:px-20 pt-16 pb-6 lg:py-12">

                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-6 lg:mb-12">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0">
                            <img className="w-full h-full object-contain" src="/Evolve.png" alt="evolve-logo" />
                        </div>
                        <Link
                            to="/"
                            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight hover:opacity-80 transition-opacity"
                        >
                            Evolve<span className="text-[#f97316]">.</span>
                        </Link>
                    </div>

                    {/* Heading */}
                    <div className="space-y-3 mb-4 lg:mb-7">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-6xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                                Transform your
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                academic research
                            </span>
                            <br />
                            <span className="text-white">
                                into real startups
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base xl:text-xl text-purple-200/80 max-w-lg leading-relaxed pt-2 lg:pt-4">
                            Join thousands of researchers and innovators building the next generation of breakthrough companies.
                        </p>
                    </div>

                    {/* Pill badges - hidden on very small screens to save space */}
                    <div className="hidden sm:flex flex-wrap gap-2 mt-1 lg:mt-2">
                        {['Mentor Matching', 'Investor Access', 'Real Collaboration'].map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/40 text-orange-400 bg-orange-500/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT SIDE - GLASSMORPHIC FORM ===== */}
                <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 pb-12 lg:min-h-[100dvh]">

                    {/* Close / Home Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 md:right-10 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-600/20 hover:border-orange-500/50 transition-all duration-300 group z-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            className="text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all w-5 h-5 sm:w-6 sm:h-6"
                        >
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </button>

                    <div className="w-full max-w-md">
                        {/* Glass Form Card */}
                        <div
                            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl p-6 sm:p-8 shadow-2xl w-full"
                            style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
                            }}
                        >
                            {/* Animated glow inside card */}
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.4), transparent 50%)' }}
                            />

                            <div className="relative">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                        {isLogin ? 'Welcome back' : 'Create account'}
                                    </h2>
                                    <p className="text-sm sm:text-base text-purple-200/70">
                                        {isLogin ? 'Login to continue your journey' : 'Sign up to get started'}
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                                    {/* Name Fields */}
                                    {!isLogin && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                                            <div className="space-y-1.5">
                                                <label htmlFor="firstName" className="block text-xs font-medium text-white/90">First Name</label>
                                                <input
                                                    id="firstName" name="firstName" type="text"
                                                    value={formData.firstName} onChange={handleChange}
                                                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 text-sm"
                                                    placeholder="Prakash"
                                                />
                                                {errors.firstName && <p className="text-xs text-pink-400">{errors.firstName}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="lastName" className="block text-xs font-medium text-white/90">Last Name (Optional)</label>
                                                <input
                                                    id="lastName" name="lastName" type="text"
                                                    value={formData.lastName} onChange={handleChange}
                                                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 text-sm"
                                                    placeholder="Kumar"
                                                />
                                                {errors.lastName && <p className="text-xs text-pink-400">{errors.lastName}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="block text-xs font-medium text-white/90">Email</label>
                                        <input
                                            id="email" name="email" type="email"
                                            value={formData.email} onChange={handleChange}
                                            className="w-full px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 text-sm"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p className="text-xs text-pink-400">{errors.email}</p>}
                                    </div>

                                    {/* Password Fields */}
                                    {!isLogin ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                                            {/* Password */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="password" className="block text-xs font-medium text-white/90">Password</label>
                                                <div className="relative">
                                                    <input
                                                        id="password" name="password"
                                                        type={showPassword.password ? 'text' : 'password'}
                                                        value={formData.password} onChange={handleChange}
                                                        className={`w-full px-3 py-2.5 pr-10 rounded-xl bg-white/10 backdrop-blur-xl border transition-all duration-300 text-sm focus:outline-none ${errors.password ? 'border-red-500/70' : passwordStrength > 2 ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-white/20 focus:ring-2 focus:ring-orange-500/50'} text-white placeholder-white/50`}
                                                        placeholder="Enter password"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white/80 transition-colors">
                                                        {showPassword.password ? (
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                                {formData.password && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex gap-1 h-1">
                                                            {[1, 2, 3, 4].map((level) => (
                                                                <motion.div
                                                                    key={level}
                                                                    initial={{ scaleX: 0 }}
                                                                    animate={{ scaleX: 1, backgroundColor: level <= passwordStrength ? (passwordStrength <= 2 ? '#f87171' : '#f97316') : 'rgba(255,255,255,0.1)' }}
                                                                    className="h-full w-full rounded-full origin-left transition-colors duration-500"
                                                                />
                                                            ))}
                                                        </div>
                                                        <motion.p
                                                            animate={{ opacity: [0.7, 1, 0.7] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                            className={`text-[9px] uppercase tracking-tighter font-bold ${passwordStrength <= 2 ? 'text-red-400' : 'text-orange-500'}`}
                                                        >
                                                            {passwordStrength <= 2 ? 'Weak Protocol' : 'Secure Connection'}
                                                        </motion.p>
                                                    </div>
                                                )}
                                                {errors.password && <p className="text-xs text-pink-400">{errors.password}</p>}
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/90">Confirm</label>
                                                <div className="relative">
                                                    <input
                                                        id="confirmPassword" name="confirmPassword"
                                                        type={showPassword.confirmPassword ? 'text' : 'password'}
                                                        value={formData.confirmPassword} onChange={handleChange}
                                                        className={`w-full px-3 py-2.5 pr-10 rounded-xl bg-white/10 backdrop-blur-xl border ${errors.confirmPassword ? 'border-red-500/70' : 'border-white/20'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-sm`}
                                                        placeholder="Confirm password"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white/80 transition-colors">
                                                        {showPassword.confirmPassword ? (
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && <p className="text-xs text-pink-400">{errors.confirmPassword}</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <label htmlFor="password" className="block text-xs font-medium text-white/90">Password</label>
                                            <div className="relative">
                                                <input
                                                    id="password" name="password"
                                                    type={showPassword.password ? 'text' : 'password'}
                                                    value={formData.password} onChange={handleChange}
                                                    className={`w-full px-3 py-2.5 pr-10 rounded-xl bg-white/10 backdrop-blur-xl border ${errors.password ? 'border-red-500/70' : 'border-white/20'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-sm`}
                                                    placeholder="Enter your password"
                                                />
                                                <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white/80 transition-colors">
                                                    {showPassword.password ? (
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-xs text-pink-400">{errors.password}</p>}
                                        </div>
                                    )}

                                    {errors.server && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-xl"
                                        >
                                            <p className="text-sm text-red-300 text-center font-medium">{errors.server}</p>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 rounded-xl font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#f97316]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 text-sm sm:text-base"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                {isLogin ? 'Signing in...' : 'Creating account...'}
                                            </span>
                                        ) : (
                                            isLogin ? 'Login' : 'Sign up'
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-5 sm:my-6">
                                    <div className="relative flex justify-center text-xs sm:text-sm">
                                        <span className="px-4 bg-transparent text-white/60">Or continue with</span>
                                    </div>
                                </div>

                                {/* Social Login */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSocialAuth('Google')}
                                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSocialAuth('GitHub')}
                                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        GitHub
                                    </button>
                                </div>

                                {/* Toggle Mode */}
                                <div className="text-center mt-5 sm:mt-6">
                                    <p className="text-xs sm:text-sm text-white/70">
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                        <button
                                            type="button"
                                            onClick={toggleMode}
                                            className="font-medium text-orange-400 hover:text-amber-300 transition-colors underline decoration-dotted underline-offset-2"
                                        >
                                            {isLogin ? 'Sign up' : 'Login'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GetStarted;