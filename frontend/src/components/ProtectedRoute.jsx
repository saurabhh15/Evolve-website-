import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Add this to see where the user is

  if (loading) return <div className="bg-[#050505] h-screen" />;

  // 1. Not logged in?
  if (!user) return <Navigate to="/get-started" replace />;

  // 2. Logged in but setup incomplete?
  if (!user.hasCompletedOnboarding) {
    // IF they are already on the onboarding page, let them through to the Outlet!
    if (location.pathname === '/onboarding-protocol') {
      return <Outlet />;
    }
    // Otherwise, send them there
    return <Navigate to="/onboarding-protocol" replace />;
  }

  // 3. If finished onboarding but trying to go back to the protocol page, send to dashboard
  if (user.hasCompletedOnboarding && location.pathname === '/onboarding-protocol') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;