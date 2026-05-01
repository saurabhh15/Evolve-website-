import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Clock } from 'lucide-react';
import MentorStats from '../../components/mentor/MentorStats';
import ActiveProjects from '../../components/mentor/ActiveProjects';
import AIInsightPanel from '../../components/mentor/AIInsightPanel';
import SessionCalendar from '../../components/mentor/SessionCalendar';
import ExpertiseChart from '../../components/mentor/ExpertiseChart';
import RecentInquiries from '../../components/mentor/RecentInquiries';
import MyMentees from '../../components/mentor/MyMentees';
import ProjectsCommentedOn from '../../components/mentor/ProjectsCommentedOn';
import EventsCard from '../../components/shared/Events-card';
import RecentMessages from '../../components/dashboard/RecentMessages';
import { useAuth } from '../../context/AuthContext';
import { connectionAPI } from '../../services/api';

const MentorDashboard = () => {

  const { user } = useAuth();
  const [network, setNetwork] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [networkRes, pendingRes] = await Promise.all([
          connectionAPI.getNetwork(),
          connectionAPI.getReceived()
        ]);
        setNetwork(networkRes.data);
        setPending(pendingRes.data);
      } catch (err) {
        console.error('Failed to fetch mentor data:', err);
      }
    };
    fetchData();
  }, []);

  const menteeCount = network.filter(u => u.role === 'Student').length;

  return (
    <div className="w-full space-y-8 px-4 md:px-8 pb-12">

      {/* ── HERO BANNER: Hover Tilt Graphic + Text ── */}
      <header
        className="relative w-full rounded-[0.5rem] bg-[#0a0a0a] border border-white/[0.04] overflow-hidden animate-evolve-in flex flex-col md:flex-row items-center justify-between p-8 md:p-12 mb-4 shadow-2xl"
        style={{ animationDelay: '0s' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 w-full md:w-3/5 space-y-6">
          <div>
            <p className="text-[#e87315] text-xs font-black tracking-[0.2em] uppercase mb-3">Ecosystem Overview</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1]">
              Hello, {user?.name?.split(' ')[0] || 'Mentor'}.
            </h1>
            <p className="text-gray-400 mt-4 text-sm md:text-base font-medium max-w-md leading-relaxed">
              You are currently guiding <span className="text-white font-black">{menteeCount}</span> {menteeCount === 1 ? 'mentee' : 'mentees'} with <span className="text-white font-black">{pending.length}</span> pending {pending.length === 1 ? 'inquiry' : 'inquiries'} today.
            </p>
          </div>

          {pending.length > 0 ? (
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md shadow-lg">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#e87315] opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[#e87315]" />
              </div>
              <span className="text-xs font-bold text-gray-400">
                You have <span className="text-white">{pending.length} pending</span> {pending.length === 1 ? 'inquiry' : 'inquiries'}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 px-4 py-2.5  bg-white/[0.03] border border-white/[0.05] backdrop-blur-md shadow-lg">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-bold text-gray-400">
                Status: <span className="text-white">{user?.mentorStatus || 'Accepting Mentees'}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Graphic: Interactive Hover Tilt with Glow */}
        <div className="relative z-10 hidden md:flex w-full md:w-2/5 justify-end mt-8 md:mt-0" style={{ perspective: '1000px' }}>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#e87315]/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative w-64 h-48 [transform:rotateX(10deg)_rotateY(-15deg)] hover:[transform:rotateX(5deg)_rotateY(-5deg)_translateY(-5px)] transition-transform duration-700 ease-out group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#161616]/90 to-[#080808]/90 border border-white/[0.08] group-hover:border-[#e87315]/40 rounded-3xl shadow-2xl p-5 flex flex-col justify-between overflow-hidden backdrop-blur-md transition-colors duration-500">

              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#e87315]/10 flex items-center justify-center border border-[#e87315]/20 group-hover:bg-[#e87315]/20 transition-colors">
                  <Users size={20} className="text-[#e87315]" />
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-[#e87315] tracking-widest uppercase">Mentees</p>
                  <p className="text-xl font-black text-white leading-none mt-1">{menteeCount}</p>
                </div>
              </div>

              <div className="space-y-3 w-full relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={11} className="text-gray-500" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Network</span>
                  </div>
                  <span className="text-[9px] font-black text-white">{network.length}</span>
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
                    style={{ width: network.length > 0 ? `${Math.min((menteeCount / network.length) * 100, 100)}%` : '0%' }}
                  />
                </div>
                <p className="text-[8px] text-gray-600 font-medium">
                  {menteeCount} of {network.length} connections are mentees
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent to-transparent group-hover:from-[#e87315]/20 transition-all duration-700 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>


      <div className="animate-evolve-in" style={{ animationDelay: '0.08s' }}>
        <MentorStats />
      </div>

      {/* ── GRID SECTION: 8 / 4 split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="animate-evolve-in" style={{ animationDelay: '0.13s' }}>
            <RecentInquiries />
          </div>
          <div className="animate-evolve-in" style={{ animationDelay: '0.18s' }}>
            <ProjectsCommentedOn />
          </div>
          <div className="animate-evolve-in" style={{ animationDelay: '0.21s' }}>
            <RecentMessages />
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="animate-evolve-in" style={{ animationDelay: '0.16s' }}>
            <MyMentees />
          </div>
          <div className="animate-evolve-in" style={{ animationDelay: '0.16s' }}>
            <EventsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;