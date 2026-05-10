'use client';

import Link from 'next/link';
import AppShell from '../../components/AppShell';

const AREAS = [
  {
    slug: 'physical',
    name: 'Physical',
    description: 'Health, fitness, sleep, nutrition, energy.',
    accent: 'from-emerald-500/20 to-emerald-400/5',
    border: 'border-emerald-500/20',
    text: 'text-emerald-300',
    stats: { tasks: 3, habits: 2, goals: 1 },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M6 14l3-8 3 6 3-4 3 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'mental',
    name: 'Mental',
    description: 'Mindfulness, journaling, reflection, clarity.',
    accent: 'from-indigo-500/20 to-indigo-400/5',
    border: 'border-indigo-500/20',
    text: 'text-indigo-300',
    stats: { tasks: 2, habits: 1, goals: 1 },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 3a7 7 0 00-7 7c0 2.2 1 4 2.5 5.3V19a2 2 0 002 2h5a2 2 0 002-2v-3.7A7 7 0 0012 3z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'spiritual',
    name: 'Spiritual',
    description: 'Prayer, gratitude, values, peace, inner growth.',
    accent: 'from-violet-500/20 to-violet-400/5',
    border: 'border-violet-500/20',
    text: 'text-violet-300',
    stats: { tasks: 1, habits: 2, goals: 1 },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 3l2.2 4.5L19 8.2l-3.5 3.4.8 4.8L12 14l-4.3 2.4.8-4.8L5 8.2l4.8-.7L12 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'work',
    name: 'Work',
    description: 'Career, output, priorities, systems, execution.',
    accent: 'from-amber-500/20 to-amber-400/5',
    border: 'border-amber-500/20',
    text: 'text-amber-300',
    stats: { tasks: 6, habits: 1, goals: 2 },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'relationships',
    name: 'Relationships',
    description: 'Family, friends, connection, communication, love.',
    accent: 'from-pink-500/20 to-pink-400/5',
    border: 'border-pink-500/20',
    text: 'text-pink-300',
    stats: { tasks: 2, habits: 1, goals: 1 },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 21s-6.5-4.35-9-8.5C1.2 9.3 3.1 5 7.2 5c2.2 0 3.5 1.2 4.8 2.8C13.3 6.2 14.6 5 16.8 5 20.9 5 22.8 9.3 21 12.5 18.5 16.65 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'learning',
    name: 'Learning',
    description: 'Study, skills, reading, curiosity, improvement.',
    accent: 'from-sky-500/20 to-sky-400/5',
    border: 'border-sky-500/20',
    text: 'text-sky-300',
    stats: { tasks: 4, habits: 1, goals: 2 },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M4 6.5l8-3 8 3-8 3-8-3z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v5.5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function AreaCard({ area }) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      className={`group relative overflow-hidden rounded-2xl border ${area.border} bg-slate-900/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${area.accent} opacity-80`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 ${area.text}`}>
              {area.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{area.name}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">{area.description}</p>
          </div>

          <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300">
            Open
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-500">Tasks</p>
            <p className="mt-1 text-base font-semibold text-white">{area.stats.tasks}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-500">Habits</p>
            <p className="mt-1 text-base font-semibold text-white">{area.stats.habits}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-500">Goals</p>
            <p className="mt-1 text-base font-semibold text-white">{area.stats.goals}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-500">View progress and items</p>
          <span className="text-sm font-medium text-slate-300 transition-transform duration-300 group-hover:translate-x-1">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function AreasPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Balance your life</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white font-display">
              Life Areas
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Organize your tasks, habits, goals, and notes by the parts of life that matter most.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <p className="text-xs text-slate-500">Areas</p>
              <p className="mt-1 text-lg font-semibold text-white">{AREAS.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <p className="text-xs text-slate-500">Active</p>
              <p className="mt-1 text-lg font-semibold text-white">6</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <p className="text-xs text-slate-500">Focus</p>
              <p className="mt-1 text-lg font-semibold text-white">Balanced</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Your current structure</h2>
              <p className="mt-1 text-sm text-slate-400">
                Start with core areas now. Later you can make them editable and fully customizable.
              </p>
            </div>

            <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700">
              Add custom area
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {AREAS.map((area) => (
            <AreaCard key={area.slug} area={area} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}