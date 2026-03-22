import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="page-enter max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
