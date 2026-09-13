import { useState } from 'react';
import { monitors, wallpapers } from '../data/store';
import { Monitor as MonitorIcon, Maximize2, RotateCw, Settings2, Check } from 'lucide-react';

export default function Monitors() {
  const [selectedMonitor, setSelectedMonitor] = useState(monitors[0]?.id || '');
  const [assignedWallpaper, setAssignedWallpaper] = useState<string>(wallpapers[0]?.id || '');

  const currentMonitor = monitors.find(m => m.id === selectedMonitor);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Monitor Management</h2>
          <p className="text-sm text-hypr-text-muted mt-1">Configure wallpapers per display</p>
        </div>
        <button className="px-4 py-2 bg-hypr-surface-2 hover:bg-hypr-surface-3 border border-hypr-border rounded-lg text-sm text-hypr-text-dim transition-colors flex items-center gap-2">
          <RotateCw size={14} />
          Refresh Detection
        </button>
      </div>

      {/* Monitor Layout Visualization */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-6">
        <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
          <Maximize2 size={16} className="text-hypr-cyan" />
          Display Layout
        </h3>
        <div className="bg-hypr-bg rounded-lg p-8 flex items-center justify-center min-h-[200px]">
          {monitors.map(monitor => (
            <div
              key={monitor.id}
              onClick={() => setSelectedMonitor(monitor.id)}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedMonitor === monitor.id
                  ? 'border-hypr-accent bg-hypr-accent/5 glow-accent'
                  : 'border-hypr-border hover:border-hypr-text-muted'
              }`}
              style={{
                width: `${Math.min(monitor.width / 8, 280)}px`,
                height: `${Math.min(monitor.height / 8, 160)}px`,
              }}
            >
              <div className="absolute -top-3 left-3 px-2 py-0.5 bg-hypr-surface-2 border border-hypr-border rounded text-xs font-mono text-hypr-text-dim">
                {monitor.id}
              </div>
              <div className="flex flex-col items-center justify-center h-full">
                <MonitorIcon size={24} className={selectedMonitor === monitor.id ? 'text-hypr-accent' : 'text-hypr-text-muted'} />
                <p className="text-xs font-medium text-hypr-text mt-2">{monitor.name}</p>
                <p className="text-[10px] text-hypr-text-muted">{monitor.width}x{monitor.height}</p>
                <p className="text-[10px] text-hypr-text-muted">{monitor.refreshRate}Hz</p>
              </div>
              {monitor.focused && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-hypr-green rounded-full border-2 border-hypr-surface"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monitor Details & Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monitor Info */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
            <Settings2 size={16} className="text-hypr-accent" />
            Monitor Details
          </h3>
          {currentMonitor && (
            <div className="space-y-3">
              <DetailRow label="Identifier" value={currentMonitor.id} />
              <DetailRow label="Description" value={currentMonitor.description} />
              <DetailRow label="Resolution" value={`${currentMonitor.width}x${currentMonitor.height}`} />
              <DetailRow label="Refresh Rate" value={`${currentMonitor.refreshRate}Hz`} />
              <DetailRow label="Position" value={`x: ${currentMonitor.x}, y: ${currentMonitor.y}`} />
              <DetailRow label="Scale" value={`${currentMonitor.scale}x`} />
              <DetailRow label="Focused" value={currentMonitor.focused ? 'Yes' : 'No'} />
            </div>
          )}

          {/* Hyprland Config Preview */}
          <div className="mt-5">
            <p className="text-xs text-hypr-text-muted mb-2">Hyprland Monitor Config:</p>
            <div className="code-block p-3">
              <code className="text-hypr-green text-xs">
                monitor = {currentMonitor?.id}, {currentMonitor?.width}x{currentMonitor?.height}@{currentMonitor?.refreshRate}, {currentMonitor?.x}x{currentMonitor?.y}, {currentMonitor?.scale}
              </code>
            </div>
          </div>
        </div>

        {/* Wallpaper Assignment */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
            <MonitorIcon size={16} className="text-hypr-green" />
            Wallpaper Assignment
          </h3>
          <p className="text-sm text-hypr-text-dim mb-4">
            Select a wallpaper for <span className="font-mono text-hypr-accent">{currentMonitor?.id}</span>:
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {wallpapers.map(wp => (
              <div
                key={wp.id}
                onClick={() => setAssignedWallpaper(wp.id)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  assignedWallpaper === wp.id
                    ? 'bg-hypr-accent/10 border border-hypr-accent/30'
                    : 'hover:bg-hypr-surface-2 border border-transparent'
                }`}
              >
                <div
                  className="w-12 h-8 rounded flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${wp.color || '#1a1a25'}, ${wp.color || '#1a1a25'}cc)` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-hypr-text truncate">{wp.name}</p>
                  <p className="text-xs text-hypr-text-muted">{wp.type} • {wp.resolution}</p>
                </div>
                {assignedWallpaper === wp.id && (
                  <Check size={16} className="text-hypr-green flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2.5 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Check size={16} />
            Apply to {currentMonitor?.id}
          </button>
        </div>
      </div>

      {/* Hyprpaper IPC Commands */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <h3 className="font-semibold text-hypr-text mb-3">IPC Commands (hyprpaper)</h3>
        <div className="space-y-2">
          <div className="code-block p-3">
            <code className="text-hypr-cyan text-xs">
              <span className="text-hypr-text-muted"># Preload wallpaper</span><br/>
              hyprctl hyprpaper preload "{wallpapers.find(w => w.id === assignedWallpaper)?.path}"
            </code>
          </div>
          <div className="code-block p-3">
            <code className="text-hypr-cyan text-xs">
              <span className="text-hypr-text-muted"># Set wallpaper for monitor</span><br/>
              hyprctl hyprpaper wallpaper "{currentMonitor?.id},{wallpapers.find(w => w.id === assignedWallpaper)?.path}"
            </code>
          </div>
          <div className="code-block p-3">
            <code className="text-hypr-cyan text-xs">
              <span className="text-hypr-text-muted"># Unload wallpaper from memory</span><br/>
              hyprctl hyprpaper unload "{wallpapers.find(w => w.id === assignedWallpaper)?.path}"
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
      <span className="text-sm text-hypr-text-dim">{label}</span>
      <span className="text-sm font-mono text-hypr-text">{value}</span>
    </div>
  );
}
