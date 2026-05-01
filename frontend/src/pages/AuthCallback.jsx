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
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-xl">Authenticating...</div>
        </div>
    );
};

export default AuthCallback;