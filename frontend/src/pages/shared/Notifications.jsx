import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI, connectionAPI } from '../../services/api';
import { ArrowLeft, Bell, Check, Trash2, ShieldAlert } from 'lucide-react';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [notifsRes, requestsRes] = await Promise.all([
                    notificationAPI.getAll(),
                    connectionAPI.getReceived()
                ]);
                setNotifications(notifsRes.data || []);
                setRequests(requestsRes.data || []);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationAPI.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const handleRequestAction = async (id, status) => {
        try {
            await connectionAPI.updateStatus(id, status);
            setRequests(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error('Failed to update request:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="w-full min-h-screen bg-[#050505] text-white px-4 md:px-8 pb-16 font-sans selection:bg-[#e87315] selection:text-black">

            {/* ── Top Navigation ── */}
            <div className="max-w-5xl mx-auto py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 text-[11px] sm:text-[12px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-[#e87315] transition-all"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Dashboard
                </button>
            </div>

            <div className="max-w-5xl mx-auto">
                {/* ── Main Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 border-b border-white/10 pb-8 gap-6">
                    <div>
                        <div className="flex items-center gap-3 sm:gap-4 mb-2.5">
                            <div className="w-2.5 h-2.5 bg-[#e87315] animate-pulse" />
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic text-white/90">Notifications</h1>
                        </div>
                        <p className="text-white/60 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] ml-5 sm:ml-6">
                            {unreadCount > 0 ? `Unread Events: ${unreadCount.toString().padStart(2, '0')}` : 'All caught up'}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent border border-white/20 hover:border-[#e87315] text-[10px] sm:text-[11px] font-black text-white/80 hover:text-[#e87315] uppercase tracking-[0.2em] transition-all relative overflow-hidden group shrink-0"
                        >
                            <Check size={14} className="sm:w-4 sm:h-4" /> Mark all read?
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e87315] translate-x-full group-hover:translate-x-0 transition-transform" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-white/[0.05] border border-white/10 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">

                        {/* ── Left Column: Activity Log ── */}
                        <div className="lg:col-span-7 space-y-8 sm:space-y-10">
                            {notifications.length > 0 ? (
                                <div>
                                    <div className="flex items-center gap-4 mb-6 sm:mb-8 text-white/50">
                                        <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest">All Notifications</span>
                                        <div className="flex-1 h-[1px] bg-white/10" />
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        {notifications.map(notif => (
                                            <div
                                                key={notif._id}
                                                onClick={() => {
                                                    if (!notif.read) handleMarkAsRead(notif._id);
                                                    if (notif.project) navigate(`/dashboard/project/${notif.project._id}`);
                                                }}
                                                className={`group bg-[#0c0c0c] border p-6 sm:p-7 transition-all cursor-pointer relative overflow-hidden flex gap-5 sm:gap-6 hover:border-[#e87315]/40 ${!notif.read ? 'border-white/20' : 'border-white/10'
                                                    }`}
                                            >
                                                {/* Left Status Bar */}
                                                <div className={`absolute left-0 top-0 w-[3px] h-full transition-colors ${!notif.read ? 'bg-[#e87315]' : 'bg-transparent group-hover:bg-[#e87315]/40'}`} />

                                                <img
                                                    src={notif.sender?.profileImage}
                                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${encodeURIComponent(notif.sender?.name || 'U')}&bold=true`; }}
                                                    className={`w-12 h-12 sm:w-14 sm:h-14 border transition-all duration-500 flex-shrink-0 object-cover ${!notif.read ? 'border-[#e87315]/50 grayscale-0 opacity-100' : 'border-white/20 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}
                                                    alt={notif.sender?.name}
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[12px] sm:text-[13px] font-black text-[#e87315] uppercase tracking-wider truncate pr-2">
                                                            {notif.sender?.name}
                                                        </span>
                                                        <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase shrink-0">
                                                            [{new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}]
                                                        </span>
                                                    </div>

                                                    <p className={`text-[12px] sm:text-[13px] leading-relaxed tracking-wide mb-3 ${notif.read ? 'text-white/60 font-medium' : 'text-white/90 font-bold'}`}>
                                                        {notif.message}
                                                    </p>

                                                    {notif.comment?.content && (
                                                        <div className="pl-4 border-l-2 border-white/20 my-3 sm:my-4">
                                                            <p className="text-[11px] sm:text-[12px] text-white/60 italic line-clamp-2">"{notif.comment.content}"</p>
                                                        </div>
                                                    )}

                                                    {notif.project?.title && (
                                                        <div className="inline-block px-3 py-1 border border-[#e87315]/30 bg-[#e87315]/5 text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase tracking-[0.2em] mt-1">
                                                            {notif.project.title}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions on Hover */}
                                                <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(notif._id); }}
                                                        className="p-2 sm:p-2.5 border border-white/10 hover:border-red-500/50 text-white/40 hover:text-red-500 transition-all bg-black/50 hover:bg-transparent"
                                                    >
                                                        <Trash2 size={16} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-24 border border-dashed border-white/10 flex flex-col items-center bg-[#0c0c0c] opacity-60">
                                    <Bell size={32} className="mb-4 sm:mb-5 sm:w-10 sm:h-10 text-white/40" />
                                    <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.5em] text-white/80">No Activity Detected</p>
                                </div>
                            )}
                        </div>

                        {/* ── Right Column: Inbound Requests ── */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-8 space-y-8">
                                {requests.length > 0 && (
                                    <div className="border border-white/20 bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl">
                                        <div className="flex items-center gap-3 sm:gap-4 mb-8">
                                            <ShieldAlert size={20} className="text-[#e87315] sm:w-6 sm:h-6" />
                                            <h2 className="text-[13px] sm:text-[14px] font-black uppercase tracking-[0.3em] text-white/90">Pending Access</h2>
                                        </div>

                                        <div className="space-y-8">
                                            {requests.map(req => (
                                                <div key={req._id} className="group border-b border-white/10 pb-8 last:border-0 last:pb-0">
                                                    <div className="flex items-start gap-4 sm:gap-5 mb-5">
                                                        <div className="relative shrink-0">
                                                            <img
                                                                src={req.from?.profileImage}
                                                                className="w-14 h-14 sm:w-16 sm:h-16 border border-white/20 opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all object-cover"
                                                                alt={req.from?.name}
                                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${encodeURIComponent(req.from?.name || 'U')}&bold=true`; }}
                                                            />
                                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#e87315] border-2 border-[#0c0c0c]" />
                                                        </div>
                                                        <div className="flex-1 min-w-0 pt-1">
                                                            <p className="text-[13px] sm:text-[14px] font-black uppercase tracking-wider truncate text-white/90">{req.from?.name}</p>
                                                            <p className="text-[10px] sm:text-[11px] font-bold text-[#e87315]/80 uppercase tracking-widest mt-1.5 italic">
                                                                // {req.type === 'mentor-request' ? 'Mentorship_Inquiry' : 'Connection_Link'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {req.message && (
                                                        <div className="bg-white/[0.02] p-4 sm:p-5 border-l-2 border-[#e87315]/50 mb-5 sm:mb-6">
                                                            <p className="text-[11px] sm:text-[12px] text-white/70 leading-relaxed italic">"{req.message}"</p>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                        <button
                                                            onClick={() => handleRequestAction(req._id, 'accepted')}
                                                            className="py-3 sm:py-3.5 bg-[#e87315] text-black text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg"
                                                        >
                                                            Authorize
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(req._id, 'rejected')}
                                                            className="py-3 sm:py-3.5 bg-transparent border border-white/20 text-white/60 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:border-red-500/50 hover:text-red-500 transition-all"
                                                        >
                                                            Ignore
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Catch up State (When nothing in right col) ── */}
                                {requests.length === 0 && (
                                    <div className="p-8 sm:p-10 border border-white/10 text-center bg-[#0c0c0c]">
                                        <Check size={24} className="mx-auto mb-4 sm:mb-5 text-[#e87315]/60 sm:w-7 sm:h-7" />
                                        <p className="text-[10px] sm:text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">All Notifications Processed</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;