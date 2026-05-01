import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const UpcomingDeadlines = () => {
  const deadlines = [
    { id: 1, task: 'Portfolio Website Review', project: 'Personal Brand', date: 'Today at 5:00 PM', progress: 90, priority: 'HIGH', color: 'from-[#e87315] to-[#f97316]' },
    { id: 2, task: 'Submit AI Model Documentation', project: 'Learning Platform', date: 'Tomorrow, 11:30 AM', progress: 75, priority: 'HIGH', color: 'from-[#e87315] to-[#f97316]' },
    { id: 3, task: 'Code Review Meeting', project: 'E-Commerce App', date: 'Dec 22, 2:00 PM', progress: 60, priority: 'MED', color: 'from-gray-400 to-gray-600' },
  ];

  return (
    <div className="card-structured p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#101010] rounded-xl flex items-center justify-center border border-white/[0.04] shadow-inner">
          <Clock size={20} className="text-[#e87315]" strokeWidth={2.5}/>
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Upcoming Deadlines</h2>
          <p className="text-gray-500 text-sm font-medium">4 tasks pending</p>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {deadlines.map((item) => (
          <div key={item.id} className="group inner-container-pill hover:border-[#e87315]/[0.2] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-[#e87315] transition-colors">{item.task}</h3>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{item.project}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-tighter border ${
                item.priority === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
              }`}>
                {item.priority}
              </span>
            </div>

            {/* Progress Section */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px] font-black text-gray-500">
                <span className="uppercase tracking-widest">PROGRESS</span>
                <span className="text-white">{item.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle size={12} />
                <span className="text-[10px] font-bold">{item.date}</span>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#e87315] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-[#e87315]/[0.05] rounded-lg border border-[#e87315]/[0.1] hover:bg-[#e87315]">
                Mark Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;