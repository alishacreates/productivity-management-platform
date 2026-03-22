'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import AppShell from '../../components/AppShell';
import LoadingSpinner from '../../components/LoadingSpinner';
import { focusAPI } from '../../lib/api';

const PRESETS = [
  { label: 'Focus', minutes: 25, type: 'focus', color: 'indigo' },
  { label: 'Short Break', minutes: 5, type: 'short_break', color: 'emerald' },
  { label: 'Long Break', minutes: 15, type: 'long_break', color: 'violet' },
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function CircularProgress({ percent, color }) {
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const colorMap = { indigo: '#6366f1', emerald: '#10b981', violet: '#8b5cf6' };

  return (
    <svg viewBox="0 0 200 200" className="w-56 h-56 -rotate-90">
      <circle cx="100" cy="100" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
      <circle
        cx="100" cy="100" r={r}
        fill="none"
        stroke={colorMap[color]}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

export default function FocusPage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [seconds, setSeconds] = useState(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [sessRes] = await Promise.all([focusAPI.getSessions()]);
      setSessions(sessRes.data.data.slice(0, 10));
      setStats({ totalTodayMinutes: sessRes.data.totalTodayMinutes });
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const selectPreset = (p) => {
    if (running) return;
    setPreset(p);
    setSeconds(p.minutes * 60);
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          saveSession(preset.minutes, preset.type, true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(preset.minutes * 60);
  };

  const saveSession = async (duration, type, completed = true) => {
    try {
      await focusAPI.saveSession({ duration, type, completed });
      fetchData();
    } catch { /* silent */ }
  };

  const handleStop = async () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    // Save partial session
    const elapsed = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 60000);
    if (elapsed >= 1 && preset.type === 'focus') {
      await saveSession(elapsed, 'focus', false);
    }
    setSeconds(preset.minutes * 60);
  };

  const totalSeconds = preset.minutes * 60;
  const percent = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <AppShell>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Focus Mode</h2>
          <p className="text-slate-500 text-sm mt-1">Pomodoro timer to keep you in the zone.</p>
        </div>

        {/* Preset selector */}
        <div className="flex gap-2">
          {PRESETS.map(p => (
            <button
              key={p.type}
              onClick={() => selectPreset(p)}
              disabled={running}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border disabled:cursor-not-allowed ${
                preset.type === p.type
                  ? p.color === 'indigo'
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : p.color === 'emerald'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="card flex flex-col items-center py-10 gap-6">
          <div className="relative">
            <CircularProgress percent={percent} color={preset.color} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white font-display tabular-nums">
                {formatTime(seconds)}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-medium">{preset.label}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              disabled={running && seconds === preset.minutes * 60}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {!running ? (
              <button
                onClick={start}
                disabled={seconds === 0}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 active:scale-95 disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={pause}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
            )}

            {running && (
              <button
                onClick={handleStop}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </button>
            )}
          </div>

          {/* Today stat */}
          {stats && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-indigo-400">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs text-slate-400">
                <span className="font-semibold text-white">{stats.totalTodayMinutes} min</span> focused today
              </span>
            </div>
          )}
        </div>

        {/* Session history */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Sessions</h3>
          {loading && <LoadingSpinner size="sm" />}
          {!loading && sessions.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">No sessions yet. Start your first focus session!</p>
          )}
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s.type === 'focus' ? 'bg-indigo-400' : s.type === 'short_break' ? 'bg-emerald-400' : 'bg-violet-400'
                }`} />
                <div className="flex-1">
                  <span className="text-sm text-slate-300 capitalize">{s.type.replace('_', ' ')}</span>
                  {!s.completed && <span className="ml-2 text-xs text-slate-500">(partial)</span>}
                </div>
                <span className="text-sm font-semibold text-white">{s.duration} min</span>
                <span className="text-xs text-slate-500">
                  {new Date(s.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
