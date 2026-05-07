import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI, connectionAPI, messageAPI } from '../services/api';

import {
  Menu, X, Bell, User, Search, MessageCircle,
  LayoutDashboard, Users, Calendar, BarChart3, SquareArrowRightEnter
} from 'lucide-react';
import useLenis from '../hooks/useLenis';

const MentorLayout = ({ children, setActiveTab, activeTab }) => {
  const scrollRef = useRef(null);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({ notifs: [], requests: [] });
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef(null);
  const [requests, setRequests] = useState([]);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [connectionSearch, setConnectionSearch] = useState('');
  const [connectionFilter, setConnectionFilter] = useState('All');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [networkTab, setNetworkTab] = useState('accepted');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotifLoading(true);

        const [notifsRes, requestsRes] = await Promise.all([
          notificationAPI.getAll(),
          connectionAPI.getReceived()
        ]);

        const notifs = notifsRes.data || [];
        const requests = requestsRes.data || [];

        setNotifications({ notifs, requests });
        setUnreadCount(notifs.filter(n => !n.read).length + requests.length);

      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setNotifLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleRequestAction = async (connectionId, status) => {
    try {
      await connectionAPI.updateStatus(connectionId, status);
      const req = notifications.requests.find(r => r._id === connectionId); // ← grab the request first
      setNotifications(prev => ({
        ...prev,
        requests: prev.requests.filter(r => r._id !== connectionId)
      }));
      setUnreadCount(prev => Math.max(prev - 1, 0));
      window.dispatchEvent(new CustomEvent('connection_actioned', {
        detail: {
          id: connectionId,
          status,                   // 'accepted' or 'rejected'
          role: req?.from?.role     // e.g. 'Student'
        }
      }));
    } catch (err) {
      console.error('Failed to update connection:', err);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      setNotifications(prev => ({
        ...prev,
        requests: prev.requests.filter(r => r._id !== e.detail.id)
      }));
      setPendingConnections(prev => prev.filter(c => c._id !== e.detail.id));
      setUnreadCount(prev => Math.max(prev - 1, 0));
    };
    window.addEventListener('connection_actioned', handler);
    return () => window.removeEventListener('connection_actioned', handler);
  }, []);

  const handleMarkAsRead = async (notifId) => {
    try {
      await notificationAPI.markAsRead(notifId);
      setNotifications(prev => ({
        ...prev,
        notifs: prev.notifs.map(n => n._id === notifId ? { ...n, read: true } : n)
      }));
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };


  const fetchConnections = async () => {
    try {
      setConnectionsLoading(true);

      const [networkRes, pendingRes] = await Promise.all([
        connectionAPI.getNetwork(),
        connectionAPI.getReceived()          // ← add this
      ]);

      setConnections(networkRes.data);
      setPendingConnections(pendingRes.data || []);  // ← populate pending tab

    } catch (err) {
      console.error('Failed to fetch connections:', err);
    } finally {
      setConnectionsLoading(false);
    }
  };

  useEffect(() => {
    const handler = () => { setConnectionsOpen(true); fetchConnections(); };
    window.addEventListener('openConnections', handler);
    return () => window.removeEventListener('openConnections', handler);
  }, []);

  useEffect(() => {
    const handler = () => setUnreadMessages(0);
    window.addEventListener('clearUnreadMessages', handler);
    return () => window.removeEventListener('clearUnreadMessages', handler);
  }, []);

  useEffect(() => {
    const onMessage = () => setUnreadMessages(prev => prev + 1);

    const onNotification = (e) => {
      const notification = e.detail;
      setUnreadCount(prev => prev + 1);
      setNotifications(prev => ({
        ...prev,
        notifs: [notification, ...(prev.notifs || [])].slice(0, 3)
      }));
    };

    const onConnectionRequest = (e) => {
      const request = e.detail;
      setUnreadCount(prev => prev + 1);
      setNotifications(prev => ({
        ...prev,
        requests: [request, ...(prev.requests || [])]
      }));
      setPendingConnections(prev => {
        if (prev.find(c => c._id === request._id)) return prev;
        return [request, ...prev];
      });
    };

    window.addEventListener('message_received', onMessage);
    window.addEventListener('notification_received', onNotification);
    window.addEventListener('connection_request_received', onConnectionRequest);

    return () => {
      window.removeEventListener('message_received', onMessage);
      window.removeEventListener('notification_received', onNotification);
      window.removeEventListener('connection_request_received', onConnectionRequest);
    };
  }, []);

  useLenis(scrollRef);

  useEffect(() => {
    if (connectionsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [connectionsOpen]);

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', path: '/dashboard/explore', icon: Users },
    { name: 'Mentorship hub', path: '/dashboard/MentorHub', icon: Calendar },
    { name: 'Inbox', path: '/dashboard/messages', icon: MessageCircle, unread: true },
    { name: 'Meeting Room', path: '/dashboard/Meeting-room', icon: SquareArrowRightEnter },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080808] font-sans">

      {/* Lighting Halo/Glow */}
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] bg-[#e87315]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-48 -right-48 w-[500px] h-[500px] bg-[#e87315]/[0.01] rounded-full blur-[100px] pointer-events-none" />

      {/* Premium Top Navigation - Identical to Student */}
      <nav className="sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          {/* Left: Brand */}
          <div className="flex items-center gap-2.5">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-[#e87315] to-[#f4f1ea] rounded-xl flex items-center justify-center shadow-lg shadow-[#e87315]/[0.1]">
              <span className="font-black text-[#080808] text-xl leading-none">E</span>
            </div> */}
            <div className='w-8 h-8 md:w-9 md:h-9 rounded-xl flex'>
              <img className=' w-19' src='/Evolve.png' alt="evolve-logo" />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">
              Evolve<span className="text-[#e87315]">.</span>
            </span>
          </div>

          {/* Center: Desktop Navigation Pills */}
          <div className="hidden md:flex items-center gap-1 bg-[#080808] p-1 border border-white/5 relative overflow-hidden">
            {/* ── Background Subtle Grid Pattern ── */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {navItems.map((item) => {
              // Logic remains same as your requirement
              const isActive = location.pathname === item.path || (item.name === 'Dashboard' && location.pathname === '/dashboard');

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-5 py-3 transition-all duration-500 group ${isActive
                    ? 'bg-white text-black shadow-[4px_4px_0px_rgba(232,115,21,1)]'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                    }`}
                >
                  {/* ── Active Bracket Detail ── */}
                  {isActive && (
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-black/30" />
                  )}

                  <item.icon
                    size={14}
                    className={`transition-colors duration-500 ${isActive ? 'text-black' : 'text-[#e87315]/50 group-hover:text-[#e87315]'}`}
                    strokeWidth={isActive ? 3 : 2}
                  />

                  <span className="text-[10px] font-black tracking-[0.25em] uppercase italic transition-all">
                    {item.name}
                  </span>

                  {/* ── Notification Node (Square/Diamond for Inbox) ── */}
                  {item.name === 'Inbox' && unreadMessages > 0 && (
                    <span className={`ml-1 w-1.5 h-1.5 rounded-none rotate-45 animate-pulse ${isActive ? 'bg-black' : 'bg-[#e87315]'}`} />
                  )}

                  {/* ── Hover Underscore ── */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#e87315] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setConnectionsOpen(true); fetchConnections(); }}
                className="group relative p-3 bg-transparent transition-all duration-300"
              >
                {/* ── Outer Frame ── */}
                <div className="absolute inset-0 border border-white/5 group-hover:border-[#e87315]/50 transition-colors" />

                {/* ── Tactical Corner Cutout (Top Right) ── */}
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#080808] border-b border-l border-white/10 group-hover:border-[#e87315]/50 transition-colors" />

                {/* ── Active "Signal" Bar (Left) ── */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#e87315] group-hover:h-3/5 transition-all duration-500" />

                {/* ── The Icon ── */}
                <div className="relative z-10 flex items-center justify-center">
                  <Users
                    size={18}
                    strokeWidth={2}
                    className="text-white/20 group-hover:text-white transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                {/* ── Technical Scan Line (Hover) ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#e87315]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="group relative p-3 bg-transparent transition-all duration-300"
                >
                  {/* ── Geometric Outer Frame ── */}
                  <div className="absolute inset-0 border border-white/5 group-hover:border-[#e87315]/30 transition-colors" />

                  {/* ── Top-Left Bracket Detail ── */}
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-[#e87315] transition-colors" />

                  {/* ── Status Icon ── */}
                  <div className="relative z-10">
                    <Bell
                      size={18}
                      strokeWidth={2}
                      className="text-white/20 group-hover:text-white group-hover:rotate-[15deg] transition-all duration-500"
                    />
                  </div>

                  {/* ── High-Alert Notification Indicator ── */}
                  {unreadCount > 0 && (
                    <div className="absolute -top-[1px] -right-[1px] flex items-center justify-center">
                      {/* Outer Pulse Ring */}
                      <span className="absolute w-3 h-3 bg-[#e87315]/40 animate-ping rounded-none" />
                      {/* Solid Technical Square */}
                      <span className="relative w-2 h-2 bg-[#e87315] shadow-[0_0_8px_rgba(232,115,21,0.6)]" />
                    </div>
                  )}

                  {/* ── Technical Sub-label (Hover Only) ── */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#e87315] group-hover:w-full transition-all duration-500" />
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-14 w-80 bg-[#101010] border border-white/[0.06] rounded-2xl shadow-2xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
                      <div className="flex items-center gap-3">
                        {/* ── Geometric Status Light ── */}
                        <div className={`w-1.5 h-1.5 rotate-45 ${unreadCount > 0 ? 'bg-[#e87315] shadow-[0_0_8px_#e87315]' : 'bg-white/10'}`} />

                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">
                          Notification
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-white text-black text-[9px] font-black tracking-tighter">
                            {unreadCount.toString().padStart(2, '0')}
                          </span>
                        )}

                        {notifications.notifs?.some(n => !n.read) && (
                          <button
                            onClick={async () => {
                              await notificationAPI.markAllAsRead();
                              setNotifications(prev => ({
                                ...prev,
                                notifs: prev.notifs.map(n => ({ ...n, read: true }))
                              }));
                              setUnreadCount(notifications.requests?.length || 0);
                            }}
                            className="group relative flex items-center gap-2 text-[9px] font-black text-white/30 hover:text-[#e87315] transition-all uppercase tracking-[0.15em]"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            Mark All Read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto scrollbar-hide bg-[#080808]">
                      {notifLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <div className="relative w-8 h-8">
                            <div className="absolute inset-0 border-2 border-[#e87315]/10" />
                            <div className="absolute inset-0 border-2 border-[#e87315] border-t-transparent animate-spin" />
                          </div>
                          <span className="text-[9px] font-black text-[#e87315] uppercase tracking-[0.3em] animate-pulse">Syncing_Nodes</span>
                        </div>
                      ) : (
                        <>
                          {/* ── Connection Requests Section ── */}
                          {notifications.requests?.map((req) => (
                            <div key={req._id} className="group px-6 py-5 border-b border-white/5 hover:bg-white/[0.01] transition-all relative">
                              <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-500" />

                              <div className="flex items-start gap-4">
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={req.from?.profileImage}
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${req.from?.name}&bold=true`; }}
                                    className="w-10 h-10 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
                                    alt={req.from?.name}
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#e87315] border border-[#080808]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-black text-white uppercase tracking-wider">{req.from?.name}</p>
                                    <span className="text-[8px] font-bold text-[#e87315]/40 uppercase tracking-tighter italic">Pending_Action</span>
                                  </div>
                                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest leading-none">
                                    {req.type === 'mentor-request' ? '// mentorship inquiry' : '// connection request'}
                                  </p>

                                  <div className="flex gap-2 mt-4">
                                    <button
                                      onClick={() => handleRequestAction(req._id, 'accepted')}
                                      className="flex-1 py-2 bg-[#e87315] hover:bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleRequestAction(req._id, 'rejected')}
                                      className="flex-1 py-2 bg-transparent border border-white/10 hover:border-red-500/50 text-white/20 hover:text-red-500 text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* ── Standard Notifications Section ── */}
                          {notifications.notifs?.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                handleMarkAsRead(notif._id);
                                if (notif.project) navigate(`/dashboard/project/${notif.project._id}`);
                              }}
                              className={`px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group relative ${!notif.read ? 'bg-white/[0.01]' : ''}`}
                            >
                              {/* Unread Indicator Bar */}
                              {!notif.read && <div className="absolute left-0 top-0 w-[2px] h-full bg-[#e87315]" />}

                              <div className="flex items-start gap-4">
                                <img
                                  src={notif.sender?.profileImage}
                                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${notif.sender?.name}&bold=true`; }}
                                  className={`w-9 h-9 object-cover border ${notif.read ? 'border-white/5 opacity-40' : 'border-white/20'} grayscale group-hover:grayscale-0 transition-all`}
                                  alt={notif.sender?.name}
                                />

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className="text-[10px] text-white/80 leading-snug tracking-wide">
                                      <span className="font-black text-[#e87315] uppercase tracking-widest">{notif.sender?.name}</span>
                                      <span className="mx-2 opacity-30">|</span>
                                      <span className={notif.read ? 'text-white/40' : 'text-white'}>{notif.message}</span>
                                    </p>
                                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap pt-0.5">
                                      [{new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}]
                                    </p>
                                  </div>

                                  {notif.comment?.content && (
                                    <div className="mt-2 pl-3 border-l-2 border-white/5 group-hover:border-[#e87315]/20 transition-colors">
                                      <p className="text-[10px] text-white/30 italic line-clamp-1 italic">
                                        "{notif.comment.content}"
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* ── Null Result State ── */}
                          {!notifications.requests?.length && !notifications.notifs?.length && (
                            <div className="flex flex-col items-center justify-center py-20 px-8 text-center opacity-20">
                              <div className="w-10 h-10 border border-white/20 flex items-center justify-center rotate-45 mb-6">
                                <Bell size={16} className="-rotate-45 text-amber-700" />
                              </div>
                              <p className="text-[10px] text-white font-black uppercase tracking-[0.4em]">No notifications</p>
                              <p className="text-[8px] text-white uppercase tracking-widest mt-2">No active data streams detected</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div
                      onClick={() => {
                        setNotifOpen(false);
                        navigate('/dashboard/notifications');
                      }}
                      className="relative px-6 py-3 border-t border-white/10 cursor-pointer overflow-hidden group bg-transparent transition-all duration-500 hover:bg-[#e87315]/[0.02]"
                    >
                      {/* Left status indicator that grows on hover */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-2 bg-[#e87315]/40 group-hover:h-full transition-all duration-500" />

                      <div className="flex items-center justify-center gap-3">
                        {/* Decorative technical brackets */}
                        <span className="text-white/10 group-hover:text-[#e87315]/40 transition-colors duration-500 font-light">[</span>

                        <p className="text-[9px] font-black text-white/40 group-hover:text-[#e87315] uppercase tracking-[0.4em] transition-colors duration-500">
                          View all notifications
                        </p>

                        <span className="text-white/10 group-hover:text-[#e87315]/40 transition-colors duration-500 font-light">]</span>
                      </div>

                      {/* Bottom scan-line effect on hover */}
                      <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#e87315]/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-8 w-px bg-white/[0.04] mx-1"></div>

            {/* Profile Pill */}
            <Link
              to="/dashboard/myprofile"
              className="flex items-center gap-4 p-1 bg-transparent group border-l border-white/5 hover:border-[#e87315] transition-all duration-500"
            >
              {/* ── Avatar Frame: Technical Node ── */}
              <div className="relative w-10 h-10 overflow-hidden border border-white/10 group-hover:border-[#e87315]/50 transition-colors duration-500">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(user.name || 'U')}&bold=true`;
                    }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt={user.name}
                  />
                ) : (
                  <div className="w-full h-full bg-[#080808] flex items-center justify-center">
                    <span className="text-[#e87315] font-black text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* ── Identity Data: Terminal Style ── */}
              <div className="text-left hidden lg:block pr-4">
                <div className="flex items-center gap-2">
                  {/* <span className="w-1 h-1 bg-[#e87315] hidden group-hover:block animate-pulse" /> */}
                  <p className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-[#e87315] transition-colors">
                    {user?.name || 'Authorized_User'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Role:</span>
                  <p className="text-[9px] font-black text-[#e87315]/60 group-hover:text-[#e87315] uppercase tracking-widest italic transition-colors">
                    {user?.role || 'Member'}
                  </p>
                </div>
              </div>

              {/* ── Visual "Tab" End Detail ── */}
              <div className="hidden lg:block w-[1px] h-4 bg-white/5 group-hover:bg-[#e87315]/20 transition-colors" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#080808] border-b border-white/5 overflow-hidden transition-all duration-500 ease-in-out z-50 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          {/* ── Background Subtle Grid Pattern ── */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />

          <div className="relative p-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.name === 'Dashboard' && location.pathname === '/dashboard');

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    setActiveNav(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`relative flex items-center gap-4 px-6 py-4 transition-all duration-300 group ${isActive
                    ? 'bg-white text-black translate-x-2'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                    }`}
                >
                  {/* ── Active Indicator Line ── */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-[#e87315]" />
                  )}

                  <item.icon
                    size={16}
                    className={`transition-colors duration-300 ${isActive ? 'text-black' : 'text-[#e87315]/40 group-hover:text-[#e87315]'
                      }`}
                    strokeWidth={isActive ? 3 : 2}
                  />

                  <span className="text-[11px] font-black tracking-[0.3em] uppercase italic">
                    {item.name}
                  </span>

                  {/* ── Notification Node for Mobile ── */}
                  {item.name === 'Inbox' && unreadMessages > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[9px] font-mono text-[#e87315] opacity-60">NEW_MSG</span>
                      <span className={`w-1.5 h-1.5 rotate-45 ${isActive ? 'bg-black' : 'bg-[#e87315] animate-pulse'}`} />
                    </div>
                  )}

                  {/* ── Decorative Corner (Active) ── */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/20" />
                  )}
                </Link>
              );
            })}

            {/* ── Bottom Decorative Bar ── */}
            <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto pt-8">
        {children}
      </main>

      {connectionsOpen && (
        <div
          className="fixed inset-0 bg-[#050505]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setConnectionsOpen(false)}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#080808] border border-white/10 w-full max-w-md max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden"
            onClick={e => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* ── Background Grid Texture ── */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 relative z-10">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Network</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1 h-1 bg-[#e87315]" />
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    {networkTab === 'accepted'
                      ? `${connections.length.toString().padStart(2, '0')} Active Connections`
                      : `${pendingConnections.length.toString().padStart(2, '0')} Pending Requests`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConnectionsOpen(false)}
                className="group relative p-2 border border-white/5 hover:border-[#e87315]/50 transition-colors"
              >
                <X size={14} className="text-white/40 group-hover:text-white transition-colors" />
                <div className="absolute top-0 right-0 w-1 h-1 bg-[#e87315]/40" />
              </button>
            </div>

            {/* ── Tab Switcher ── */}
            <div className="flex border-b border-white/5 relative z-10">
              {['accepted', 'pending'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setNetworkTab(tab)}
                  className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all relative ${networkTab === tab
                    ? 'text-[#e87315]'
                    : 'text-white/20 hover:text-white/40'
                    }`}
                >
                  {tab}
                  {tab === 'pending' && pendingConnections.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-[#e87315] text-black text-[8px] font-black">
                      {pendingConnections.length}
                    </span>
                  )}
                  {networkTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#e87315]" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Search + Filter ── */}
            <div className="px-8 py-5 border-b border-white/5 bg-white/[0.01] space-y-4 relative z-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={connectionSearch}
                  onChange={e => setConnectionSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-transparent border border-white/5 hover:border-white/10 focus:border-[#e87315]/40 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none transition-all placeholder:text-white/10"
                />
                <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10" />
              </div>

              <div className="flex flex-wrap gap-1">
                {['All', 'Student', 'Mentor', 'Investor'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setConnectionFilter(filter)}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${connectionFilter === filter
                      ? 'bg-[#e87315] text-black'
                      : 'bg-transparent text-white/30 hover:text-white border border-white/5'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Connections List ── */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 relative z-10 custom-scrollbar">
              {connectionsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-14 bg-white/[0.02] border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : networkTab === 'accepted' ? (
                connections.filter(c => {
                  const matchesSearch = connectionSearch === '' || c.name?.toLowerCase().includes(connectionSearch.toLowerCase());
                  const matchesFilter = connectionFilter === 'All' || c.role?.toLowerCase() === connectionFilter.toLowerCase();
                  return matchesSearch && matchesFilter;
                }).length > 0 ? (
                  connections.filter(c => {
                    const matchesSearch = connectionSearch === '' || c.name?.toLowerCase().includes(connectionSearch.toLowerCase());
                    const matchesFilter = connectionFilter === 'All' || c.role?.toLowerCase() === connectionFilter.toLowerCase();
                    return matchesSearch && matchesFilter;
                  }).map(connection => (
                    <div
                      key={connection._id}
                      onClick={() => {
                        navigate(connection.role?.toLowerCase() === 'mentor' ? `/dashboard/mentor/${connection._id}` : `/dashboard/user/${connection._id}`);
                        setConnectionsOpen(false);
                      }}
                      className="flex items-center gap-4 p-4 hover:bg-white/[0.02] cursor-pointer transition-all group border border-transparent hover:border-white/5 relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 w-[1px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-500" />
                      <img
                        src={connection.profileImage}
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${encodeURIComponent(connection.name || 'U')}&bold=true`; }}
                        className="w-11 h-11 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt={connection.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-white group-hover:text-[#e87315] transition-colors uppercase tracking-wider truncate">
                          {connection.name}
                        </p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest truncate italic mt-0.5">
                          {connection.role || 'Member'}
                        </p>
                      </div>
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 border border-white/5 text-white/20 group-hover:border-[#e87315]/30 group-hover:text-[#e87315] transition-all">
                        View
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center rotate-45 mb-6">
                      <Users size={16} className="-rotate-45" />
                    </div>
                    <p className="text-[10px] text-white font-black uppercase tracking-[0.4em]">No Connections</p>
                  </div>
                )
              ) : (
                /* ── Pending Tab ── */
                (() => {
                  const filtered = pendingConnections.filter(c => {
                    const matchesSearch = connectionSearch === '' ||
                      c.from?.name?.toLowerCase().includes(connectionSearch.toLowerCase());
                    const matchesFilter = connectionFilter === 'All' ||
                      c.from?.role?.toLowerCase() === connectionFilter.toLowerCase();
                    return matchesSearch && matchesFilter;
                  });

                  return filtered.length > 0 ? (
                    filtered.map(conn => (
                      <div
                        key={conn._id}
                        className="flex items-center gap-4 p-4 border border-transparent hover:border-white/5 relative overflow-hidden group"
                      >
                        <div className="absolute left-0 top-0 w-[1px] h-0 group-hover:h-full bg-[#e87315]/50 transition-all duration-500" />
                        <img
                          src={conn.from?.profileImage}
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${encodeURIComponent(conn.from?.name || 'U')}&bold=true`; }}
                          className="w-11 h-11 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
                          alt={conn.from?.name}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-white uppercase tracking-wider truncate">
                            {conn.from?.name}
                          </p>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest truncate italic mt-0.5">
                            {conn.from?.role || 'Member'}
                          </p>
                          <p className="text-[8px] font-bold text-[#e87315]/40 uppercase tracking-widest mt-0.5">
                            {conn.type === 'mentor-request' ? 'mentorship inquiry' : 'connection request'}
                          </p>
                        </div>

                        {/* ── Accept / Decline buttons ── */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await connectionAPI.updateStatus(conn._id, 'accepted');
                              setPendingConnections(prev => prev.filter(c => c._id !== conn._id));
                              window.dispatchEvent(new CustomEvent('connection_actioned', {
                                detail: { id: conn._id, status: 'accepted', role: conn.from?.role }
                              }));
                            }}
                            className="px-3 py-1 bg-[#e87315] text-black text-[8px] font-black uppercase tracking-widest transition-all hover:bg-white"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await connectionAPI.updateStatus(conn._id, 'rejected');
                              setPendingConnections(prev => prev.filter(c => c._id !== conn._id));
                              window.dispatchEvent(new CustomEvent('connection_actioned', {
                                detail: { id: conn._id, status: 'rejected', role: conn.from?.role }
                              }));
                            }}
                            className="px-3 py-1 border border-white/10 hover:border-red-500/50 text-white/20 hover:text-red-500 text-[8px] font-black uppercase tracking-widest transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                      <div className="w-10 h-10 border border-white/20 flex items-center justify-center rotate-45 mb-6">
                        <Users size={16} className="-rotate-45" />
                      </div>
                      <p className="text-[10px] text-white font-black uppercase tracking-[0.4em]">No Pending Requests</p>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorLayout;