import React, { useState, useEffect } from 'react';
import { projectAPI, connectionAPI } from '../../services/api';
import { Package, Eye, Heart, Users } from 'lucide-react';

const StatsOverview = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, networkRes] = await Promise.all([
          projectAPI.getMyProjects(),
          connectionAPI.getNetwork()
        ]);
        setMyProjects(projectsRes.data);
        setNetwork(networkRes.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalViews = myProjects.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalLikes = myProjects.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const weeklyViews = myProjects.reduce((sum, p) => sum + (p.weeklyViews || 0), 0);
  const weeklyLikes = myProjects.reduce((sum, p) => sum + (p.weeklyLikes || 0), 0);

  // Weekly connections
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyConnections = network.filter(c => new Date(c.createdAt) > oneWeekAgo).length;

  // Monthly projects
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const monthlyProjects = myProjects.filter(p => new Date(p.createdAt) > oneMonthAgo).length;

  const getTrend = (weekly, total) => {
    if (total === 0) return null;
    const prev = total - weekly;
    if (prev === 0) return weekly > 0 ? '+100%' : null;
    const pct = Math.round((weekly / prev) * 100);
    return weekly >= 0 ? `+${pct}%` : `${pct}%`;
  };

  const stats = [
    {
      id: 1,
      icon: Package,
      label: 'My Projects',
      value: loading ? '—' : myProjects.length,
      color: 'text-white',
      trend: monthlyProjects > 0 ? `+${monthlyProjects} this month` : null,
      trendLabel: null
    },
    {
      id: 2,
      icon: Eye,
      label: 'Total Views',
      value: loading ? '—' : totalViews.toLocaleString(),
      color: 'text-[#e87315]',
      trend: weeklyViews > 0 ? `+${weeklyViews}` : null,
      trendLabel: 'this week'
    },
    {
      id: 3,
      icon: Heart,
      label: 'Total Likes',
      value: loading ? '—' : totalLikes,
      color: 'text-white',
      trend: weeklyLikes > 0 ? `+${weeklyLikes}` : null,
      trendLabel: 'this week'
    },
    {
      id: 4,
      icon: Users,
      label: 'Connections',
      value: loading ? '—' : network.length,
      color: 'text-[#e87315]',
      trend: getTrend(weeklyConnections, network.length),
      trendLabel: 'this week'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-y border-white/[0.03] mb-8 sm:mb-12 bg-[#050505]">
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          onClick={stat.id === 4 ? () => window.dispatchEvent(new CustomEvent('openConnections')) : undefined}
          className={`group relative p-4 sm:p-6 lg:p-8 transition-all duration-500 hover:bg-white/[0.01] 
            ${i % 2 !== 1 ? 'border-r border-white/[0.03]' : ''} 
            ${i < 2 ? 'border-b border-white/[0.03] lg:border-b-0' : ''}
            ${i !== stats.length - 1 ? 'lg:border-r border-white/[0.03]' : ''} 
            ${stat.id === 4 ? 'cursor-pointer' : ''}`}
        >
          {/* 1. TOP INDICATOR LINE (Ghost Architect Hallmark) */}
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

            {/* Optical Divider / Status Block - Hidden on pure mobile, shown sm and up */}
            <div className="hidden sm:block h-[2px] w-4 bg-white/[0.03] group-hover:bg-[#e87315]/40 transition-all shrink-0" />

            {/* Trend Indicator (Technical Overlay Style) */}
            {stat.trend && !loading && (
              <div className="flex items-center text-[8px] sm:text-[9px] font-black text-emerald-500/50 group-hover:text-emerald-400 transition-colors tracking-widest uppercase italic whitespace-nowrap">
                +{stat.trend}
              </div>
            )}
          </div>

          {/* Decorative Bottom Corner (Subtle) */}
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/[0.02] group-hover:bg-[#e87315]/20 transition-all" />
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;