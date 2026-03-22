'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import AppShell from '../../components/AppShell';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { noteAPI } from '../../lib/api';

const NOTE_COLORS = [
  { bg: '#fef9c3', label: 'Yellow' },
  { bg: '#dbeafe', label: 'Blue' },
  { bg: '#dcfce7', label: 'Green' },
  { bg: '#fce7f3', label: 'Pink' },
  { bg: '#ede9fe', label: 'Purple' },
  { bg: '#f1f5f9', label: 'White' },
];

const EMPTY_FORM = { title: '', content: '', color: '#fef9c3', tags: '', pinned: false };

function NoteCard({ note, onEdit, onDelete }) {
  const tagsArr = note.tags || [];

  return (
    <div
      className="rounded-2xl p-4 border border-slate-700/30 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group relative"
      style={{ backgroundColor: note.color || '#fef9c3' }}
      onClick={() => onEdit(note)}
    >
      {note.pinned && (
        <div className="absolute top-3 right-3 text-slate-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 opacity-50">
            <path d="M12 2L9.09 8.26 2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L17 14.14l5-4.87-7.09-1.01L12 2z" />
          </svg>
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-800 mb-2 pr-5 line-clamp-2">{note.title}</h4>
      {note.content && (
        <p className="text-xs text-slate-600 line-clamp-4 whitespace-pre-line leading-relaxed">{note.content}</p>
      )}
      {tagsArr.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-3">
          {tagsArr.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/8 text-slate-700 font-medium">#{tag}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-slate-500">
          {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onDelete(note._id); }}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
            <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function NoteEditor({ form, onChange, onSave, onCancel, saving, isEditing }) {
  const textareaRef = useRef(null);
  useEffect(() => { textareaRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style={{ backgroundColor: form.color || '#fef9c3' }}
      >
        {/* Color picker */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          {NOTE_COLORS.map(c => (
            <button
              key={c.bg}
              onClick={() => onChange('color', c.bg)}
              className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c.bg ? 'border-slate-800 scale-110' : 'border-slate-400/50'}`}
              style={{ backgroundColor: c.bg }}
              title={c.label}
            />
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onChange('pinned', !form.pinned)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${form.pinned ? 'bg-slate-800/20 text-slate-800' : 'text-slate-500 hover:bg-slate-800/10'}`}
            >
              📌 {form.pinned ? 'Pinned' : 'Pin'}
            </button>
          </div>
        </div>

        <div className="px-4 pb-2">
          <input
            className="w-full bg-transparent text-slate-800 font-bold text-base placeholder-slate-500 focus:outline-none"
            placeholder="Note title..."
            value={form.title}
            onChange={e => onChange('title', e.target.value)}
          />
        </div>
        <div className="px-4 pb-2">
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-500 focus:outline-none resize-none"
            placeholder="Take a note..."
            rows={8}
            value={form.content}
            onChange={e => onChange('content', e.target.value)}
          />
        </div>
        <div className="px-4 pb-2">
          <input
            className="w-full bg-transparent text-xs text-slate-600 placeholder-slate-400 focus:outline-none"
            placeholder="Tags (comma-separated): work, ideas, ..."
            value={form.tags}
            onChange={e => onChange('tags', e.target.value)}
          />
        </div>
        <div className="px-4 py-3 border-t border-slate-800/10 flex justify-end gap-2">
          <button onClick={onCancel} className="text-xs px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-800/10 transition-colors">Cancel</button>
          <button
            onClick={onSave}
            disabled={saving || !form.title.trim()}
            className="text-xs px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const res = await noteAPI.getAll(params);
      setNotes(res.data.data);
    } catch {
      setError('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingNote(null); setEditorOpen(true); };
  const openEdit = (note) => {
    setForm({
      title: note.title,
      content: note.content || '',
      color: note.color || '#fef9c3',
      tags: note.tags?.join(', ') || '',
      pinned: note.pinned || false,
    });
    setEditingNote(note);
    setEditorOpen(true);
  };
  const closeEditor = () => { setEditorOpen(false); setEditingNote(null); setForm(EMPTY_FORM); };

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    try {
      setSaving(true);
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (editingNote) {
        await noteAPI.update(editingNote._id, payload);
      } else {
        await noteAPI.create(payload);
      }
      closeEditor();
      fetchNotes();
    } catch {
      alert('Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try { await noteAPI.delete(id); fetchNotes(); }
    catch { alert('Failed to delete.'); }
  };

  const pinned = notes.filter(n => n.pinned);
  const unpinned = notes.filter(n => !n.pinned);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Notes</h2>
            <p className="text-slate-500 text-sm mt-1">{notes.length} notes saved</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            New Note
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
          </svg>
          <input
            className="input pl-10"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {loading && <LoadingSpinner text="Loading notes..." />}
        {error && <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm">{error}</div>}

        {!loading && notes.length === 0 && (
          <EmptyState
            title={search ? 'No notes found' : 'No notes yet'}
            description={search ? `No results for "${search}"` : 'Capture your thoughts and ideas.'}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" /><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" /><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" /></svg>}
            action={!search && <button onClick={openCreate} className="btn-primary">Create Note</button>}
          />
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">📌 Pinned</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pinned.map(note => <NoteCard key={note._id} note={note} onEdit={openEdit} onDelete={handleDelete} />)}
            </div>
          </section>
        )}

        {/* All notes */}
        {unpinned.length > 0 && (
          <section>
            {pinned.length > 0 && <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">All Notes</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unpinned.map(note => <NoteCard key={note._id} note={note} onEdit={openEdit} onDelete={handleDelete} />)}
            </div>
          </section>
        )}
      </div>

      {editorOpen && (
        <NoteEditor
          form={form}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={closeEditor}
          saving={saving}
          isEditing={!!editingNote}
        />
      )}
    </AppShell>
  );
}
