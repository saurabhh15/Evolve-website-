import React, { useState, useEffect } from 'react';
import { Users, Clock, Star, MessageSquare } from 'lucide-react';
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
    <div className="card-structured grid grid-cols-2 md:grid-cols-4 gap-0 sm:gap-6 border-y border-white/[0.03] md:border-none md:bg-transparent bg-[#050505] md:p-0">
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          onClick={stat.id === 4 ? () => window.dispatchEvent(new CustomEvent('openConnections')) : undefined}
          className={`group relative p-4 sm:p-6 md:p-8 transition-all duration-500 hover:bg-white/[0.01] 
          ${i % 2 !== 1 ? 'border-r border-white/[0.03] md:border-r-0' : ''} 
          ${i < 2 ? 'border-b border-white/[0.03] md:border-b-0' : ''}
          ${i !== stats.length - 1 ? 'md:border-r md:border-white/[0.03]' : ''} 
          ${stat.id === 4 ? 'cursor-pointer' : ''}`}
        >
          {/* 1. TOP INDICATOR LINE */}
          <div className="absolute top-0 left-0 w-1 h-[1px] bg-white/10 group-hover:bg-[#e87315] group-hover:w-full transition-all duration-700" />

          {/* 2. HEADER: LABEL + ICON */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <p className="text-white/20 text-[8px] sm:text-[9px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase italic group-hover:text-[#e87315] transition-colors order-2 sm:order-1">
              {stat.label}
            </p>
            <div className="text-white/10 group-hover:text-[#e87315] transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 order-1 sm:order-2">
              <stat.icon size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
            </div>
          </div>

          {/* 3. VALUE SECTION */}
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-4 relative z-10">
            {loading ? (
              <div className="w-12 sm:w-16 h-8 sm:h-10 bg-white/[0.02] animate-pulse border border-white/5" />
            ) : (
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tighter tabular-nums group-hover:tracking-normal transition-all duration-500 origin-left">
                {typeof stat.value === 'number'
                  ? stat.value.toString().padStart(2, '0')
                  : stat.value}
              </h3>
            )}

            {/* Optical Divider / Status Block */}
            <div className="hidden sm:block h-[2px] w-4 bg-white/[0.03] group-hover:bg-[#e87315]/40 transition-all shrink-0" />

            {/* Secondary Info / Trend */}
            <div className="flex flex-col mt-1 sm:mt-0">
              <p className="text-gray-600 text-[8px] sm:text-[10px] font-medium tracking-tight uppercase group-hover:text-gray-400 transition-colors">
                {stat.secondary}
              </p>
            </div>
          </div>

          {/* Decorative Bottom Corner */}
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/[0.02] group-hover:bg-[#e87315]/20 transition-all" />

          {/* Hover halo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e87315]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default MentorStats;