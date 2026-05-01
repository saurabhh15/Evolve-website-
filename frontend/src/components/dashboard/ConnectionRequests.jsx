import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, XCircle, Briefcase, GraduationCap, MessageSquare } from 'lucide-react';
import { connectionAPI } from '../../services/api';

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Fetch connection requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await connectionAPI.getReceived();
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch connection requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle accept request
  const handleAccept = async (requestId) => {
    try {
      setProcessingId(requestId);
      await connectionAPI.updateStatus(requestId, 'accepted');
      // Remove from list after successful accept
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Failed to accept request:', error);
      alert('Failed to accept connection request');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      await connectionAPI.updateStatus(requestId, 'rejected');
      // Remove from list after successful reject
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('Failed to reject connection request');
    } finally {
      setProcessingId(null);
    }
  };

  // Get connection type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case 'mentor-request':
        return { label: 'Mentor Request', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'cofounder-request':
        return { label: 'Co-founder', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'investor-interest':
        return { label: 'Investor Interest', color: 'bg-[#e87315]/10 text-[#e87315] border-[#e87315]/20' };
      default:
        return { label: type, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="card-structured space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-white/[0.03] rounded-lg animate-pulse" />
          <div className="h-6 w-8 bg-white/[0.03] rounded-full animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-[#0A0A0A] border border-white/[0.04] rounded-2xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/[0.03] rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-white/[0.03] rounded animate-pulse" />
                <div className="h-4 w-48 bg-white/[0.03] rounded animate-pulse" />
                <div className="h-4 w-full bg-white/[0.03] rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="relative py-24 border border-dashed border-white/10 bg-transparent overflow-hidden group">
        {/* ── Background Technical ID ── */}


        <div className="relative z-10 flex flex-col items-center">
          {/* ── Icon Node (Geometric & Boxy) ── */}
          <div className="relative mb-10">
            <div className="w-16 h-16 bg-[#e87315]/[0.03] border border-[#e87315]/20 flex items-center justify-center transition-all duration-700 group-hover:bg-[#e87315]/[0.08]">
              <UserPlus size={28} className="text-[#e87315]/40 group-hover:text-[#e87315] group-hover:scale-110 transition-all duration-500" />
            </div>

            {/* Corner Ticks (The Architect Hallmark) */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#e87315]" />

            {/* Decorative scanning line animation */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#e87315]/20 animate-scan pointer-events-none" />
          </div>

          {/* ── Message Content ── */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-6 bg-white/5" />
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic">
                No pending Request
              </h3>
              <div className="h-[1px] w-6 bg-white/5" />
            </div>

            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
              System Status: <span className="text-[#e87315]/60 animate-pulse">No Incoming Request</span>
            </p>

            <p className="text-[11px] text-white/30 max-w-[280px] mx-auto mt-6 leading-relaxed font-medium tracking-wide">
              You're all caught up. Incoming connection requests will be logged in this registry node.
            </p>
          </div>
        </div>

        {/* ── Decorative Side Elements ── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-[2px] bg-white ${i % 3 === 0 ? 'w-6' : 'w-3'}`} />
          ))}
        </div>

        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-5 rotate-180">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-[2px] bg-white ${i % 2 === 0 ? 'w-5' : 'w-2'}`} />
          ))}
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="card-structured">
      {/* Header */}
      <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6 relative group">
        {/* ── Left Section: Title & Technical Meta ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {/* Decorative Status Bit */}
            <div className="w-1 h-5 bg-[#e87315] animate-pulse" />

            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              New Connection
            </h2>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
              Connect to new student/mentor
            </span>
          </div>
        </div>

        {/* ── Right Section: The Counter Block ── */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-[#e87315] uppercase tracking-widest opacity-50 mb-1.5">
              Active Requests
            </span>
            <div className="flex items-center gap-3">
              {/* Visual Separator */}
              <div className="h-[1px] w-8 bg-white/10 group-hover:w-12 group-hover:bg-[#e87315]/40 transition-all duration-700" />

              {/* The Count: Sharp & Technical */}
              <div className="relative">
                <div className="px-4 py-1 bg-transparent border border-white/10 text-xl font-light text-white tabular-nums tracking-tighter group-hover:border-[#e87315]/50 transition-colors">
                  {requests.length.toString().padStart(2, '0')}
                </div>
                {/* Corner Accent */}
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#e87315]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle progress line */}
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#e87315] to-transparent group-hover:w-full transition-all duration-1000 opacity-30" />
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => {
          const badge = getTypeBadge(request.type);
          const isProcessing = processingId === request._id;

          return (
            <div
              key={request._id}
              className="group relative p-6 bg-[#0A0A0A] border border-white/[0.04] hover:border-[#e87315]/[0.15] rounded-2xl transition-all duration-300"
            >
              {/* Type Badge */}
              <div className="absolute top-6 right-6 m-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* User Info */}
              <div className="flex items-start gap-8 mb-10 relative group p-6 border border-white/[0.03] bg-[#080808] hover:bg-[#080808]/80 transition-all">
                {/* ── Left Status Accent (Architect Signature) ── */}
                <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-500" />

                {/* ── Profile Image (Technical Frame) ── */}
                <div className="relative flex-shrink-0">
                  <img
                    src={request.from?.profileImage}
                    alt={request.from?.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.from?.name || 'User')}&background=080808&color=e87315&bold=true&size=128`;
                    }}
                    className="w-20 h-20 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10"
                  />
                  {/* Corner Ticks */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]/40" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#e87315]/40" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* ── Identity Header ── */}
                  <div className="flex flex-col mb-4">
                    {/* <span className="text-[8px] font-black text-[#e87315] uppercase tracking-[0.3em] opacity-50 mb-1"> </span> */}
                    <h3 className="text-2xl font-black text-white group-hover:text-[#e87315] transition-colors uppercase tracking-tighter truncate">
                      {request.from?.name || 'Anonymous_User'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-6 mt-2">
                      {request.from?.role && (
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-white/20" />
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{request.from.role}</span>
                        </div>
                      )}
                      {request.from?.college && (
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-white/20" />
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">{request.from.college}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Project Context (Segmented Block) ── */}
                  {request.projectId && (
                    <div className="mb-4 border-l-2 border-white/5 pl-4 py-1">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">
                        Attached Project
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-black text-white uppercase tracking-tight">
                          {request.projectId.title || 'Untitled_Project'}
                        </p>
                        <span className="text-[9px] font-bold text-[#e87315]/60 px-2 border border-[#e87315]/20 uppercase">
                          {request.projectId.category || 'General'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ── Transmission Message (The Log) ── */}
                  {request.message && (
                    <div className="relative mt-6 group/msg">
                      <div className="absolute left-0 top-0 w-[1px] h-full bg-white/10 group-hover/msg:bg-[#e87315]/30 transition-colors" />
                      <div className="pl-6">
                        <div className="flex items-center gap-2 mb-2 opacity-30">
                          <MessageSquare size={12} />
                        </div>
                        <p className="text-[13px] text-white/60 leading-relaxed font-medium italic">
                          "{request.message}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>


              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-6">
                {/* ── ACCEPT COMMAND ── */}
                <button
                  onClick={() => handleAccept(request._id)}
                  disabled={isProcessing}
                  className="relative flex-1 group/btn overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className={`
      flex items-center justify-center gap-3 px-6 py-4 
      bg-transparent border border-white/10 
      transition-all duration-500 relative z-10
      group-hover/btn:border-emerald-500/50 group-hover/btn:bg-emerald-500/[0.02]
    `}>
                    {isProcessing ? (
                      <div className="w-3 h-3 border border-emerald-500/30 border-t-emerald-500 animate-spin" />
                    ) : (
                      <CheckCircle size={14} className="text-white/20 group-hover/btn:text-emerald-500 transition-colors" />
                    )}

                    <span className="text-[10px] font-black text-white/40 group-hover/btn:text-white uppercase tracking-[0.3em] transition-colors">
                      {isProcessing ? "Executing..." : "Accept Connection"}
                    </span>
                  </div>

                  {/* Architectural corner tick */}
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white/10 group-hover/btn:bg-emerald-500 transition-colors" />
                </button>

                {/* ── DECLINE COMMAND ── */}
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={isProcessing}
                  className="relative flex-1 group/btn overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className={`
      flex items-center justify-center gap-3 px-6 py-4 
      bg-transparent border border-white/10 
      transition-all duration-500 relative z-10
      group-hover/btn:border-red-500/40 group-hover/btn:bg-red-500/[0.02]
    `}>
                    {isProcessing ? (
                      <div className="w-3 h-3 border border-red-500/30 border-t-red-500 animate-spin" />
                    ) : (
                      <XCircle size={14} className="text-white/20 group-hover/btn:text-red-500 transition-colors" />
                    )}

                    <span className="text-[10px] font-black text-white/40 group-hover/btn:text-white uppercase tracking-[0.3em] transition-colors">
                      {isProcessing ? "Declining..." : "Decline Request"}
                    </span>
                  </div>

                  {/* Architectural corner tick */}
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white/10 group-hover/btn:bg-red-500 transition-colors" />
                </button>
              </div>

              {/* Timestamp */}
              <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Data Point Indicator */}
                  <div className="w-1.5 h-1.5 bg-[#e87315]/40 rotate-45" />

                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="text-[#e87315]/60 italic">RECEIVED AT:</span>
                    <span className="text-white/40 tabular-nums">
                      {new Date(request.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }).toUpperCase()}
                    </span>
                    <span className="w-[1px] h-2 bg-white/10" />
                    <span className="text-white/40 tabular-nums">
                      {new Date(request.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionRequests;