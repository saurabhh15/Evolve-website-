import React, { useState, useEffect } from 'react';
import { Users, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, applicationAPI } from '../../services/api';

const TeamRecruitment = () => {
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await projectAPI.getMyProjects();
        const projects = projectsRes.data;

        // Fetch applications for each project in parallel
        const projectsWithApplications = await Promise.all(
          projects.map(async (project) => {
            try {
              const appRes = await applicationAPI.getApplications(project._id);
              return { ...project, applications: appRes.data };
            } catch {
              return { ...project, applications: [] };
            }
          })
        );

        setMyProjects(projectsWithApplications);
      } catch (err) {
        console.error('Failed to fetch recruitment data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const notification = e.detail;
      if (notification.type !== 'new_application') return;
      const projectId = notification.project?._id || notification.project;
      setMyProjects(prev =>
        prev.map(p => {
          if (p._id !== projectId) return p;
          return {
            ...p,
            applications: [...(p.applications || []), { status: 'pending', role: notification.role || '' }]
          };
        })
      );
    };
    window.addEventListener('notification_received', handler);
    return () => window.removeEventListener('notification_received', handler);
  }, []);

  // Build open roles from projects lookingFor — max 3 projects
  const displayedProjects = myProjects.slice(0, 3);

  const openRoles = displayedProjects.flatMap(project =>
    (project.lookingFor || []).map(role => ({
      projectId: project._id,
      projectName: project.title,
      role,
      applicants: project.applications?.filter(
        a => a.status === 'pending' && a.role === role
      ).length || 0
    }))
  ).slice(0, 3);

  const totalRoles = myProjects.flatMap(p => p.lookingFor || []).length;
  const hasMoreProjects = totalRoles > 3;

  const totalApplicants = myProjects.reduce(
    (sum, p) => sum + (p.applications?.filter(a => a.status === 'pending').length || 0), 0
  );

  const totalOpenRoles = myProjects.reduce(
    (sum, p) => sum + (p.lookingFor?.length || 0), 0
  );



  return (
    <div className="card-structured p-8 h-full flex flex-col border border-dashed border-white/10">

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-0 mb-10 pb-8 border-b border-white/5 relative">
        {/* Open Roles */}
        <div className="relative p-6 border-r border-white/5 group">
          <div className="absolute top-0 left-0 w-4 h-[1px] bg-white/10 group-hover:bg-[#e87315] transition-colors" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 bg-[#e87315]/40" />
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Open Roles</p>
            </div>
            <p className="text-4xl font-light text-white tabular-nums tracking-tighter">
              {loading ? '00' : totalOpenRoles.toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Applicants */}
        <div className="relative p-6 group">
          <div className="absolute top-0 left-0 w-4 h-[1px] bg-white/10 group-hover:bg-[#e87315] transition-colors" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#e87315]/40" />
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Applicants</p>
              </div>
              {totalApplicants > 0 && (
                <div className="flex items-center gap-2">

                  <div className="w-1.5 h-1.5 bg-[#e87315] animate-pulse" />
                </div>
              )}
            </div>
            <p className="text-4xl font-light text-white tabular-nums tracking-tighter">
              {loading ? '00' : totalApplicants.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* Open Roles List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/[0.02] border border-white/5 animate-pulse relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-white/5" />
            </div>
          ))
        ) : openRoles.length > 0 ? openRoles.map((role, index) => (
          <div
            key={`${role.projectId}-${role.role}`}
            onClick={() => navigate(`/dashboard/project/${role.projectId}`)}
            className="group relative bg-[#080808] border border-white/[0.03] hover:border-white/10 transition-all duration-500 cursor-pointer p-4 overflow-hidden"
          >
            <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-700" />

            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-[#e87315] opacity-40 italic group-hover:opacity-100 transition-opacity">
                    {index.toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-[13px] font-black text-white group-hover:text-[#e87315] transition-colors uppercase tracking-tight truncate">
                    {role.role}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white/10" />
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] truncate">
                    {role.projectName?.replace(/\s+/g, '_')}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {role.applicants > 0 ? (
                  <div className="flex items-center gap-3 px-4 py-2 border border-[#e87315]/20 group-hover:bg-[#e87315]/[0.02] transition-all">
                    <div className="relative">
                      <UserPlus size={12} className="text-[#e87315]" />
                      <div className="absolute -top-1 -right-1 w-1 h-1 bg-[#e87315] animate-ping" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] font-black text-white tracking-tighter">
                        {role.applicants.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[6px] font-black text-[#e87315] uppercase tracking-widest">
                        Pending
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 border border-white/5 opacity-40" />
                )}
              </div>
            </div>

            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/5" />
          </div>
        )) : (
          <div className="text-center py-16 border border-dashed border-white/10 relative group">
            <div className="absolute top-2 left-2 w-1 h-1 bg-white/10 group-hover:bg-[#e87315]" />
            <div className="w-12 h-12 bg-transparent border border-white/5 flex items-center justify-center mx-auto mb-6 relative">
              <Users size={20} className="text-white/10 group-hover:text-[#e87315] transition-colors" />
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/10" />
            </div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-2 italic">No open roles</h3>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
              Status: <span className="text-white/10 italic">No active roles opened</span>
            </p>
          </div>
        )}
      </div>

      {/* More projects indicator */}
      {hasMoreProjects && (
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-center py-2">
          +{totalRoles - 3} more roles across {myProjects.length} projects
        </p>
      )}

      {/* CTA Button */}
      <button
        onClick={() => navigate('/dashboard/project')}
        className="relative w-full mt-1 group/cmd overflow-hidden transition-all duration-500"
      >
        <div className="absolute inset-0 bg-[#e87315]/[0.02] group-hover/cmd:bg-[#e87315]/[0.06] transition-colors duration-500" />
        <div className="relative flex items-center justify-between px-6 py-4 border border-white/5 group-hover/cmd:border-[#e87315]/30 transition-all duration-500">
          <div className="absolute top-0 left-0 w-1 h-1 bg-white/10 group-hover/cmd:bg-[#e87315] transition-colors" />
          <div className="flex flex-col items-start gap-1">
            <span className="text-[8px] font-black text-[#e87315] uppercase tracking-[0.4em] opacity-0 group-hover/cmd:opacity-100 transition-all duration-500 translate-y-2 group-hover/cmd:translate-y-0">
              Execute
            </span>
            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
              Manage Project
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-4 bg-white/10 group-hover/cmd:w-8 group-hover/cmd:bg-[#e87315]/50 transition-all duration-700" />
            <ChevronRight size={16} className="text-white/20 group-hover/cmd:text-[#e87315] group-hover/cmd:translate-x-1 transition-all duration-500" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#e87315]/40 to-transparent group-hover/cmd:w-full transition-all duration-1000" />
      </button>
    </div>
  );
};

export default TeamRecruitment;