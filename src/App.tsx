import { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Monitors from './pages/Monitors';
import Playlists from './pages/Playlists';
import Scheduler from './pages/Scheduler';
import Settings from './pages/Settings';
import SystemInfo from './pages/SystemInfo';
import Architecture from './pages/Architecture';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'library': return <Library />;
      case 'monitors': return <Monitors />;
      case 'playlists': return <Playlists />;
      case 'scheduler': return <Scheduler />;
      case 'settings': return <Settings />;
      case 'system': return <SystemInfo />;
      case 'architecture': return <Architecture />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-hypr-bg overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 lg:z-auto transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false); }} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-hypr-bg/80 backdrop-blur-md border-b border-hypr-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-hypr-surface-2 text-hypr-text-dim transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-hypr-text-muted">
              <span className="px-2 py-0.5 rounded bg-hypr-surface-2 border border-hypr-border font-mono">
                Wayland
              </span>
              <span className="px-2 py-0.5 rounded bg-hypr-surface-2 border border-hypr-border font-mono">
                Hyprland 0.55.4
              </span>
              <span className="px-2 py-0.5 rounded bg-hypr-green/10 border border-hypr-green/30 text-hypr-green font-mono">
                hyprpaper
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-hypr-text-muted">
              <div className="status-dot active animate-pulse-dot"></div>
              <span>Connected</span>
            </div>
            <div className="text-xs text-hypr-text-muted font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
