'use client';
import { useEffect, useState, useCallback } from 'react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardAPI, habitAPI } from '../lib/api';

function PriorityBadge({ priority }) {
  const map = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };
  return <span className={map[priority] || 'badge-pending'}>{priority}</span>;
}

function StatusBadge({ status }) {
  return (
    <span className={status === 'completed' ? 'badge-completed' : 'badge-pending'}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dashboardAPI.getStats();
      setData(res.data.data);
    } catch (err) {
      setError('Failed to load dashboard. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleHabitToggle = async (id) => {
    try {
      await habitAPI.complete(id);
      fetchData(); // refresh stats
    } catch (err) {
      console.error('Failed to toggle habit:', err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Good day! 👋</h2>
          <p className="text-slate-500 mt-1 text-sm">Here's what's happening with your productivity.</p>
        </div>

        {loading && <LoadingSpinner text="Loading dashboard..." />}
        {error && (
          <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm">{error}</div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Tasks Completed Today"
                value={data.tasks.completedToday}
                subtitle={`${data.tasks.pending} pending`}
                color="emerald"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <StatCard
                title="Best Habit Streak"
                value={`${data.habits.maxStreak}d`}
                subtitle={`${data.habits.total} habits tracked`}
                color="amber"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <StatCard
                title="Focus Time Today"
                value={`${data.focus.hoursToday}h`}
                subtitle={`${data.focus.sessionsToday} sessions`}
                color="indigo"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <StatCard
                title="Active Goals"
                value={data.goals.active}
                subtitle={`${data.goals.completed} completed`}
                color="violet"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                }
              />
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Recent Tasks</h3>
                  <a href="/tasks" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</a>
                </div>
                {data.recentTasks.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No tasks yet. <a href="/tasks" className="text-indigo-400 hover:underline">Add one!</a></p>
                ) : (
                  <div className="space-y-3">
                    {data.recentTasks.map((task) => (
                      <div key={task._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          task.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />
                          </div>
                        </div>
                        {task.deadline && (
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Habits Today */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Today's Habits</h3>
                  <a href="/habits" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Manage →</a>
                </div>
                {data.habits.list.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No habits yet. <a href="/habits" className="text-indigo-400 hover:underline">Add one!</a></p>
                ) : (
                  <div className="space-y-3">
                    {data.habits.list.map((habit) => (
                      <div key={habit._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                        <button
                          onClick={() => handleHabitToggle(habit._id)}
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                            habit.completedToday
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-slate-600 hover:border-emerald-500'
                          }`}
                        >
                          {habit.completedToday && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${habit.completedToday ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {habit.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-xs font-semibold text-amber-400">{habit.streak}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
