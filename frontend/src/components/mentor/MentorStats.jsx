import React, { useState, useEffect } from 'react';
import { Users, Clock, Star, TrendingUp, MessageSquare } from 'lucide-react';
import { connectionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MentorStats = () => {
  const { user } = useAuth();
  const [menteeCount, setMenteeCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [networkRes, pendingRes] = await Promise.all([
          connectionAPI.getNetwork(),
          connectionAPI.getReceived()
        ]);
        setMenteeCount(networkRes.data.filter(u => u.role === 'Student').length);
        setPendingCount(pendingRes.data.length);
      } catch (err) {
        console.error('Failed to fetch mentor stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      id: 1,
      icon: Users,
      label: 'Total Mentees',
      value: loading ? '—' : menteeCount,
      secondary: 'Active students',
      color: 'text-[#f4f1ea]',
    },
    {
      id: 2,
      icon: MessageSquare,
      label: 'Pending Inquiries',
      value: loading ? '—' : pendingCount,
      secondary: pendingCount > 0 ? 'Needs your response' : 'All caught up',
      color: pendingCount > 0 ? 'text-[#e87315]' : 'text-white',
    },
    {
      id: 3,
      icon: Clock,
      label: 'Sessions Held',
      value: loading ? '—' : user?.sessionsHeld || 0,
      secondary: 'Total sessions',
      color: 'text-[#f4f1ea]',
    },
    {
      id: 4,
      icon: Star,
      label: 'Rating',
      value: loading ? '—' : user?.rating?.toFixed(1) || '0.0',
      secondary: 'Out of 5.0',
      color: 'text-[#e87315]',
    },
  ];

  return (
    <div className="card-structured grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          onClick={stat.id === 4 ? () => window.dispatchEvent(new CustomEvent('openConnections')) : undefined}
          className={`group relative p-8 transition-all duration-500 hover:bg-white/[0.01] 
      ${i !== stats.length - 1 ? 'lg:border-r border-white/[0.03]' : ''} 
      border-b sm:border-b-0 border-white/[0.03] ${stat.id === 4 ? 'cursor-pointer' : ''}`}
        >
          {/* 1. TOP INDICATOR LINE */}
          <div className="absolute top-0 left-0 w-1 h-[1px] bg-white/10 group-hover:bg-[#e87315] group-hover:w-full transition-all duration-700" />

          {/* 2. HEADER: LABEL + ICON */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-white/20 text-[9px] font-bold tracking-[0.4em] uppercase italic group-hover:text-[#e87315] transition-colors">
              {stat.label}
            </p>
            <div className="text-white/10 group-hover:text-[#e87315] transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
              <stat.icon size={14} strokeWidth={2.5} />
            </div>
          </div>

          {/* 3. VALUE SECTION */}
          <div className="flex items-baseline gap-4 relative z-10">
            {loading ? (
              <div className="w-16 h-10 bg-white/[0.02] animate-pulse border border-white/5" />
            ) : (
              <h3 className="text-5xl font-light text-white tracking-tighter tabular-nums group-hover:tracking-normal transition-all duration-500 origin-left">
                {typeof stat.value === 'number'
                  ? stat.value.toString().padStart(2, '0')
                  : stat.value}
              </h3>
            )}

            {/* Optical Divider / Status Block */}
            <div className="h-[2px] w-4 bg-white/[0.03] group-hover:bg-[#e87315]/40 transition-all" />

            {/* Secondary Info / Trend */}
            <div className="flex flex-col">
              <p className="text-gray-600 text-[10px] font-medium tracking-tight uppercase group-hover:text-gray-400 transition-colors">
                {stat.secondary}
              </p>
            </div>
          </div>

          {/* Decorative Bottom Corner */}
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/[0.02] group-hover:bg-[#e87315]/20 transition-all" />

          {/* Hover halo (from your original logic) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e87315]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default MentorStats;