import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectionAPI, userAPI } from '../../services/api';
import { Users, ArrowUpRight, Eye, Heart } from 'lucide-react';

const MyMentees = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const networkRes = await connectionAPI.getNetwork();
        const students = networkRes.data.filter(u => u.role === 'Student');

        // Fetch latest project for each mentee
        const menteesWithProjects = await Promise.all(
          students.map(async (student) => {
            try {
              const projectsRes = await userAPI.getUserProjects(student._id);
              return {
                ...student,
                latestProject: projectsRes.data[0] || null
              };
            } catch {
              return { ...student, latestProject: null };
            }
          })
        );

        setMentees(menteesWithProjects);
      } catch (err) {
        console.error('Failed to fetch mentees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentees();
  }, []);

  return (
    <div className="relative bg-[#080808] border border-white/[0.03] overflow-hidden group h-full flex flex-col">
      {/* ── Background Architectural Detail ── */}
      <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-[#e87315]/20 to-transparent" />

      <div className="p-8 flex flex-col relative z-10 h-full">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="relative">
            <div className="w-14 h-14 bg-white/[0.02] border border-white/5 flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <Users size={24} className="text-[#e87315] -rotate-3 group-hover:-rotate-12 transition-transform" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#e87315] rotate-45" />
          </div>
          <div>
            <h2 className="text-[14px] font-black text-white uppercase tracking-[0.4em] italic">My Mentees</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-4 bg-[#e87315]/40" />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {loading ? 'SYNCING...' : `${mentees.length} active connection${mentees.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </div>

        {/* List Container */}
        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/[0.01] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : mentees.length > 0 ? mentees.map((mentee) => (
            <div
              key={mentee._id}
              className="relative group/item bg-transparent border-l border-white/5 hover:border-[#e87315] pl-6 py-1 transition-all duration-500"
            >
              {/* Mentee Identity */}
              <div
                className="flex items-center gap-4 mb-4 cursor-pointer group/link"
                onClick={() => navigate(`/dashboard/user/${mentee._id}`)}
              >
                <div className="relative">
                  <img
                    src={mentee.profileImage}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${mentee.name}&bold=true`;
                    }}
                    className="w-10 h-10 rounded-none object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500 border border-white/10"
                    alt={mentee.name}
                  />
                  <div className="absolute inset-0 border border-[#e87315]/0 group-hover/link:border-[#e87315]/50 transition-all" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white uppercase tracking-widest group-hover/link:text-[#e87315] transition-colors truncate">
                    {mentee.name}
                  </p>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter truncate">
                    {mentee.college || 'EXTERNAL_CONTRIBUTOR'}
                  </p>
                </div>
                <ArrowUpRight size={14} className="text-white/10 group-hover/link:text-[#e87315] transition-colors" />
              </div>

              {/* Latest Project - Styled as a "Sub-Component" */}
              {mentee.latestProject ? (
                <div
                  onClick={() => navigate(`/dashboard/project/${mentee.latestProject._id}`)}
                  className="relative flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-[#e87315]/5 hover:border-[#e87315]/20 transition-all group/proj"
                >
                  <div className="shrink-0 w-8 h-8 overflow-hidden border border-white/5">
                    {mentee.latestProject.images?.[0] ? (
                      <img
                        src={mentee.latestProject.images[0]}
                        className="w-full h-full object-cover group-hover/proj:scale-110 transition-transform duration-500"
                        alt={mentee.latestProject.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#080808] flex items-center justify-center">
                        <span className="text-[#e87315]/40 font-mono text-[10px]">P_ID</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold text-white/60 group-hover/proj:text-white transition-colors truncate uppercase tracking-tighter">
                        {mentee.latestProject.title}
                      </p>
                      <span className="text-[8px] font-black text-[#e87315] uppercase ml-2 px-1 border border-[#e87315]/30">
                        {mentee.latestProject.stage}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 opacity-40 group-hover/proj:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <Eye size={9} className="text-white" />
                        <span className="text-[9px] font-mono text-white">{mentee.latestProject.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={9} className="text-white" />
                        <span className="text-[9px] font-mono text-white">{mentee.latestProject.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2 px-3 bg-white/[0.01] border border-dashed border-white/5 text-center">
                  <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest italic">Idle Status: No Active Projects</p>
                </div>
              )}
            </div>
          )) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5">
              <div className="relative mb-6">
                <div className="w-16 h-16 border border-white/5 flex items-center justify-center rotate-45">
                  <Users size={24} className="text-white/10 -rotate-45" />
                </div>
              </div>
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">No mentees yet</h3>
              <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest mt-2 italic">Accept inquiries to start mentoring</p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Corner Accents */}
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#e87315]" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
    </div>
  );
};

export default MyMentees;