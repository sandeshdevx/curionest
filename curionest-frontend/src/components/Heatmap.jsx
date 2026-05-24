import React from 'react';

export default function Heatmap({ logs }) {
  // Create an array of last 365 days
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  // Start from a Sunday to align columns properly, or just use 365 days.
  // We'll just use 365 days for simplicity.
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  // Map dates to log count
  const logCounts = {};
  logs.forEach(log => {
    // Parse the ISO date and get local YYYY-MM-DD
    const d = new Date(log.completedDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    logCounts[dateStr] = (logCounts[dateStr] || 0) + 1;
  });

  const getIntensityClass = (count) => {
    if (!count || count === 0) return 'bg-slate-100 border border-slate-200/50';
    if (count === 1) return 'bg-emerald-200';
    if (count === 2) return 'bg-emerald-300';
    if (count === 3) return 'bg-emerald-400';
    return 'bg-emerald-500';
  };

  return (
    <div className="glass-panel p-6 rounded-3xl mb-8 border border-slate-200/60 shadow-sm bg-white/40 backdrop-blur-md">
      <h2 className="text-lg font-serif font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        Consistency Heatmap
      </h2>
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="flex flex-col flex-wrap gap-1 min-w-max" style={{height: 'calc(7 * (0.85rem + 0.25rem))'}}>
          {days.map((day, idx) => {
            const year = day.getFullYear();
            const month = String(day.getMonth() + 1).padStart(2, '0');
            const date = String(day.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${date}`;
            
            const count = logCounts[dateStr] || 0;
            return (
              <div 
                key={dateStr}
                title={`${dateStr}: ${count} habits completed`}
                className={`w-[0.85rem] h-[0.85rem] rounded-[2px] transition-all hover:scale-125 hover:ring-2 hover:ring-slate-300 ${getIntensityClass(count)}`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[2px] bg-slate-100 border border-slate-200/50"></div>
        <div className="w-3 h-3 rounded-[2px] bg-emerald-200"></div>
        <div className="w-3 h-3 rounded-[2px] bg-emerald-300"></div>
        <div className="w-3 h-3 rounded-[2px] bg-emerald-400"></div>
        <div className="w-3 h-3 rounded-[2px] bg-emerald-500"></div>
        <span>More</span>
      </div>
    </div>
  );
}
