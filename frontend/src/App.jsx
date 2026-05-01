import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import Onboarding from "./pages/OnboardingProtocol.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx"; 
import useLenis from './hooks/useLenis';
import GetStarted from "./pages/GetStarted";
import Success from './pages/Success.jsx';
import About from "./pages/AboutUs";
import Contact from "./pages/ContactPage";
import Events from "./pages/shared/Events.jsx";
import AuthCallback from './pages/AuthCallback.jsx';
import MentorProfile from './pages/mentor/MentorProfile.jsx';
import MyProfile from './pages/shared/Myprofile.jsx';
import ProjectDetail from './pages/shared/ProjectDetails.jsx';
import StudentProfile from './pages/student/StudentProfile.jsx';
import Notifications from './pages/shared/Notifications.jsx';
function App() {
  useLenis();

  return (
    <>
      <ScrollToTop />
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
    </>
  );
}

export default App;