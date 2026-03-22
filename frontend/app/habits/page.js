'use client';
import { useEffect, useState, useCallback } from 'react';
import AppShell from '../../components/AppShell';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { habitAPI } from '../../lib/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
const EMPTY_FORM = { name: '', description: '', color: '#6366f1' };

function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const completedToday = habit.completedDates?.some(
    (d) => new Date(d).toDateString() === new Date().toDateString()
  );

  return (
    <div className="card group">
      <div className="flex items-start gap-4">
        {/* Color dot */}
        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: habit.color }} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100">{habit.name}</p>
          {habit.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{habit.description}</p>}

          {/* Streak */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="#f59e0b" className="w-4 h-4">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-bold text-amber-400">{habit.streak} day streak</span>
            </div>
            {completedToday && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Done today
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(habit._id)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border-2 font-bold text-sm ${
              completedToday
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-600 text-slate-400 hover:border-emerald-400 hover:text-emerald-400'
            }`}
          >
            {completedToday ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(habit)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => onDelete(habit._id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mini calendar — last 7 days */}
      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const done = habit.completedDates?.some(cd => new Date(cd).toDateString() === d.toDateString());
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              <span className="text-[9px] text-slate-600">{d.toLocaleDateString('en', { weekday: 'narrow' })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await habitAPI.getAll();
      setHabits(res.data.data);
    } catch {
      setError('Failed to load habits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingHabit(null); setModalOpen(true); };
  const openEdit = (habit) => {
    setForm({ name: habit.name, description: habit.description || '', color: habit.color });
    setEditingHabit(habit);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingHabit(null); setForm(EMPTY_FORM); };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    try {
      setSaving(true);
      if (editingHabit) {
        await habitAPI.update(editingHabit._id, form);
      } else {
        await habitAPI.create(form);
      }
      closeModal();
      fetchHabits();
    } catch {
      alert('Failed to save habit.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await habitAPI.complete(id);
      fetchHabits();
    } catch { alert('Failed to toggle habit.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await habitAPI.delete(id);
      fetchHabits();
    } catch { alert('Failed to delete habit.'); }
  };

  const totalCompleted = habits.filter(h =>
    h.completedDates?.some(d => new Date(d).toDateString() === new Date().toDateString())
  ).length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Habit Tracker</h2>
            <p className="text-slate-500 text-sm mt-1">
              {totalCompleted}/{habits.length} completed today
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            New Habit
          </button>
        </div>

        {/* Progress bar */}
        {habits.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Today's Progress</span>
              <span className="text-xs font-bold text-slate-300">{Math.round((totalCompleted / habits.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(totalCompleted / habits.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {loading && <LoadingSpinner text="Loading habits..." />}
        {error && <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm">{error}</div>}

        {!loading && !error && habits.length === 0 && (
          <EmptyState
            title="No habits yet"
            description="Build better habits by tracking them daily."
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            action={<button onClick={openCreate} className="btn-primary">Add Habit</button>}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map(habit => (
            <HabitCard key={habit._id} habit={habit} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingHabit ? 'Edit Habit' : 'New Habit'}>
        <div className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input className="input" placeholder="e.g. Morning meditation..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" placeholder="Optional note..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} disabled={saving || !form.name.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Saving...' : editingHabit ? 'Update Habit' : 'Add Habit'}
            </button>
            <button onClick={closeModal} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
