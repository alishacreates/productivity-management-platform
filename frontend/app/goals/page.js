'use client';
import { useEffect, useState, useCallback } from 'react';
import AppShell from '../../components/AppShell';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { goalAPI } from '../../lib/api';

const EMPTY_FORM = { title: '', description: '', progress: 0, deadline: '', category: '', status: 'active' };

function ProgressBar({ value, color = 'indigo' }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-400',
    emerald: 'from-emerald-500 to-emerald-400',
    amber: 'from-amber-500 to-amber-400',
  };
  const barColor = value === 100 ? colorMap.emerald : colorMap.indigo;

  return (
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete, onUpdateProgress }) {
  const statusColor = {
    active: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    paused: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[goal.status]}`}>
              {goal.status}
            </span>
            {goal.category && (
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{goal.category}</span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-100">{goal.title}</h4>
          {goal.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{goal.description}</p>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(goal)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => onDelete(goal._id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
              <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-bold text-slate-300">{goal.progress}%</span>
        </div>
        <ProgressBar value={goal.progress} />

        {/* Quick progress adjustment */}
        {goal.status === 'active' && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {[0, 25, 50, 75, 100].map(v => (
              <button
                key={v}
                onClick={() => onUpdateProgress(goal._id, v)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all duration-150 border ${
                  goal.progress === v
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                }`}
              >
                {v}%
              </button>
            ))}
          </div>
        )}
      </div>

      {goal.deadline && (
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
          📅 Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState('active');

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await goalAPI.getAll();
      setGoals(res.data.data);
    } catch {
      setError('Failed to load goals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingGoal(null); setModalOpen(true); };
  const openEdit = (goal) => {
    setForm({
      title: goal.title,
      description: goal.description || '',
      progress: goal.progress,
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : '',
      category: goal.category || '',
      status: goal.status,
    });
    setEditingGoal(goal);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingGoal(null); setForm(EMPTY_FORM); };

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try {
      setSaving(true);
      const payload = { ...form, deadline: form.deadline || undefined, progress: Number(form.progress) };
      if (editingGoal) {
        await goalAPI.update(editingGoal._id, payload);
      } else {
        await goalAPI.create(payload);
      }
      closeModal();
      fetchGoals();
    } catch {
      alert('Failed to save goal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    try { await goalAPI.delete(id); fetchGoals(); }
    catch { alert('Failed to delete.'); }
  };

  const handleUpdateProgress = async (id, progress) => {
    try {
      await goalAPI.update(id, { progress });
      fetchGoals();
    } catch { alert('Failed to update progress.'); }
  };

  const filtered = goals.filter(g => g.status === activeTab);
  const counts = { active: goals.filter(g => g.status === 'active').length, completed: goals.filter(g => g.status === 'completed').length, paused: goals.filter(g => g.status === 'paused').length };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Goals</h2>
            <p className="text-slate-500 text-sm mt-1">{counts.active} active · {counts.completed} completed</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            New Goal
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
          {['active', 'completed', 'paused'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                activeTab === tab ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab} {counts[tab] > 0 && <span className="ml-1 opacity-60">{counts[tab]}</span>}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner text="Loading goals..." />}
        {error && <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm">{error}</div>}

        {!loading && filtered.length === 0 && (
          <EmptyState
            title={`No ${activeTab} goals`}
            description={activeTab === 'active' ? 'Set your first goal and start tracking progress.' : `No ${activeTab} goals yet.`}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>}
            action={activeTab === 'active' ? <button onClick={openCreate} className="btn-primary">Create Goal</button> : null}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(goal => (
            <GoalCard key={goal._id} goal={goal} onEdit={openEdit} onDelete={handleDelete} onUpdateProgress={handleUpdateProgress} />
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingGoal ? 'Edit Goal' : 'New Goal'}>
        <div className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" placeholder="Goal title..." value={form.title} onChange={e => handleChange('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="What do you want to achieve?" value={form.description} onChange={e => handleChange('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <input className="input" placeholder="e.g. Health, Career..." value={form.category} onChange={e => handleChange('category', e.target.value)} />
            </div>
            <div>
              <label className="label">Deadline</label>
              <input className="input" type="date" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Progress: {form.progress}%</label>
            <input className="w-full accent-indigo-500" type="range" min="0" max="100" step="5" value={form.progress} onChange={e => handleChange('progress', Number(e.target.value))} />
          </div>
          {editingGoal && (
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} disabled={saving || !form.title.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
            <button onClick={closeModal} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
