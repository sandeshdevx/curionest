export default function HabitCard({ habit, logs = [], isSurvivalMode, onComplete, onFail }) {
  const currentTarget = isSurvivalMode ? habit.survivalTarget : habit.mainTarget;
  
  return (
    <div className={`glass-panel p-4 rounded-3xl transition-all duration-300 hover:shadow-lg flex items-center justify-between group relative overflow-hidden ${habit.completedToday ? 'opacity-70' : ''} ${isSurvivalMode && !habit.completedToday ? 'border-sky-200 bg-sky-50/50' : ''}`}>
      
      {habit.completedToday && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none"></div>
      )}

      <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors duration-300 ${habit.completedToday ? 'bg-emerald-100 text-emerald-600' : isSurvivalMode ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
          {isSurvivalMode && !habit.completedToday ? '🛡️' : (habit.icon || '🎯')}
        </div>
        
        <div className="flex-1 min-w-0 pr-4">
          <h3 className={`font-semibold text-lg truncate transition-colors ${habit.completedToday ? 'text-emerald-900 line-through decoration-emerald-200' : 'text-slate-900'}`}>
            {habit.title}
            <span className="ml-3 text-xs font-normal text-slate-400 no-underline inline-block">
              🔥 {habit.currentStreak} {habit.graceDays > 0 && <span className="text-sky-500 ml-1 font-medium bg-sky-50 px-1.5 py-0.5 rounded-md">🧊 {habit.graceDays} Grace {habit.graceDays === 1 ? 'Day' : 'Days'}</span>}
            </span>
          </h3>
          <p className={`text-sm flex items-center gap-2 mt-0.5 ${isSurvivalMode && !habit.completedToday ? 'text-sky-600 font-medium' : 'text-slate-500'}`}>
            <span>{currentTarget || (isSurvivalMode ? 'Survival mode active' : 'Complete your task')}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 relative z-10 shrink-0">
        {!habit.completedToday ? (
          <>
            <button 
              onClick={() => onFail(habit.id)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
            <button 
              onClick={() => onComplete(habit.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-all shadow-sm ${isSurvivalMode ? 'bg-sky-500 hover:bg-sky-600' : 'bg-slate-900 hover:bg-brand-500'}`}
            >
              ✓
            </button>
          </>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
            ✓
          </div>
        )}
      </div>
    </div>
  );
}
