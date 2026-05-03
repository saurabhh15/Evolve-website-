import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectionAPI } from '../../services/api';
import { MessageSquare, Clock } from 'lucide-react';

const RecentInquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await connectionAPI.getReceived();
        setInquiries(response.data);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await connectionAPI.updateStatus(id, status);
      setInquiries(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('Failed to update inquiry:', err);
    }
  };

  return (
    <div className="relative bg-[#080808] border border-white/[0.03] overflow-hidden group">
      {/* ── Background Architectural Detail ── */}
      <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315]/20 to-transparent" />

      <div className="p-4 sm:p-6 md:p-8 flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/[0.02] border border-white/5 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
                <MessageSquare size={20} className="text-[#e87315] sm:w-6 sm:h-6 -rotate-3 group-hover:-rotate-12 transition-transform" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#e87315] animate-pulse" />
            </div>
            <div>
              <h2 className="text-[12px] sm:text-[14px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] italic">Pending Inquiries</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-4 bg-[#e87315]/40" />
                <p className="text-[8px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  {loading ? 'SYNCING...' : `${inquiries.length} requests in queue`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4 sm:space-y-6 custom-scrollbar max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/[0.01] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : inquiries.length > 0 ? inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="relative group/item bg-transparent border-l-2 border-white/5 hover:border-[#e87315] pl-4 sm:pl-6 py-2 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Avatar Section */}
                <div className="relative shrink-0 flex justify-between w-full sm:w-auto items-start">
                  <img
                    src={inquiry.from?.profileImage}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${inquiry.from?.name}&bold=true`;
                    }}
                    onClick={() => navigate(`/dashboard/user/${inquiry.from?._id}`)}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-none object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500 cursor-pointer border border-white/10"
                    alt={inquiry.from?.name}
                  />
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#080808] flex items-center justify-center border border-white/10">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#e87315]" />
                  </div>
                  
                  {/* Mobile-only quick timestamp */}
                  <div className="flex items-center gap-1.5 text-white/20 sm:hidden">
                      <Clock size={10} />
                      <span className="text-[8px] font-mono tracking-tighter">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                      </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest hover:text-[#e87315] transition-colors cursor-pointer truncate pr-2"
                      onClick={() => navigate(`/dashboard/user/${inquiry.from?._id}`)}
                    >
                      {inquiry.from?.name}
                    </p>
                    <div className="hidden sm:flex items-center gap-2 text-white/20 shrink-0">
                      <Clock size={10} />
                      <span className="text-[9px] font-mono tracking-tighter">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[8px] sm:text-[9px] font-bold text-[#e87315]/60 uppercase tracking-[0.2em] mb-2 sm:mb-3 truncate">
                    {inquiry.from?.college || inquiry.from?.role}
                  </p>

                  {/* Message Block */}
                  {inquiry.message && (
                    <div className="relative mb-3 sm:mb-4">
                      <div className="absolute left-0 top-0 h-full w-[1px] bg-white/5" />
                      <p className="text-[10px] sm:text-[11px] text-white/40 italic leading-relaxed pl-3 sm:pl-4 line-clamp-3 sm:line-clamp-2">
                        "{inquiry.message}"
                      </p>
                    </div>
                  )}

                  {/* Project Context Tag */}
                  {inquiry.projectId && (
                    <div
                      onClick={() => navigate(`/dashboard/project/${inquiry.projectId?._id || inquiry.projectId}`)}
                      className="inline-flex items-center gap-2 mb-4 sm:mb-5 px-2 py-1 bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-[#e87315]/10 hover:border-[#e87315]/30 transition-all max-w-full"
                    >
                      <span className="text-[7px] sm:text-[8px] font-black text-[#e87315] uppercase tracking-tighter truncate">
                        REF: {inquiry.projectId?.title || 'Project'}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleAction(inquiry._id, 'accepted')}
                      className="w-full sm:w-auto relative px-4 sm:px-6 py-2.5 sm:py-2 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] overflow-hidden group/btn hover:shadow-[4px_4px_0px_rgba(232,115,21,1)] transition-all duration-300"
                    >
                      Accept_Req
                    </button>
                    <button
                      onClick={() => handleAction(inquiry._id, 'rejected')}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 border border-white/10 text-white/30 hover:text-red-500 hover:border-red-500/50 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 border border-dashed border-white/5 mx-1">
              <div className="relative mb-5 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border border-white/5 flex items-center justify-center rotate-45">
                  <MessageSquare size={20} className="text-white/10 sm:w-6 sm:h-6 -rotate-45" />
                </div>
              </div>
              <h3 className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] sm:tracking-[0.5em] text-center">No pending inquiries</h3>
              <p className="text-[8px] sm:text-[9px] font-bold text-white/10 uppercase tracking-widest mt-2 italic text-center px-4">New mentorship requests will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Decorative Side Elements ── */}
      <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-1.5 opacity-5 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-[2px] bg-white ${i % 3 === 0 ? 'w-6' : 'w-3'}`} />
        ))}
      </div>

      <div className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-1.5 opacity-5 rotate-180 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-[2px] bg-white ${i % 2 === 0 ? 'w-5' : 'w-2'}`} />
        ))}
      </div>
    </div>
  );
};

export default RecentInquiries;