import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { messageAPI } from '../../services/api';

const RecentMessages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const [convsRes, unreadRes] = await Promise.all([
          messageAPI.getConversations(),
          messageAPI.getUnreadCount()
        ]);
        setConversations((convsRes.data || []).slice(0, 2));
        setUnreadCount(unreadRes.data.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="card-structured p-4 sm:p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-10 group/header">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* ── Technical Icon Node ── */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-transparent border border-white/10 flex items-center justify-center transition-all duration-500 group-hover/header:border-[#e87315]/40 group-hover/header:bg-[#e87315]/[0.02]">
              <MessageCircle
                size={22}
                className="text-white/20 group-hover/header:text-[#e87315] transition-colors"
                strokeWidth={1.5}
              />
            </div>

            {/* Architect Signature Ticks */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#e87315]" />

            {/* Pulse indicator for unread messages */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e87315] opacity-20"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#e87315] m-auto"></span>
              </div>
            )}
          </div>

          {/* ── Header Text ── */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter italic">
                Recent messages
              </h2>
              <div className="hidden sm:block h-[1px] w-8 bg-white/5 group-hover/header:w-12 group-hover/header:bg-[#e87315]/30 transition-all duration-700" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[8px] sm:text-[9px] font-black text-[#e87315] uppercase tracking-[0.3em] opacity-50">
                Status:
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest tabular-nums">
                {loading ? 'SCANNING...' : `${unreadCount.toString().padStart(2, '0')} Unread messages`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Architectural Action ── */}
        <button
          onClick={() => navigate('/dashboard/messages')}
          className="relative group/btn shrink-0"
        >
          <div className="px-3 py-2 sm:px-5 sm:py-2.5 border border-white/10 bg-transparent group-hover/btn:border-[#e87315]/40 group-hover/btn:bg-[#e87315]/[0.02] transition-all duration-500">
            <span className="text-[8px] sm:text-[10px] font-black text-white/40 group-hover/btn:text-white uppercase tracking-[0.3em]">
              View All
            </span>
          </div>
          {/* Corner Accent for Button */}
          <div className="absolute top-0 right-0 w-1 h-1 bg-white/10 group-hover/btn:bg-[#e87315] transition-colors" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 sm:pr-3 custom-scrollbar">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-[#080808] border border-white/5 animate-pulse relative" />
            ))}
          </div>
        ) : conversations.length > 0 ? conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => navigate('/dashboard/messages')}
            className={`group relative bg-[#080808] p-4 sm:p-5 border transition-all duration-500 cursor-pointer overflow-hidden ${conv.unreadCount > 0 ? 'border-white/10' : 'border-white/[0.03]'
              } hover:border-[#e87315]/30`}
          >
            {/* ── Connection Status Bar ── */}
            <div className={`absolute left-0 top-0 w-[2px] h-full transition-all duration-700 ${conv.unreadCount > 0 ? 'bg-[#e87315] opacity-100' : 'bg-white/5 group-hover:bg-[#e87315]/40'
              }`} />

            <div className="flex items-start gap-3 sm:gap-5 relative z-10">
              {/* ── Avatar Node ── */}
              <div className="relative flex-shrink-0">
                <img
                  src={conv.user?.profileImage}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?background=080808&color=e87315&size=100&name=${conv.user?.name}&bold=true`;
                  }}
                  alt={conv.user?.name}
                  className={`w-10 h-10 sm:w-12 sm:h-12 object-cover border border-white/10 transition-all duration-500 ${conv.unreadCount > 0 ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                    }`}
                />
                {/* Architect Corner Ticks */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                {conv.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#e87315] shadow-[0_0_10px_#e87315] animate-pulse" />
                )}
              </div>

              {/* ── Stream Content ── */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <h3 className={`text-[11px] sm:text-[13px] font-black uppercase tracking-tight transition-colors truncate pr-2 ${conv.unreadCount > 0 ? 'text-white' : 'text-white/40 group-hover:text-white'
                    }`}>
                    {conv.user?.name?.replace(/\s+/g, '_')}
                  </h3>

                  <div className="flex items-center gap-1.5 sm:gap-2 opacity-30 group-hover:opacity-60 transition-opacity shrink-0">
                    <Clock size={10} />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] tabular-nums">
                      {new Date(conv.lastMessage?.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center gap-2">
                  {conv.unreadCount > 0 && (
                    <span className="text-[7px] sm:text-[8px] font-black text-[#e87315] uppercase tracking-widest shrink-0 hidden sm:inline-block">
                      [New message]
                    </span>
                  )}
                  <p className={`text-[10px] sm:text-[11px] leading-relaxed truncate ${conv.unreadCount > 0 ? 'text-white/70 font-bold' : 'text-white/20 group-hover:text-white/50'
                    }`}>
                    {conv.lastMessage?.content || 'No_Signal_Detected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Background Ref Decal */}
          </div>
        )) : (
          /* ── Empty State ── */
          <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 border border-dashed border-white/5 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent border border-white/5 flex items-center justify-center mb-4 sm:mb-5 group-hover:border-[#e87315]/20 transition-colors">
              <MessageCircle size={20} className="text-white/10 group-hover:text-[#e87315] transition-colors" />
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/10" />
            </div>
            <h3 className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-[0.5em] mb-2 italic text-center">
              No messages
            </h3>
            <p className="text-[8px] sm:text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] text-center max-w-[180px]">
              No Messages found.
            </p>
          </div>
        )}
      </div>

      {/* Compose Button */}
      <button
        onClick={() => navigate('/dashboard/messages')}
        className="relative w-full mt-3 sm:mt-4 group/compose overflow-hidden"
      >
        {/* ── Background Fill Animation ── */}
        <div className="absolute inset-0 bg-[#e87315] translate-y-[102%] group-hover/compose:translate-y-0 transition-transform duration-300 ease-out" />

        {/* ── Button Frame ── */}
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 border border-[#e87315] transition-colors duration-300 group-hover/compose:text-black text-[#e87315]">

          {/* Architect Corner Ticks (Left) */}
          <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315] group-hover/compose:bg-black transition-colors" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#e87315] group-hover/compose:bg-black transition-colors" />

          <div className="flex items-center">
            <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em]">
              New Message
            </span>
          </div>

          <Send
            size={16}
            strokeWidth={1.5}
            className="transition-transform duration-500 group-hover/compose:translate-x-1 group-hover/compose:-translate-y-1"
          />

          {/* Architect Corner Ticks (Right) */}
          <div className="absolute top-0 right-0 w-1 h-1 bg-[#e87315] group-hover/compose:bg-black transition-colors" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#e87315] group-hover/compose:bg-black transition-colors" />
        </div>

        {/* Bottom Decorative Scan Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 group-hover/compose:bg-black/20" />
      </button>
    </div>
  );
};

export default RecentMessages;