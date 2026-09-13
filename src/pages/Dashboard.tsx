import { systemInfo, monitors, wallpapers, playlists, performanceMetrics, backends } from '../data/store';
import {
  Cpu,
  HardDrive,
  Monitor,
  Play,
  Zap,
  Activity,
  Eye,
  Layers,
} from 'lucide-react';

export default function Dashboard() {
  const activeBackends = backends.filter(b => b.running);
  const videoWallpapers = wallpapers.filter(w => w.type === 'video');
  const imageWallpapers = wallpapers.filter(w => w.type === 'image');
  const activePlaylists = playlists.filter(p => p.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Dashboard</h2>
          <p className="text-sm text-hypr-text-muted mt-1">System overview and wallpaper status</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-hypr-green/10 border border-hypr-green/30">
          <div className="status-dot active animate-pulse-dot"></div>
          <span className="text-xs font-medium text-hypr-green">All Systems Operational</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Monitor size={20} />}
          label="Active Monitors"
          value={monitors.length.toString()}
          subtitle={`${monitors[0]?.width}x${monitors[0]?.height} @ ${monitors[0]?.refreshRate}Hz`}
          color="accent"
        />
        <StatCard
          icon={<Eye size={20} />}
          label="Wallpapers"
          value={wallpapers.length.toString()}
          subtitle={`${imageWallpapers.length} images • ${videoWallpapers.length} videos`}
          color="cyan"
        />
        <StatCard
          icon={<Play size={20} />}
          label="Active Playlists"
          value={activePlaylists.length.toString()}
          subtitle={`of ${playlists.length} total`}
          color="green"
        />
        <StatCard
          icon={<Zap size={20} />}
          label="Backend"
          value={activeBackends[0]?.name || 'None'}
          subtitle={activeBackends[0]?.version ? `v${activeBackends[0].version}` : 'Not running'}
          color="yellow"
        />
      </div>

      {/* Performance & System Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Metrics */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-hypr-accent" />
            <h3 className="font-semibold text-hypr-text">Performance</h3>
          </div>
          <div className="space-y-4">
            <MetricBar label="CPU Usage" value={performanceMetrics.cpuUsage} max={100} unit="%" color="bg-hypr-accent" />
            <MetricBar label="GPU Usage" value={performanceMetrics.gpuUsage} max={100} unit="%" color="bg-hypr-green" />
            <MetricBar label="Memory" value={performanceMetrics.memoryUsage} max={24576} unit="MB" color="bg-hypr-cyan" displayValue={`${performanceMetrics.memoryUsage}MB / 24GB`} />
            <MetricBar label="VRAM" value={performanceMetrics.vramUsage} max={8192} unit="MB" color="bg-hypr-yellow" displayValue={`${performanceMetrics.vramUsage}MB / 8GB`} />
            <div className="flex items-center justify-between pt-2 border-t border-hypr-border">
              <span className="text-sm text-hypr-text-dim">Render FPS</span>
              <span className="text-sm font-mono text-hypr-green">{performanceMetrics.fps} fps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-hypr-text-dim">Decode Time</span>
              <span className="text-sm font-mono text-hypr-cyan">{performanceMetrics.decodeTime}ms</span>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-hypr-cyan" />
            <h3 className="font-semibold text-hypr-text">System</h3>
          </div>
          <div className="space-y-3">
            <InfoRow icon={<Cpu size={14} />} label="CPU" value={systemInfo.cpu} />
            <InfoRow icon={<Layers size={14} />} label="GPU" value={systemInfo.gpu} />
            <InfoRow icon={<HardDrive size={14} />} label="RAM" value={systemInfo.ram} />
            <InfoRow icon={<Monitor size={14} />} label="Display" value={systemInfo.display} />
            <div className="pt-3 border-t border-hypr-border">
              <div className="flex flex-wrap gap-2">
                <Badge label="Wayland" active={systemInfo.wayland} />
                <Badge label="Hyprland" active={systemInfo.hyprland} />
                <Badge label="NVIDIA" active={systemInfo.nvidia} />
                <Badge label="CUDA" active={systemInfo.cuda} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backends Status */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-hypr-yellow" />
          <h3 className="font-semibold text-hypr-text">Backend Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {backends.map(backend => (
            <div
              key={backend.name}
              className={`p-3 rounded-lg border ${
                backend.running
                  ? 'bg-hypr-green/5 border-hypr-green/30'
                  : backend.installed
                  ? 'bg-hypr-surface-2 border-hypr-border'
                  : 'bg-hypr-surface-2/50 border-hypr-border/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-medium text-hypr-text">{backend.name}</span>
                <div className={`status-dot ${backend.running ? 'active' : backend.installed ? 'inactive' : 'inactive'}`}></div>
              </div>
              <p className="text-xs text-hypr-text-muted">
                {backend.running ? 'Running' : backend.installed ? 'Installed' : 'Not installed'}
              </p>
              {backend.version && (
                <p className="text-xs text-hypr-text-muted mt-1">v{backend.version}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {backend.capabilities.slice(0, 2).map(cap => (
                  <span key={cap} className="text-[10px] px-1.5 py-0.5 rounded bg-hypr-surface-3 text-hypr-text-muted">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Wallpaper Preview */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={18} className="text-hypr-accent" />
          <h3 className="font-semibold text-hypr-text">Current Wallpaper</h3>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-48 h-28 rounded-lg border border-hypr-border flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${wallpapers[0].color}, ${wallpapers[0].color}dd)` }}
          >
            <span className="text-xs text-hypr-text-muted">{wallpapers[0].type === 'video' ? '▶ Video' : '🖼 Image'}</span>
          </div>
          <div>
            <h4 className="font-medium text-hypr-text">{wallpapers[0].name}</h4>
            <p className="text-sm text-hypr-text-dim mt-1">{wallpapers[0].path}</p>
            <p className="text-xs text-hypr-text-muted mt-2">
              {wallpapers[0].resolution} • {wallpapers[0].fileSize} • {wallpapers[0].type}
            </p>
            <div className="flex gap-1 mt-2">
              {wallpapers[0].tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-hypr-accent/10 text-hypr-accent-light border border-hypr-accent/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components

function StatCard({ icon, label, value, subtitle, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: 'accent' | 'cyan' | 'green' | 'yellow';
}) {
  const colorMap = {
    accent: 'from-hypr-accent/20 to-transparent border-hypr-accent/30',
    cyan: 'from-hypr-cyan/20 to-transparent border-hypr-cyan/30',
    green: 'from-hypr-green/20 to-transparent border-hypr-green/30',
    yellow: 'from-hypr-yellow/20 to-transparent border-hypr-yellow/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} bg-hypr-surface border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-hypr-text-muted">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-hypr-text">{value}</p>
      <p className="text-xs text-hypr-text-dim mt-1">{label}</p>
      <p className="text-xs text-hypr-text-muted mt-0.5">{subtitle}</p>
    </div>
  );
}

function MetricBar({ label, value, max, unit, color, displayValue }: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  displayValue?: string;
}) {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-hypr-text-dim">{label}</span>
        <span className="text-sm font-mono text-hypr-text">
          {displayValue || `${value}${unit}`}
        </span>
      </div>
      <div className="h-2 bg-hypr-surface-3 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-hypr-text-muted">{icon}</span>
      <span className="text-sm text-hypr-text-dim w-16">{label}</span>
      <span className="text-sm text-hypr-text font-medium truncate">{value}</span>
    </div>
  );
}

function Badge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${
      active
        ? 'bg-hypr-green/10 border-hypr-green/30 text-hypr-green'
        : 'bg-hypr-surface-3 border-hypr-border text-hypr-text-muted'
    }`}>
      {active ? '✓' : '✗'} {label}
    </span>
  );
}
