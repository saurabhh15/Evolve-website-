import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectionAPI } from '../../services/api';
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

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

    useEffect(() => {
        const handler = (e) => {
            setInquiries(prev => prev.filter(i => i._id !== e.detail.id));
        };
        window.addEventListener('connection_actioned', handler);
        return () => window.removeEventListener('connection_actioned', handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            const request = e.detail;
            setInquiries(prev => {
                if (prev.find(i => i._id === request._id)) return prev;
                return [request, ...prev];
            });
        };
        window.addEventListener('connection_request_received', handler);
        return () => window.removeEventListener('connection_request_received', handler);
    }, []);

    const handleAction = async (id, status) => {
        try {
            await connectionAPI.updateStatus(id, status);
            setInquiries(prev => prev.filter(i => i._id !== id));
            // trigger global connection actioned
            window.dispatchEvent(new CustomEvent('connection_actioned', { detail: { id } }));
        } catch (err) {
            console.error('Failed to update inquiry:', err);
        }
    };

    return (
        <div className="relative bg-[#0c0c0c] border border-white/10 overflow-hidden group">
            {/* ── Background Architectural Detail ── */}
            <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315]/40 to-transparent" />

            <div className="p-5 sm:p-8 flex flex-col relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/[0.05] border border-white/20 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
                                <MessageSquare size={24} className="text-[#e87315]/80 group-hover:text-[#e87315] sm:w-7 sm:h-7 -rotate-3 group-hover:-rotate-12 transition-transform" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#e87315] animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-[14px] sm:text-[16px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] italic">Pending Inquiries</h2>
                            <div className="flex items-center gap-2.5 mt-1.5">
                                <div className="h-px w-5 sm:w-6 bg-[#e87315]/60" />
                                <p className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-widest">
                                    {loading ? 'SYNCING...' : `${inquiries.length} requests in queue`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4 sm:space-y-6">
                    {loading ? (
                        <div className="space-y-4 sm:space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 sm:h-32 bg-white/[0.05] border border-white/10 animate-pulse" />
                            ))}
                        </div>
                    ) : inquiries.length > 0 ? inquiries.map((inquiry) => (
                        <div
                            key={inquiry._id}
                            className="relative group/item bg-transparent border-l-2 border-white/10 hover:border-[#e87315] pl-4 sm:pl-6 py-2 sm:py-3 transition-all duration-500"
                        >
                            <div className="flex items-start gap-4 sm:gap-6">
                                {/* Avatar Section */}
                                <div className="relative shrink-0">
                                    <img
                                        src={inquiry.from?.profileImage}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${inquiry.from?.name}&bold=true`;
                                        }}
                                        onClick={() => navigate(`/dashboard/user/${inquiry.from?._id}`)}
                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-none object-cover grayscale opacity-70 group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all duration-500 cursor-pointer border border-white/20"
                                        alt={inquiry.from?.name}
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#0c0c0c] flex items-center justify-center border border-white/20 group-hover/item:border-[#e87315]/50 transition-colors">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#e87315]" />
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                                        <p
                                            className="text-[12px] sm:text-[14px] font-black text-white/90 uppercase tracking-widest hover:text-[#e87315] transition-colors cursor-pointer truncate"
                                            onClick={() => navigate(`/dashboard/user/${inquiry.from?._id}`)}
                                        >
                                            {inquiry.from?.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-white/50 group-hover/item:text-white/80 transition-colors shrink-0">
                                            <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                            <span className="text-[9px] sm:text-[10px] font-mono tracking-tighter">
                                                {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[10px] sm:text-[11px] font-bold text-[#e87315]/80 uppercase tracking-[0.2em] mb-3 sm:mb-4 truncate">
                                        {inquiry.from?.college || inquiry.from?.role}
                                    </p>

                                    {/* Message Block */}
                                    {inquiry.message && (
                                        <div className="relative mt-2 sm:mt-3 mb-4 sm:mb-5 group/msg">
                                            <div className="absolute left-0 top-0 h-full w-[2px] bg-white/20 group-hover/msg:bg-[#e87315]/40 transition-colors" />
                                            <p className="text-[11px] sm:text-[12px] text-white/80 italic leading-relaxed pl-4 sm:pl-5 line-clamp-2 sm:line-clamp-3">
                                                "{inquiry.message}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Project Context Tag */}
                                    {inquiry.projectId && (
                                        <div
                                            onClick={() => navigate(`/dashboard/project/${inquiry.projectId?._id || inquiry.projectId}`)}
                                            className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-2.5 py-1 sm:py-1.5 bg-white/[0.05] border border-white/10 cursor-pointer hover:bg-[#e87315]/10 hover:border-[#e87315]/40 transition-all"
                                        >
                                            <span className="text-[9px] sm:text-[10px] font-black text-[#e87315] uppercase tracking-tighter">
                                                REF: {inquiry.projectId?.title || 'Project'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 sm:gap-4">
                                        <button
                                            onClick={() => handleAction(inquiry._id, 'accepted')}
                                            className="relative px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-black text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] overflow-hidden group/btn hover:shadow-[4px_4px_0px_rgba(232,115,21,1)] transition-all duration-300"
                                        >
                                            Accept_Req
                                        </button>
                                        <button
                                            onClick={() => handleAction(inquiry._id, 'rejected')}
                                            className="px-5 sm:px-6 py-2 sm:py-2.5 border border-white/20 text-white/50 hover:text-red-500 hover:border-red-500/50 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 sm:py-24 border border-dashed border-white/10 bg-[#0c0c0c] group">
                            <div className="relative mb-6 sm:mb-8">
                                <div className="w-14 h-14 sm:w-20 sm:h-20 border border-white/20 flex items-center justify-center rotate-45 group-hover:border-[#e87315]/40 transition-colors">
                                    <MessageSquare size={24} className="text-white/40 -rotate-45 sm:w-8 sm:h-8 group-hover:text-[#e87315] transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-[11px] sm:text-[12px] font-black text-white/80 uppercase tracking-[0.5em] sm:tracking-[0.6em]">No pending inquiries</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest mt-2.5 italic text-center px-4">New mentorship requests will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Technical Corner Accents */}
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#e87315]" />
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
        </div>
    );
};

export default RecentInquiries;