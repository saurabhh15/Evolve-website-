import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { connectionAPI } from '../../services/api';
import { Users, Clock, GraduationCap } from 'lucide-react';
import StatsOverview from '../../components/dashboard/Statsoverview';
import ProjectsGrid from '../../components/dashboard/ProjectsGrid';
import SkillsProgress from '../../components/dashboard/SkillsProgress';
import UpcomingDeadlines from '../../components/dashboard/UpcomingDeadlines';
import TeamRecruitment from '../../components/dashboard/TeamRecruitment';
import AlumniFeedback from '../../components/dashboard/AlumniFeedback';
import ConnectionRequests from '../../components/dashboard/ConnectionRequests';
import ExplorePreview from '../../components/dashboard/ExplorePreview';
import RecentMessages from '../../components/dashboard/RecentMessages';
import Eventscard from '../../components/shared/Events-card';




const StudentDashboard = () => {

  const { user } = useAuth();
  const [network, setNetwork] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const [networkRes, pendingRes, sentRes] = await Promise.all([
          connectionAPI.getNetwork(),
          connectionAPI.getReceived(),
          connectionAPI.getSent()
        ]);
        setNetwork(networkRes.data);

        // Combine received pending + sent pending
        const receivedPending = pendingRes.data;
        const sentPending = sentRes.data.filter(c => c.status === 'pending');
        setPending([...receivedPending, ...sentPending]);
      } catch (err) {
        console.error('Failed to fetch network data:', err);
      }
    };
    fetchNetworkData();
  }, []);

  const mentorsCount = network.filter(u => u.role === 'mentor').length;


  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-10">

      {/* ── NEW HERO BANNER: Hover Tilt Graphic + Text ── */}
      <header
        className="relative w-full rounded-[0.5rem] bg-[#0a0a0a] border border-white/[0.04] overflow-hidden animate-evolve-in flex flex-col md:flex-row items-center justify-between p-8 md:p-12 mb-2 shadow-2xl"
        style={{ animationDelay: '0s' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 w-full md:w-3/5 space-y-6">
          <div>
            <p className="text-[#e87315] text-xs font-black tracking-[0.2em] uppercase mb-3">Welcome Back</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1]">
              Good morning, {user?.name?.split(' ')[0] || 'Builder'}.
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base font-medium max-w-md leading-relaxed">
              Check out your dashboard. Here is what's happening with your projects, commercialization milestones, and active collaborations today.
            </p>
          </div>

          {pending.length > 0 && (
            <div className="inline-flex items-center gap-3 px-4 py-2.5  bg-white/[0.03] border border-white/[0.05] backdrop-blur-md shadow-lg">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#e87315] opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[#e87315]" />
              </div>
              <span className="text-xs font-bold text-gray-400">
                You have <span className="text-white">{pending.length} pending</span> connection {pending.length === 1 ? 'request' : 'requests'}
              </span>
            </div>
          )}
        </div>

        {/* Right Graphic: Interactive Hover Tilt with Glow */}
        {/* Right Graphic: Network Stats Card */}
        <div className="relative z-10 hidden md:flex w-full md:w-2/5 justify-end mt-8 md:mt-0">
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#e87315]/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative w-64 h-48 [transform:perspective(1000px)_rotateX(10deg)_rotateY(-15deg)] hover:[transform:perspective(1000px)_rotateX(5deg)_rotateY(-5deg)] transition-transform duration-700 ease-out group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-[#161616]/90 to-[#080808]/90 border border-white/[0.08] group-hover:border-[#e87315]/40 rounded-3xl shadow-2xl p-5 flex flex-col justify-between overflow-hidden backdrop-blur-md transition-colors duration-500">

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#e87315]/10 flex items-center justify-center border border-[#e87315]/20 group-hover:bg-[#e87315]/20 transition-colors">
                  <Users size={20} className="text-[#e87315]" />
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-[#e87315] tracking-widest uppercase">Network</p>
                  <p className="text-xl font-black text-white leading-none mt-1">{network.length}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 w-full relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={11} className="text-gray-500" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mentors</span>
                  </div>
                  <span className="text-[9px] font-black text-white">{mentorsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-gray-500" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pending</span>
                  </div>
                  <span className={`text-[9px] font-black ${pending.length > 0 ? 'text-[#e87315]' : 'text-white'}`}>
                    {pending.length}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#e87315] to-[#f97316] rounded-full transition-all duration-700"
                    style={{ width: network.length > 0 ? `${Math.min((mentorsCount / network.length) * 100, 100)}%` : '0%' }}
                  />
                </div>
                <p className="text-[8px] text-gray-600 font-medium">
                  {mentorsCount} of {network.length} connections are mentors
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent to-transparent group-hover:from-[#e87315]/20 transition-all duration-700 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Compact Stats ── */}
      <div className="animate-evolve-in" style={{ animationDelay: '0.08s' }}>
        <StatsOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="animate-evolve-in" style={{ animationDelay: '0.18s' }}><ProjectsGrid /></div>
          <div className="animate-evolve-in" style={{ animationDelay: '0.23s' }}><ConnectionRequests /></div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="animate-evolve-in" style={{ animationDelay: '0.16s' }}><TeamRecruitment /></div>
          <div className="animate-evolve-in" style={{ animationDelay: '0.21s' }}><ExplorePreview /></div>
        </div>
      </div>
      <div className="grid grid-cols-9 gap-8 items-start">
        <div className="animate-evolve-in col-span-6" style={{ animationDelay: '0.28s' }}>
          <AlumniFeedback />
        </div>
        <div className="animate-evolve-in col-span-3" style={{ animationDelay: '0.28s' }}>
          <Eventscard />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="animate-evolve-in" style={{ animationDelay: '0.32s' }}><SkillsProgress /></div>
        <div className="animate-evolve-in" style={{ animationDelay: '0.36s' }}><RecentMessages /></div>
      </div>

    </div>
  );
};

export default StudentDashboard;