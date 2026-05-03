import React, { useState, useEffect } from 'react';
import { Zap, Trash2, Plus, X, ArrowRight } from 'lucide-react';
import { learningGoalAPI } from '../../services/api';

const SkillsProgress = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [targetInput, setTargetInput] = useState(3);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await learningGoalAPI.getAll();

      setGoals(response.data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!skillInput.trim() || adding) return;
    setAdding(true);
    setError(null);
    try {
      const response = await learningGoalAPI.add(skillInput.trim(), targetInput);
      setGoals(prev => [...prev, response.data]);
      setSkillInput('');
      setTargetInput(3);
      setShowAdd(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add goal.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await learningGoalAPI.delete(id);
      setGoals(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const getBarColor = (progress, completed) => {
    if (completed) return 'from-green-500';
    if (progress >= 60) return 'from-[#e87315]';
    if (progress >= 30) return 'from-blue-500';
    return 'from-purple-500';
  };

  return (
    <div className="card-structured p-4 sm:p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-12 group">
        {/* ── Technical Icon Node ── */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-transparent border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-[#e87315]/40 group-hover:bg-[#e87315]/[0.02]">
            {/* Icon uses your accent color for "power/active" status */}
            <Zap size={22} className="text-[#e87315]/60 group-hover:text-[#e87315] transition-colors" strokeWidth={1.5} />
          </div>

          {/* Architect Corner Ticks (Signature Detail) */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#e87315]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#e87315]" />

          {/* Vertical Connection Line */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gradient-to-bottom from-[#e87315]/40 to-transparent" />
        </div>

        {/* ── Header Labels ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter italic">
              Skill Progress
            </h2>
            <div className="hidden sm:block h-[1px] w-8 bg-white/5 group-hover:w-12 group-hover:bg-[#e87315]/30 transition-all duration-700" />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-[8px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest tabular-nums max-w-[200px] sm:max-w-none">
              See your goal progress based on the tags you added on the project.
            </p>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1 sm:pr-3 pb-3 custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[#080808] border border-white/5 animate-pulse relative">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : goals.length > 0 ? goals.map((goal) => (
          <div
            key={goal._id}
            className="group relative bg-[#080808] p-4 sm:p-5 border border-white/[0.03] hover:border-white/10 transition-all duration-500 overflow-hidden"
          >
            {/* ── Status Indicator (Architect Signature) ── */}
            <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[#e87315] transition-all duration-700" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-[12px] sm:text-[13px] font-black text-white uppercase tracking-tight group-hover:text-[#e87315] transition-colors">
                      {goal.skill?.replace(/\s+/g, '_')}
                    </h3>

                    {goal.completed && (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/[0.02]">
                        <div className="w-1 h-1 bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] sm:text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                          goal Completed
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Project added</span>
                    <p className="text-[8px] sm:text-[9px] font-bold text-white/40 uppercase tracking-widest tabular-nums">
                      {goal.current.toString().padStart(2, '0')} / {goal.target.toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(goal._id)}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-white/40 sm:text-white/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* ── Technical Progress Stepper ── */}
              <div className="space-y-2">
                <div className="flex gap-1 sm:gap-1.5 h-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 transition-all duration-700 ${(goal.progress / 10) > i
                        ? 'bg-[#e87315]/60 group-hover:bg-[#e87315]'
                        : 'bg-white/[0.05]'
                        }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[7px] sm:text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">
                    Start
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-white/40 tabular-nums tracking-widest group-hover:text-white transition-colors">
                    {goal.progress.toString().padStart(2, '0')}%_LOADED
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">
                    Target Goal
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Technical Detail */}

          </div>
        )) : (
          /* ── Empty State ── */
          <div className="relative flex flex-col items-center justify-center py-12 sm:py-20 border border-dashed border-white/5 bg-transparent group mx-1">
            <div className="absolute top-2 left-2 w-1 h-1 bg-white/10 group-hover:bg-[#e87315]" />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent border border-white/5 flex items-center justify-center mx-auto mb-4 sm:mb-6 relative">
              <Zap size={18} className="text-white/10 group-hover:text-[#e87315] transition-colors" />
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/10" />
            </div>

            <h3 className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-[0.5em] mb-2 italic">
              No skills Added
            </h3>
            <p className="text-[8px] sm:text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] max-w-[160px] sm:max-w-[200px] text-center leading-relaxed">
              logs empty. <br />Add skills to your project to initiate tracking.
            </p>
          </div>
        )}
      </div>

      {/* Add Goal Form */}
      {showAdd && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#080808] border border-[#e87315]/20 relative overflow-hidden group/panel">
          {/* ── Background Decal ── */}
          <div className="absolute top-0 right-0 p-2 opacity-[0.03] select-none">
            <span className="text-[30px] sm:text-[40px] font-black text-white leading-none tracking-tighter">ADD NEW</span>
          </div>

          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-3 sm:h-4 bg-[#e87315]" />
              <p className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                Initialize New Goal
              </p>
            </div>
            <button
              type="button" // Force type button to prevent form submission triggers
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent the click from bubbling up
                setShowAdd(false);
                setError(null);
              }}
              className="relative z-50 p-1.5 sm:p-2 border border-white/10 hover:border-[#e87315]/40 text-white/20 hover:text-[#e87315] transition-all cursor-pointer"
              aria-label="Terminate Process"
            >
              <X size={14} />

              {/* Architect Corner Ticks for the Button */}
              <div className="absolute -top-[1px] -right-[1px] w-1 h-1 bg-[#e87315] opacity-0 group-hover/panel:opacity-100" />
            </button>
          </div>

          <div className="space-y-5 sm:space-y-6 relative z-10">
            {/* ── Input Field ── */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black text-[#e87315]/60 uppercase tracking-[0.2em]">
                <span>[01]</span> Enter Skill
              </label>
              <input
                type="text"
                placeholder="ENTER TECH STACK..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/10 focus:border-[#e87315] text-white text-[10px] sm:text-xs focus:outline-none transition-all placeholder:text-white/10 placeholder:uppercase"
              />
            </div>

            {/* ── Range Selector ── */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[8px] sm:text-[9px] font-black text-[#e87315]/60 uppercase tracking-[0.2em]">
                  <span>[02]</span> No of projects
                </label>
                <span className="text-[12px] sm:text-[14px] font-black text-white tabular-nums">
                  {targetInput.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="relative h-6 flex items-center">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={targetInput}
                  onChange={e => setTargetInput(parseInt(e.target.value))}
                  className="w-full appearance-none bg-white/5 h-[2px] accent-[#e87315] cursor-pointer"
                />
              </div>

              <div className="flex justify-between text-[7px] sm:text-[8px] font-black text-white/10 uppercase tracking-widest">
                <span>Min 01</span>
                <span>Max 20</span>
              </div>
            </div>

            {/* ── Error Output ── */}
            {error && (
              <div className="py-2 px-3 border-l-2 border-red-500 bg-red-500/5">
                <p className="text-red-400 text-[9px] sm:text-[10px] font-black uppercase tracking-wider italic">
                  Error: {error}
                </p>
              </div>
            )}

            {/* ── Execute Button ── */}
            <button
              onClick={handleAdd}
              disabled={adding || !skillInput.trim()}
              className="relative w-full group/btn overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-[#e87315] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10 py-2 sm:py-3 border border-[#e87315] flex items-center justify-center gap-2 sm:gap-3 transition-colors duration-300 group-hover/btn:text-black text-[#e87315]">
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  {adding ? 'Syncing_Data...' : 'Commit_To_Registry'}
                </span>
                {!adding && <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />}
              </div>
            </button>
          </div>

          {/* Architect Signature Ticks */}
          <div className="absolute top-0 left-0 w-1 h-1 bg-[#e87315]" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#e87315]" />
        </div>
      )}

      {/* Add Button */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="relative w-full mt-3 group/trigger overflow-hidden transition-all duration-500"
        >
          {/* ── Structural Frame ── */}
          <div className="relative flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-5 border border-dashed border-white/10 group-hover/trigger:border-[#e87315]/40 group-hover/trigger:bg-[#e87315]/[0.02] transition-all duration-500">

            {/* Ghost Architect Signature Ticks */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-white/10 group-hover/trigger:bg-[#e87315] transition-colors" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/10 group-hover/trigger:bg-[#e87315] transition-colors" />

            {/* The Command Label */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-[11px] font-black text-white/40 group-hover/trigger:text-white uppercase tracking-[0.2em] transition-colors">
                New goal
              </span>
            </div>

            {/* Floating Plus Icon */}
            <div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">
              <Plus
                size={14}
                className="text-white/20 group-hover/trigger:text-[#e87315] group-hover/trigger:rotate-90 transition-all duration-500"
              />
              {/* Subtle Glow behind the plus */}
              <div className="absolute inset-0 bg-[#e87315] blur-md opacity-0 group-hover/trigger:opacity-20 transition-opacity" />
            </div>
          </div>

          {/* Hover "Scanning" Line */}
          <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#e87315]/50 to-transparent group-hover/trigger:w-full transition-all duration-1000" />
        </button>
      )}
    </div>
  );
};

export default SkillsProgress;