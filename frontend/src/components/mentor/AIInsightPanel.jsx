import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Lightbulb, ArrowRight, BrainCircuit } from 'lucide-react';

const AIInsightPanel = () => {
  const insights = [
    {
      type: 'warning',
      icon: <AlertCircle className="text-[#e87315]" size={14} />,
      title: 'Attention Needed',
      text: 'EcoSphere has missed 2 build logs. Milestone risk detected.',
      color: 'border-[#e87315]/40 bg-[#e87315]/[0.08]'
    },
    {
      type: 'success',
      icon: <Sparkles className="text-emerald-400" size={14} />,
      title: 'Scaling Opportunity',
      text: 'FinFlow is ready for pitch prep. MVP score is 88/100.',
      color: 'border-emerald-500/30 bg-emerald-500/[0.05]'
    }
  ];

  return (
    <div className="card-structured p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#e87315] blur-[20px] opacity-30 animate-pulse rounded-full" />
            <div className="relative w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center border border-[#e87315]/30 shadow-inner">
              <BrainCircuit size={20} className="text-[#e87315]" strokeWidth={2}/>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Smart Pulse</h2>
            <p className="text-[#e87315] text-xs font-bold uppercase tracking-widest mt-1">AI Assistant</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`p-5 rounded-2xl border ${insight.color} group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-[#0a0a0a] p-1.5 rounded-lg border border-white/[0.04]">
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1.5">{insight.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  {insight.text}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md">
                 Take Action <ArrowRight size={10} className="text-[#e87315]" />
               </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/[0.04]">
        <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl border border-white/[0.03] hover:border-white/[0.08] transition-colors cursor-default">
           <div className="flex items-center gap-2.5">
              <Lightbulb size={16} className="text-gray-500" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Projected Impact</span>
           </div>
           <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1.5 rounded-md border border-emerald-500/20">+14.2%</span>
        </div>
      </div>
    </div>
  );
};

export default AIInsightPanel;