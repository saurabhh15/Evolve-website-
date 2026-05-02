import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const needsOnboarding = params.get('onboarding') === 'true';

            if (token) {
                // Save token
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Fetch user data
                try {
                    const res = await axios.get('https://evolve-website.onrender.com/api/auth/me');
                    setUser(res.data);

                    // Redirect based on onboarding status
                    if (needsOnboarding) {
                        navigate('/onboarding-protocol');
                    } else {
                        navigate('/dashboard');
                    }
                } catch (err) {
                    console.error('Failed to fetch user:', err);
                    navigate('/get-started');
                }
            } else {
                navigate('/get-started');
            }
        };

        handleCallback();
    }, [navigate, setUser]);

    return (
        // Changed to 100dvh for perfect mobile sizing
        <div className="min-h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-3">
                {/* Brand-matching Orange Spinner */}
                <svg 
                    className="animate-spin h-5 w-5 md:h-6 md:w-6 text-[#f97316]" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                
                {/* Pulsing Text */}
                <div className="text-white/80 text-lg md:text-xl font-medium tracking-wide animate-pulse">
                    Authenticating...
                </div>
            </div>
        </div>
    );
};

export default AuthCallback;