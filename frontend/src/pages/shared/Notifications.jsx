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
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-[#e87315] transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* ── Main Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-[#e87315] animate-pulse" />
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">Notifications</h1>
            </div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              {unreadCount > 0 ? `Unread Events: ${unreadCount.toString().padStart(2, '0')}` : 'All caught up'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-6 py-2.5 bg-transparent border border-white/10 hover:border-[#e87315] text-[9px] font-black text-white hover:text-[#e87315] uppercase tracking-[0.2em] transition-all relative overflow-hidden group"
            >
              <Check size={12} /> Mark all read?
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#e87315] translate-x-full group-hover:translate-x-0 transition-transform" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white/[0.02] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* ── Left Column: Activity Log ── */}
            <div className="lg:col-span-7 space-y-10">
              {notifications.length > 0 ? (
                <div>
                  <div className="flex items-center gap-4 mb-6 text-white/20">
                    <span className="text-[10px] font-black uppercase tracking-widest">All Notifications</span>
                    <div className="flex-1 h-[1px] bg-white/5" />
                  </div>
                  
                  <div className="space-y-[1px] bg-white/5 border border-white/5">
                    {notifications.map(notif => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          if (!notif.read) handleMarkAsRead(notif._id);
                          if (notif.project) navigate(`/dashboard/project/${notif.project._id}`);
                        }}
                        className={`group bg-[#080808] p-6 transition-all cursor-pointer relative overflow-hidden flex gap-5 ${
                          !notif.read ? 'border-l-2 border-[#e87315]' : 'border-l-2 border-transparent'
                        }`}
                      >
                        <img
                          src={notif.sender?.profileImage}
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${encodeURIComponent(notif.sender?.name || 'U')}&bold=true`; }}
                          className="w-12 h-12 border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0"
                          alt={notif.sender?.name}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[11px] font-black text-[#e87315] uppercase tracking-wider">
                              {notif.sender?.name}
                            </span>
                            <span className="text-[8px] font-bold text-white/20 uppercase">
                              [{new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}]
                            </span>
                          </div>
                          
                          <p className={`text-xs leading-relaxed tracking-wide mb-2 ${notif.read ? 'text-white/40' : 'text-white'}`}>
                            {notif.message}
                          </p>

                          {notif.comment?.content && (
                            <div className="pl-3 border-l border-white/10 my-3">
                              <p className="text-[11px] text-white/30 italic line-clamp-2">"{notif.comment.content}"</p>
                            </div>
                          )}

                          {notif.project?.title && (
                            <div className="inline-block px-2 py-0.5 border border-[#e87315]/20 bg-[#e87315]/5 text-[8px] font-black text-[#e87315] uppercase tracking-[0.2em]">
                              {notif.project.title}
                            </div>
                          )}
                        </div>

                        {/* Actions on Hover */}
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(notif._id); }}
                            className="p-2 border border-white/5 hover:border-red-500/50 text-white/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 border border-dashed border-white/5 flex flex-col items-center opacity-20">
                    <Bell size={32} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Activity Detected</p>
                </div>
              )}
            </div>

            {/* ── Right Column: Inbound Requests ── */}
            <div className="lg:col-span-5">
               <div className="sticky top-8 space-y-8">
                  {requests.length > 0 && (
                    <div className="border border-white/10 bg-white/[0.02] p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <ShieldAlert size={16} className="text-[#e87315]" />
                        <h2 className="text-xs font-black uppercase tracking-[0.3em]">Pending Access</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {requests.map(req => (
                          <div key={req._id} className="group">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="relative">
                                <img
                                  src={req.from?.profileImage}
                                  className="w-14 h-14 border border-white/10 grayscale group-hover:grayscale-0 transition-all"
                                  alt={req.from?.name}
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#e87315] border-2 border-[#050505]" />
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <p className="text-xs font-black uppercase tracking-wider truncate">{req.from?.name}</p>
                                <p className="text-[9px] font-bold text-[#e87315] uppercase tracking-widest mt-1 italic">
                                  // {req.type === 'mentor-request' ? 'Mentorship_Inquiry' : 'Connection_Link'}
                                </p>
                              </div>
                            </div>

                            {req.message && (
                              <div className="bg-[#050505] p-3 border-l border-[#e87315]/40 mb-4">
                                <p className="text-[10px] text-white/50 leading-relaxed italic">"{req.message}"</p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleRequestAction(req._id, 'accepted')}
                                className="py-2.5 bg-[#e87315] text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
                              >
                                Authorize
                              </button>
                              <button
                                onClick={() => handleRequestAction(req._id, 'rejected')}
                                className="py-2.5 bg-transparent border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] hover:border-red-500/50 hover:text-red-500 transition-all"
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
                     <div className="p-8 border border-white/5 text-center">
                        <Check size={20} className="mx-auto mb-4 text-[#e87315]/40" />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">All Notification Processed</p>
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