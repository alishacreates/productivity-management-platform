'use client';
import { useEffect, useState, useCallback } from 'react';
import AppShell from '../../components/AppShell';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { taskAPI } from '../../lib/api';

const PRIORITY_OPTIONS = ['low', 'medium', 'high'];
const EMPTY_FORM = { title: '', description: '', priority: 'medium', deadline: '', status: 'pending' };

function PriorityBadge({ priority }) {
  const map = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };
  return <span className={map[priority] || 'badge-pending'}>{priority}</span>;
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className={`card group flex items-start gap-4 ${task.status === 'completed' ? 'opacity-60' : ''}`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task._id)}
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          task.status === 'completed'
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-600 hover:border-emerald-400'
        }`}
      >
        {task.status === 'completed' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          {task.deadline && (
            <span className="text-xs text-slate-500">
              📅 {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function TaskForm({ form, onChange, onSubmit, onCancel, isEditing, loading }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className="input" placeholder="Task title..." value={form.title} onChange={e => onChange('title', e.target.value)} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} placeholder="Optional description..." value={form.description} onChange={e => onChange('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Priority</label>
          <select className="input" value={form.priority} onChange={e => onChange('priority', e.target.value)}>
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Deadline</label>
          <input className="input" type="date" value={form.deadline} onChange={e => onChange('deadline', e.target.value)} />
        </div>
      </div>
      {isEditing && (
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e => onChange('status', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button onClick={onSubmit} disabled={loading || !form.title.trim()} className="btn-primary flex-1 disabled:opacity-50">
          {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      const res = await taskAPI.getAll(params);
      setTasks(res.data.data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline ? task.deadline.slice(0, 10) : '',
      status: task.status,
    });
    setEditingTask(task);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); setForm(EMPTY_FORM); };

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try {
      setSaving(true);
      const payload = { ...form, deadline: form.deadline || undefined };
      if (editingTask) {
        await taskAPI.update(editingTask._id, payload);
      } else {
        await taskAPI.create(payload);
      }
      closeModal();
      fetchTasks();
    } catch (err) {
      alert('Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await taskAPI.toggle(id);
      fetchTasks();
    } catch { alert('Failed to toggle task.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      fetchTasks();
    } catch { alert('Failed to delete task.'); }
  };

  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Tasks</h2>
            <p className="text-slate-500 text-sm mt-1">{tasks.length} total · {pending.length} pending</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <select className="input w-auto text-xs" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select className="input w-auto text-xs" value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          {(filter.status || filter.priority) && (
            <button onClick={() => setFilter({ status: '', priority: '' })} className="btn-secondary text-xs">Clear</button>
          )}
        </div>

        {loading && <LoadingSpinner text="Loading tasks..." />}
        {error && <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm">{error}</div>}

        {!loading && !error && tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started."
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            action={<button onClick={openCreate} className="btn-primary">Create Task</button>}
          />
        )}

        {/* Pending Tasks */}
        {pending.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending ({pending.length})</h3>
            <div className="space-y-2">
              {pending.map(task => (
                <TaskCard key={task._id} task={task} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Tasks */}
        {completed.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Completed ({completed.length})</h3>
            <div className="space-y-2">
              {completed.map(task => (
                <TaskCard key={task._id} task={task} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'New Task'}>
        <TaskForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isEditing={!!editingTask}
          loading={saving}
        />
      </Modal>
    </AppShell>
  );
}
