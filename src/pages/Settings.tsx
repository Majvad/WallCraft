import { useState } from 'react';
import { appConfig, backends } from '../data/store';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Folder,
  Zap,
  Palette,
  FileText,
  Plus,
  X,
} from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState(appConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Settings</h2>
          <p className="text-sm text-hypr-text-muted mt-1">Configure HyprWall behavior and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text-dim hover:text-hypr-text transition-colors flex items-center gap-2">
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              saved
                ? 'bg-hypr-green/20 text-hypr-green border border-hypr-green/30'
                : 'bg-hypr-accent hover:bg-hypr-accent-dim text-white'
            }`}
          >
            <Save size={14} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Backend Selection */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-hypr-yellow" />
            <h3 className="font-semibold text-hypr-text">Backend</h3>
          </div>
          <div className="space-y-3">
            {backends.filter(b => b.installed).map(backend => (
              <label
                key={backend.name}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  config.backend === backend.type
                    ? 'bg-hypr-accent/5 border-hypr-accent/30'
                    : 'bg-hypr-surface-2 border-hypr-border hover:border-hypr-text-muted'
                }`}
              >
                <input
                  type="radio"
                  name="backend"
                  value={backend.type}
                  checked={config.backend === backend.type}
                  onChange={() => setConfig({ ...config, backend: backend.type })}
                  className="accent-hypr-accent"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-hypr-text">{backend.name}</span>
                    {backend.running && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-hypr-green/10 text-hypr-green border border-hypr-green/30">running</span>
                    )}
                  </div>
                  <p className="text-xs text-hypr-text-muted mt-0.5">
                    {backend.capabilities.join(' • ')}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-hypr-green" />
            <h3 className="font-semibold text-hypr-text">Performance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-hypr-text-dim">Max CPU Usage</label>
                <span className="text-sm font-mono text-hypr-text">{config.maxCpuUsage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={config.maxCpuUsage}
                onChange={(e) => setConfig({ ...config, maxCpuUsage: parseInt(e.target.value) })}
                className="w-full accent-hypr-accent"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-hypr-text-dim">Max GPU Usage</label>
                <span className="text-sm font-mono text-hypr-text">{config.maxGpuUsage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={config.maxGpuUsage}
                onChange={(e) => setConfig({ ...config, maxGpuUsage: parseInt(e.target.value) })}
                className="w-full accent-hypr-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-hypr-text-dim">Hardware Acceleration</label>
              <button
                onClick={() => setConfig({ ...config, hardwareAcceleration: !config.hardwareAcceleration })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  config.hardwareAcceleration
                    ? 'bg-hypr-green/10 text-hypr-green border border-hypr-green/30'
                    : 'bg-hypr-surface-2 text-hypr-text-muted border border-hypr-border'
                }`}
              >
                {config.hardwareAcceleration ? 'VA-API + CUDA' : 'Disabled'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-hypr-text-dim">Auto-start on Login</label>
              <button
                onClick={() => setConfig({ ...config, autoStart: !config.autoStart })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  config.autoStart
                    ? 'bg-hypr-green/10 text-hypr-green border border-hypr-green/30'
                    : 'bg-hypr-surface-2 text-hypr-text-muted border border-hypr-border'
                }`}
              >
                {config.autoStart ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Transitions */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-hypr-accent" />
            <h3 className="font-semibold text-hypr-text">Transitions</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-hypr-text-dim block mb-1">Effect</label>
              <select
                value={config.transitionEffect}
                onChange={(e) => setConfig({ ...config, transitionEffect: e.target.value })}
                className="w-full px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text focus:outline-none focus:border-hypr-accent/50"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="wipe">Wipe</option>
                <option value="blur">Blur Transition</option>
                <option value="none">None (Instant)</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-hypr-text-dim">Duration</label>
                <span className="text-sm font-mono text-hypr-text">{config.transitionDuration}ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={config.transitionDuration}
                onChange={(e) => setConfig({ ...config, transitionDuration: parseInt(e.target.value) })}
                className="w-full accent-hypr-accent"
              />
            </div>
          </div>
        </div>

        {/* Directories */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Folder size={18} className="text-hypr-cyan" />
            <h3 className="font-semibold text-hypr-text">Directories</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-hypr-text-dim block mb-1">Cache Directory</label>
              <input
                type="text"
                value={config.cacheDir}
                onChange={(e) => setConfig({ ...config, cacheDir: e.target.value })}
                className="w-full px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm font-mono text-hypr-text focus:outline-none focus:border-hypr-accent/50"
              />
            </div>
            <div>
              <label className="text-sm text-hypr-text-dim block mb-2">Wallpaper Directories</label>
              <div className="space-y-1.5">
                {config.wallpaperDirs.map((dir, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={dir}
                      onChange={(e) => {
                        const newDirs = [...config.wallpaperDirs];
                        newDirs[index] = e.target.value;
                        setConfig({ ...config, wallpaperDirs: newDirs });
                      }}
                      className="flex-1 px-3 py-1.5 bg-hypr-surface-2 border border-hypr-border rounded-lg text-xs font-mono text-hypr-text focus:outline-none focus:border-hypr-accent/50"
                    />
                    <button
                      onClick={() => {
                        const newDirs = config.wallpaperDirs.filter((_, i) => i !== index);
                        setConfig({ ...config, wallpaperDirs: newDirs });
                      }}
                      className="p-1.5 text-hypr-text-muted hover:text-hypr-red transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setConfig({ ...config, wallpaperDirs: [...config.wallpaperDirs, '/new/path'] })}
                  className="w-full p-2 border border-dashed border-hypr-border rounded-lg text-xs text-hypr-text-muted hover:border-hypr-accent/50 hover:text-hypr-accent transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={12} />
                  Add Directory
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logging */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-hypr-text-dim" />
            <h3 className="font-semibold text-hypr-text">Logging</h3>
          </div>
          <div>
            <label className="text-sm text-hypr-text-dim block mb-1">Log Level</label>
            <div className="flex gap-1">
              {(['debug', 'info', 'warn', 'error'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setConfig({ ...config, logLevel: level })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    config.logLevel === level
                      ? 'bg-hypr-accent/20 text-hypr-accent-light border border-hypr-accent/30'
                      : 'bg-hypr-surface-2 text-hypr-text-muted border border-hypr-border hover:text-hypr-text'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-xs text-hypr-text-muted mt-2">
              Log file: ~/.local/state/hyprwall/hyprwall.log
            </p>
          </div>
        </div>

        {/* Config File Preview */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-hypr-cyan" />
            <h3 className="font-semibold text-hypr-text">Config File Preview</h3>
          </div>
          <div className="code-block p-4 max-h-[200px] overflow-y-auto">
            <code className="text-xs leading-relaxed">
              <span className="text-hypr-text-muted"># ~/.config/hyprwall/config.toml</span><br/><br/>
              <span className="text-hypr-accent">[general]</span><br/>
              <span className="text-hypr-text">backend = "{config.backend}"</span><br/>
              <span className="text-hypr-text">cache_dir = "{config.cacheDir}"</span><br/>
              <span className="text-hypr-text">auto_start = {config.autoStart}</span><br/><br/>
              <span className="text-hypr-accent">[performance]</span><br/>
              <span className="text-hypr-text">hw_accel = {config.hardwareAcceleration}</span><br/>
              <span className="text-hypr-text">max_cpu = {config.maxCpuUsage}</span><br/>
              <span className="text-hypr-text">max_gpu = {config.maxGpuUsage}</span><br/><br/>
              <span className="text-hypr-accent">[transition]</span><br/>
              <span className="text-hypr-text">effect = "{config.transitionEffect}"</span><br/>
              <span className="text-hypr-text">duration = {config.transitionDuration}</span><br/><br/>
              <span className="text-hypr-accent">[logging]</span><br/>
              <span className="text-hypr-text">level = "{config.logLevel}"</span>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
