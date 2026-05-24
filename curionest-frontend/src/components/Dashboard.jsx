import { useState, useEffect } from 'react';
import HabitCard from './HabitCard';
import Heatmap from './Heatmap';

export default function Dashboard({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  
  // The Core Differentiator State
  const [isSurvivalMode, setIsSurvivalMode] = useState(false);

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health');
  const [newHabitMainTarget, setNewHabitMainTarget] = useState('');
  const [newHabitSurvivalTarget, setNewHabitSurvivalTarget] = useState('');

  useEffect(() => {
    fetchHabits();
    fetchLogs();
  }, [user]);

  const fetchHabits = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/habits/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setHabits(data);
      }
    } catch (err) {
      console.error("Failed to fetch habits", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/habits/user/${user.id}/logs`);
      if (res.ok) {
        const data = await res.json();
        setHabitLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch habit logs", err);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/habits/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newHabitTitle,
          category: newHabitCategory,
          frequency: 'daily',
          icon: newHabitCategory === 'Health' ? '🏃‍♂️' : newHabitCategory === 'Mind' ? '🧘' : newHabitCategory === 'Productivity' ? '⚡' : '💰',
          mainTarget: newHabitMainTarget || 'Do the task',
          survivalTarget: newHabitSurvivalTarget || 'Do 1 minute of the task',
          user: { id: user.id }
        })
      });
      if (res.ok) {
        setShowAddHabitModal(false);
        setNewHabitTitle('');
        setNewHabitMainTarget('');
        setNewHabitSurvivalTarget('');
        fetchHabits();
      }
    } catch (err) {
      console.error("Failed to add habit", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/habits/${id}/complete`, { method: 'POST' });
      if (res.ok) {
        fetchHabits();
        fetchLogs();
      }
    } catch (err) {
      console.error("Failed to complete habit");
    }
  };

  const handleFail = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/habits/${id}/fail`, { method: 'POST' });
      if (res.ok) {
        const message = await res.text();
        console.log(message);
        
        // Generate AI Web Resource Suggestion based on failure type
        const failedHabit = habits.find(h => h.id === id);
        if (message.includes("Grace Day")) {
           setSuggestion({
             type: 'grace',
             title: 'Grace Day Applied! 🧊',
             text: `You missed "${failedHabit?.title}", but your streak is frozen! Rest up and try again tomorrow. No pressure.`,
             habitId: failedHabit?.id
           });
        } else {
           setSuggestion({
             type: 'recovery',
             title: 'Recovery Coach 🧠',
             text: `Don't beat yourself up about missing "${failedHabit?.title}". Try reducing friction: place your tools where you can see them easily tomorrow.`,
             habitId: failedHabit?.id
           });
        }
        
        fetchHabits();
      }
    } catch (err) {
      console.error("Failed to fail habit");
    }
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  
  // Calculate last 7 days for the header calendar
  const last7Days = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7Days.push(d);
  }
  
  return (
    <div className={`w-full max-w-5xl min-h-[90vh] pt-8 pb-20 px-4 lg:px-8 mx-auto relative transition-colors duration-1000 ${isSurvivalMode ? 'brightness-90 sepia-[0.2]' : ''}`}>
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">
            {isSurvivalMode ? 'Take it easy,' : 'Hello,'} {user?.username || user?.firstName || 'User'}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isSurvivalMode ? 'Survival Mode Activated. Minimum effort today.' : 'Ready to conquer your day?'}
          </p>
        </div>
        <button onClick={onLogout} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Calendar, Stats, Heatmap */}
        <div className="flex-1 flex flex-col min-w-0">

      {/* 7-Day Mini Calendar */}
      <div className={`flex justify-between items-center p-4 rounded-3xl mb-6 shadow-sm border transition-colors duration-500 ${isSurvivalMode ? 'bg-sky-50/80 border-sky-100' : 'bg-white/60 border-slate-200 backdrop-blur-xl'}`}>
        {last7Days.map((day, i) => {
          const isToday = i === 6;
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
          const dateNum = day.getDate();
          
          return (
            <div key={i} className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl transition-all ${isToday ? (isSurvivalMode ? 'bg-sky-500 text-white shadow-md scale-105' : 'bg-slate-900 text-white shadow-md scale-105') : 'text-slate-500 hover:bg-slate-100/50'}`}>
              <span className={`text-xs font-medium ${isToday ? 'text-white/80' : 'text-slate-400'}`}>{dayName}</span>
              <span className={`text-lg font-bold ${isToday ? 'text-white' : 'text-slate-700'}`}>{dateNum}</span>
            </div>
          );
        })}
      </div>

      {/* The Anti-Burnout Toggle */}
      <div className={`p-5 rounded-3xl mb-8 flex items-center justify-between transition-all duration-500 shadow-sm border ${isSurvivalMode ? 'bg-sky-100/80 border-sky-200' : 'bg-white/60 border-slate-200 backdrop-blur-xl'}`}>
        <div>
          <h2 className={`font-serif font-bold text-lg ${isSurvivalMode ? 'text-sky-900' : 'text-slate-800'}`}>🛡️ Survival Mode</h2>
          <p className={`text-sm ${isSurvivalMode ? 'text-sky-700' : 'text-slate-500'}`}>Feeling overwhelmed? Scale down your habits.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={isSurvivalMode} onChange={() => setIsSurvivalMode(!isSurvivalMode)} />
          <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-500"></div>
        </label>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium mb-2">Daily Progress</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-serif font-bold text-slate-900">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${isSurvivalMode ? 'bg-sky-500' : 'bg-brand-500'}`} style={{width: `${progress}%`}}></div>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium mb-2">Active Habits</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-serif font-bold text-slate-900">{habits.length}</span>
          </div>
        </div>
      </div>

      {/* Heatmap Component */}
      <Heatmap logs={habitLogs} />
        </div> {/* End Left Column */}

        {/* Right Column: Habits List */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-bold text-slate-900">Today's Tasks</h2>
            <button onClick={() => setShowAddHabitModal(true)} className={`w-10 h-10 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md ${isSurvivalMode ? 'bg-sky-600' : 'bg-slate-900 hover:bg-slate-800'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
      
          <div className="flex flex-col gap-3 flex-1">
            {habits.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-300 rounded-3xl">
                No habits yet. Start small!
              </div>
            ) : (
              habits.map(habit => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  logs={habitLogs.filter(l => l.habit.id === habit.id)}
                  isSurvivalMode={isSurvivalMode}
                  onComplete={handleComplete}
                  onFail={handleFail}
                />
              ))
            )}
          </div>
          
          {/* Web Resource Search Suggestion */}
          <div className={`mt-6 p-5 rounded-3xl border shadow-sm transition-colors duration-500 ${suggestion ? (suggestion.type === 'grace' ? 'bg-sky-50/80 border-sky-200' : 'bg-orange-50/80 border-orange-200') : 'bg-slate-50/80 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{suggestion ? (suggestion.type === 'grace' ? '🧊' : '🧠') : '💡'}</span>
              <h3 className={`font-serif font-bold ${suggestion ? (suggestion.type === 'grace' ? 'text-sky-900' : 'text-orange-900') : 'text-slate-800'}`}>
                {suggestion ? suggestion.title : 'AI Recovery Coach'}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${suggestion ? (suggestion.type === 'grace' ? 'text-sky-700' : 'text-orange-800') : 'text-slate-600'}`}>
              {suggestion ? suggestion.text : 'Complete or fail a habit to get dynamic psychological tips and recovery resources.'}
            </p>
            {suggestion && suggestion.type === 'recovery' && (
               <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 Search: "Psychology of building {habits.find(h => h.id === suggestion.habitId)?.category || 'better'} habits"
               </a>
            )}
          </div>

        </div> {/* End Right Column */}
      </div> {/* End Two-Column Layout */}

      {/* Add Habit Modal */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-[2rem] max-w-md w-full relative shadow-2xl">
            <button onClick={() => setShowAddHabitModal(false)} className="absolute top-6 right-6 text-slate-400">✕</button>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">New Habit</h3>
            
            <form onSubmit={handleAddHabit} className="flex flex-col gap-4 mt-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Habit Name</label>
                <input type="text" placeholder="e.g. Read a Book" className="glass-input" value={newHabitTitle} onChange={(e) => setNewHabitTitle(e.target.value)} required />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Main Target (Good Days)</label>
                <input type="text" placeholder="e.g. Read 20 pages" className="glass-input" value={newHabitMainTarget} onChange={(e) => setNewHabitMainTarget(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-medium text-sky-700 mb-1 block">🛡️ Survival Target (Bad Days)</label>
                <input type="text" placeholder="e.g. Read just 1 page" className="glass-input bg-sky-50/50 border-sky-200" value={newHabitSurvivalTarget} onChange={(e) => setNewHabitSurvivalTarget(e.target.value)} required />
                <p className="text-xs text-slate-500 mt-1">What is the absolute minimum you can do when you are completely exhausted?</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                <select className="glass-input appearance-none bg-white/50" value={newHabitCategory} onChange={(e) => setNewHabitCategory(e.target.value)}>
                  <option value="Health">Health & Fitness</option>
                  <option value="Mind">Mind & Focus</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>
              
              <button type="submit" className="btn-primary w-full mt-4">Add Habit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
