import { Page } from '../types';
import {
  LayoutDashboard,
  Image,
  Monitor,
  ListMusic,
  Clock,
  Settings,
  Cpu,
  GitBranch,
  Terminal,
  Brain,
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'smart-detect', label: 'Smart Detect', icon: <Brain size={20} /> },
  { page: 'library', label: 'Library', icon: <Image size={20} /> },
  { page: 'monitors', label: 'Monitors', icon: <Monitor size={20} /> },
  { page: 'playlists', label: 'Playlists', icon: <ListMusic size={20} /> },
  { page: 'scheduler', label: 'Scheduler', icon: <Clock size={20} /> },
  { page: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  { page: 'system', label: 'System Info', icon: <Cpu size={20} /> },
  { page: 'architecture', label: 'Architecture', icon: <GitBranch size={20} /> },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-hypr-surface border-r border-hypr-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-hypr-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-hypr-accent to-hypr-cyan flex items-center justify-center">
            <Terminal size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">HyprWall</h1>
            <p className="text-xs text-hypr-text-muted">Wallpaper Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ page, label, icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? 'bg-hypr-accent/15 text-hypr-accent-light border border-hypr-accent/30'
                : 'text-hypr-text-dim hover:text-hypr-text hover:bg-hypr-surface-2'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-hypr-border">
        <div className="flex items-center gap-2 text-xs text-hypr-text-muted">
          <div className="status-dot active animate-pulse-dot"></div>
          <span>Hyprland Connected</span>
        </div>
        <p className="text-xs text-hypr-text-muted mt-1">v0.1.0 • Wayland Native</p>
      </div>
    </aside>
  );
}
