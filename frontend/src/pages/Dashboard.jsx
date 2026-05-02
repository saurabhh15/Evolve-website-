import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard_main from './student/StudentDashboard-main';
import MentorLayout from '../layouts/MentorLayout';
import MentorMain from './mentor/MentorDashboard-main';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enhanced loading state to perfectly center any future spinner/logo
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center w-full" />
    );
  }

  const role = user?.role?.toLowerCase();

  // We derive the activeTab directly from the URL path
  // Example: "/dashboard/explore" becomes "explore"
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === 'dashboard' ? 'home' : currentPath;

  if (role === 'student') {
    return (
      <StudentLayout activeTab={activeTab}>
        <StudentDashboard_main activeTab={activeTab} />
      </StudentLayout>
    );
  }

  if (role === 'mentor') {
    return (
      <MentorLayout activeTab={activeTab}>
        <MentorMain activeTab={activeTab} />
      </MentorLayout>
    );
  }

  return null;
};

export default Dashboard;