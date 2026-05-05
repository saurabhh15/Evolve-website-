import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useLenis from './hooks/useLenis';
// Lazy loading all route components to significantly improve initial page load speed
const Landing = lazy(() => import('./pages/Landing'));
const Onboarding = lazy(() => import("./pages/Onboarding.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx")); 
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Success = lazy(() => import('./pages/Success.jsx'));
const About = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/ContactPage"));
const Events = lazy(() => import("./pages/shared/Events.jsx"));
const AuthCallback = lazy(() => import('./pages/AuthCallback.jsx'));
const MentorProfile = lazy(() => import('./pages/mentor/MentorProfile.jsx'));
const MyProfile = lazy(() => import('./pages/shared/Myprofile.jsx'));
const ProjectDetail = lazy(() => import('./pages/shared/ProjectDetails.jsx'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile.jsx'));
const Notifications = lazy(() => import('./pages/shared/Notifications.jsx'));

function App() {
  useLenis();

  return (
    <>
      <ScrollToTop />
      {/* Fallback UI while lazy-loaded components are downloading */}
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center" />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/success-stories" element={<Success />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Events" element={<Events />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding-protocol" element={<Onboarding />} />
            {/* The asterisk (*) tell everything  start with dashboard should handle by Dashboard component */}
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/dashboard/mentor/:id" element={<MentorProfile />} />
            <Route path="/dashboard/project/:id" element={<ProjectDetail />} />
            <Route path="/dashboard/user/:id" element={<StudentProfile />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/dashboard/events" element={<Events />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;