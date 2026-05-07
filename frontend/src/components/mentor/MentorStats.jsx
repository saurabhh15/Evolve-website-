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

    // Real-time listeners
    useEffect(() => {
        // New connection request received bump pending count
        const onConnectionRequest = (e) => {
            const request = e.detail;
            setPendingCount(prev => prev + 1);
        };

        // Connection accepted/declined remove from pending, add to mentees if accepted
        const onConnectionActioned = (e) => {
            const { id, status, role } = e.detail;
            setPendingCount(prev => Math.max(prev - 1, 0));
            if (status === 'accepted' && role === 'Student') {
                setMenteeCount(prev => prev + 1);
            }
        };

        // Notification received check if it's a connection_accepted type
        const onNotification = (e) => {
            const data = e.detail;
            if (data.type === 'connection_accepted' && data.role === 'Student') {
                setMenteeCount(prev => prev + 1);
            }
        };

        window.addEventListener('connection_request_received', onConnectionRequest);
        window.addEventListener('connection_actioned', onConnectionActioned);
        window.addEventListener('notification_received', onNotification);

        return () => {
            window.removeEventListener('connection_request_received', onConnectionRequest);
            window.removeEventListener('connection_actioned', onConnectionActioned);
            window.removeEventListener('notification_received', onNotification);
        };
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
        <div className="card-structured grid grid-cols-2 md:grid-cols-4 gap-0 sm:gap-6 border border-white/10 sm:border-none">
            {stats.map((stat, i) => (
                <div
                    key={stat.id}
                    onClick={stat.id === 4 ? () => window.dispatchEvent(new CustomEvent('openConnections')) : undefined}
                    className={`group relative p-6 sm:p-8 transition-all duration-500 hover:bg-white/[0.03] sm:hover:bg-white/[0.02] sm:border border-white/10
          ${i !== stats.length - 1 ? 'border-r border-white/10 sm:border-r' : ''} 
          ${i < 2 ? 'border-b border-white/10 sm:border-b' : ''} 
          ${stat.id === 4 ? 'cursor-pointer' : ''}`}
                >
                    {/* Top hover line indicator */}
                    <div className="absolute top-0 left-0 w-2 h-[1px] bg-white/20 group-hover:bg-[#e87315] group-hover:w-full transition-all duration-700" />

                    <div className="flex justify-between items-center mb-5 sm:mb-6">
                        <p className="text-white/60 text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase italic group-hover:text-[#e87315] transition-colors">
                            {stat.label}
                        </p>
                        <div className="text-white/40 group-hover:text-[#e87315] transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                            <stat.icon size={16} strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4 relative z-10">
                        {loading ? (
                            <div className="w-16 h-10 bg-white/10 animate-pulse border border-white/20" />
                        ) : (
                            <h3 className={`text-4xl sm:text-5xl font-light tracking-tighter tabular-nums group-hover:tracking-normal transition-all duration-500 origin-left
                                ${stat.id === 2 && pendingCount > 0 ? 'text-[#e87315]' : 'text-white'}`}>
                                {typeof stat.value === 'number'
                                    ? stat.value.toString().padStart(2, '0')
                                    : stat.value}
                            </h3>
                        )}

                        {/* Middle visual separator */}
                        <div className="h-[2px] w-4 bg-white/10 group-hover:bg-[#e87315]/60 transition-all" />

                        <div className="flex flex-col">
                            <p className="text-white/50 text-[10px] sm:text-[11px] font-medium tracking-wide uppercase group-hover:text-white/80 transition-colors">
                                {stat.secondary}
                            </p>
                        </div>
                    </div>

                    {/* Bottom right corner accent */}
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/20 group-hover:bg-[#e87315]/40 transition-all" />
                    
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e87315]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            ))}
        </div>
    );
};

export default MentorStats;