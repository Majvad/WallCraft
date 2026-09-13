import {
  GitBranch,
  Box,
  Layers,
  ArrowRight,
  Database,
  Terminal,
  Monitor,
  Zap,
  FileText,
  Shield,
} from 'lucide-react';

export default function Architecture() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-hypr-text">Architecture</h2>
        <p className="text-sm text-hypr-text-muted mt-1">System design, module structure, and backend abstraction</p>
      </div>

      {/* High-Level Architecture */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={18} className="text-hypr-accent" />
          <h3 className="font-semibold text-hypr-text">High-Level Architecture</h3>
        </div>
        <div className="code-block p-5 overflow-x-auto">
          <pre className="text-xs leading-relaxed">
            <code>
              <span className="text-hypr-accent">{'┌─────────────────────────────────────────────────────────────┐'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>  <span className="text-hypr-text font-bold">HyprWall — Wallpaper Manager for Hyprland/Wayland</span>       <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'├─────────────────────────────────────────────────────────────┤'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                                                             <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>  <span className="text-hypr-cyan">┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐</span>  <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>  <span className="text-hypr-cyan">│  Web UI  │  │   CLI    │  │   IPC    │  │ Systemd  │</span>  <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>  <span className="text-hypr-cyan">│ (React)  │  │ (hyprwall│  │ (Unix    │  │ (Timers) │</span>  <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>  <span className="text-hypr-cyan">│          │  │  command)│  │  Socket) │  │          │</span>  <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>  <span className="text-hypr-cyan">└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘</span>  <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>       <span className="text-hypr-yellow">│               │               │               │</span>       <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>       <span className="text-hypr-yellow">└───────────────┴───────┬───────┴───────────────┘</span>       <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                               <span className="text-hypr-yellow">│</span>                           <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">┌───────┴────────┐</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│  Core Engine   │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│                │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│ • WallpaperMgr │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│ • MonitorDetect│</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│ • Scheduler    │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│ • PlaylistMgr  │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│ • ConfigMgr    │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">│ • CacheMgr     │</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                       <span className="text-hypr-green">└───────┬────────┘</span>                   <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                               <span className="text-hypr-text">│</span>                           <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                    <span className="text-hypr-text">┌──────────┴──────────┐</span>                <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                    <span className="text-hypr-text">│  Backend Abstraction │</span>                <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                    <span className="text-hypr-text">└──┬────┬────┬────┬───┘</span>                <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>                  <span className="text-hypr-red">│    │    │    │    │</span>                     <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>              <span className="text-hypr-red">┌───┴┐ ┌┴───┐┌┴───┐┌┴────┐┌┴────┐</span>             <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>              <span className="text-hypr-red">│HP  │ │SWWW││MPV ││WPAPD││Cust │</span>             <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'│'}</span>              <span className="text-hypr-red">└────┘ └────┘└────┘└─────┘└─────┘</span>             <span className="text-hypr-accent">{'│'}</span>{'\n'}
              <span className="text-hypr-accent">{'└─────────────────────────────────────────────────────────────┘'}</span>
            </code>
          </pre>
        </div>
      </div>

      {/* Module Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModuleCard
          icon={<Layers size={18} className="text-hypr-accent" />}
          title="Core Engine"
          description="Central orchestration layer that coordinates all components"
          modules={[
            'WallpaperManager — manages wallpaper lifecycle',
            'MonitorDetector — detects and tracks displays via Hyprland IPC',
            'Scheduler — time-based wallpaper switching',
            'PlaylistManager — rotation and ordering logic',
            'ConfigManager — TOML-based configuration',
            'CacheManager — thumbnail and preview caching',
            'MediaScanner — discovers wallpapers in configured directories',
          ]}
        />

        <ModuleCard
          icon={<Box size={18} className="text-hypr-red" />}
          title="Backend Abstraction"
          description="Pluggable backends for different wallpaper rendering engines"
          modules={[
            'HyprpaperBackend — static images via hyprpaper IPC',
            'SwwwBackend — animated GIFs and transitions via swww',
            'MpvBackend — video wallpapers with HW acceleration',
            'WpaperdBackend — alternative static wallpaper daemon',
            'ShaderBackend — GLSL shader-based wallpapers',
            'CustomBackend — extensible for user-defined renderers',
          ]}
        />

        <ModuleCard
          icon={<Terminal size={18} className="text-hypr-cyan" />}
          title="Interface Layer"
          description="Multiple ways to interact with and control HyprWall"
          modules={[
            'Web UI — React-based control panel (this app)',
            'CLI — hyprwall command for terminal usage',
            'IPC — Unix socket for programmatic control',
            'Systemd — timers for scheduled operations',
            'Hyprland IPC — monitor and workspace events',
            'D-Bus — optional system bus integration',
          ]}
        />

        <ModuleCard
          icon={<Shield size={18} className="text-hypr-green" />}
          title="System Integration"
          description="Deep integration with Arch Linux and Hyprland ecosystem"
          modules={[
            'Wayland-native — no X11 dependencies',
            'Hyprland IPC — hyprctl for monitor/workspace control',
            'NVIDIA — VA-API and CUDA hardware acceleration',
            'systemd user services — auto-start and timers',
            'XDG compliance — proper config/cache/state dirs',
            'Logging — journald integration with structured logs',
          ]}
        />
      </div>

      {/* Data Flow */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight size={18} className="text-hypr-yellow" />
          <h3 className="font-semibold text-hypr-text">Data Flow — Wallpaper Change</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <FlowStep label="Trigger" sublabel="Timer/CLI/UI" />
          <ArrowRight size={14} className="text-hypr-text-muted" />
          <FlowStep label="Scheduler" sublabel="Check active rules" />
          <ArrowRight size={14} className="text-hypr-text-muted" />
          <FlowStep label="WallpaperMgr" sublabel="Select next wallpaper" />
          <ArrowRight size={14} className="text-hypr-text-muted" />
          <FlowStep label="Backend" sublabel="Preload & render" />
          <ArrowRight size={14} className="text-hypr-text-muted" />
          <FlowStep label="Transition" sublabel="Apply effect" />
          <ArrowRight size={14} className="text-hypr-text-muted" />
          <FlowStep label="State" sublabel="Persist & notify" />
        </div>
      </div>

      {/* Backend Comparison */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-hypr-yellow" />
          <h3 className="font-semibold text-hypr-text">Backend Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hypr-border">
                <th className="text-left py-2 px-3 text-hypr-text-dim font-medium">Feature</th>
                <th className="text-center py-2 px-3 text-hypr-text-dim font-medium">hyprpaper</th>
                <th className="text-center py-2 px-3 text-hypr-text-dim font-medium">swww</th>
                <th className="text-center py-2 px-3 text-hypr-text-dim font-medium">mpv</th>
                <th className="text-center py-2 px-3 text-hypr-text-dim font-medium">wpaperd</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-hypr-border/50">
                <td className="py-2 px-3 text-hypr-text">Static Images</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
              </tr>
              <tr className="border-b border-hypr-border/50">
                <td className="py-2 px-3 text-hypr-text">Video Wallpaper</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
                <td className="py-2 px-3 text-center text-hypr-yellow">~</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
              </tr>
              <tr className="border-b border-hypr-border/50">
                <td className="py-2 px-3 text-hypr-text">Transitions</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
              </tr>
              <tr className="border-b border-hypr-border/50">
                <td className="py-2 px-3 text-hypr-text">HW Acceleration</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
                <td className="py-2 px-3 text-center text-hypr-yellow">~</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
              </tr>
              <tr className="border-b border-hypr-border/50">
                <td className="py-2 px-3 text-hypr-text">IPC Control</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-red">✗</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-hypr-text">Multi-monitor</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
                <td className="py-2 px-3 text-center text-hypr-green">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-hypr-text-muted mt-3">
          <span className="text-hypr-green">✓</span> Full support &nbsp;
          <span className="text-hypr-yellow">~</span> Partial/Limited &nbsp;
          <span className="text-hypr-red">✗</span> Not supported
        </p>
      </div>

      {/* Installation */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-hypr-green" />
          <h3 className="font-semibold text-hypr-text">Installation & Setup</h3>
        </div>
        <div className="space-y-3">
          <InstallStep step={1} title="Install dependencies" command="pacman -S hyprpaper swww mpv ffmpeg imagemagick" />
          <InstallStep step={2} title="Clone & build" command="git clone https://github.com/user/hyprwall && cd hyprwall && make install" />
          <InstallStep step={3} title="Create config" command="mkdir -p ~/.config/hyprwall && cp config.toml.example ~/.config/hyprwall/config.toml" />
          <InstallStep step={4} title="Enable service" command="systemctl --user enable --now hyprwall.service" />
          <InstallStep step={5} title="Add to Hyprland" command='exec-once = hyprwall start' />
        </div>
      </div>

      {/* File Structure */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} className="text-hypr-cyan" />
          <h3 className="font-semibold text-hypr-text">Project Structure</h3>
        </div>
        <div className="code-block p-4">
          <pre className="text-xs leading-relaxed">
            <code>
              <span className="text-hypr-text">hyprwall/</span>{'\n'}
              <span className="text-hypr-text-muted">├── </span><span className="text-hypr-cyan">src/</span>{'\n'}
              <span className="text-hypr-text-muted">│   ├── </span><span className="text-hypr-text">core/</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">wallpaper_manager.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">monitor_detector.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">scheduler.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">playlist_manager.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">config_manager.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   └── </span><span className="text-hypr-text">cache_manager.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   ├── </span><span className="text-hypr-text">backends/</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">backend_interface.h</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">hyprpaper_backend.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">swww_backend.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">mpv_backend.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   └── </span><span className="text-hypr-text">shader_backend.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   ├── </span><span className="text-hypr-text">ipc/</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   ├── </span><span className="text-hypr-text">unix_socket.c</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   └── </span><span className="text-hypr-text">protocol.h</span>{'\n'}
              <span className="text-hypr-text-muted">│   ├── </span><span className="text-hypr-text">ui/</span>{'\n'}
              <span className="text-hypr-text-muted">│   │   └── </span><span className="text-hypr-text">(this web application)</span>{'\n'}
              <span className="text-hypr-text-muted">│   └── </span><span className="text-hypr-text">main.c</span>{'\n'}
              <span className="text-hypr-text-muted">├── </span><span className="text-hypr-text">config/</span>{'\n'}
              <span className="text-hypr-text-muted">│   └── </span><span className="text-hypr-text">config.toml.example</span>{'\n'}
              <span className="text-hypr-text-muted">├── </span><span className="text-hypr-text">systemd/</span>{'\n'}
              <span className="text-hypr-text-muted">│   ├── </span><span className="text-hypr-text">hyprwall.service</span>{'\n'}
              <span className="text-hypr-text-muted">│   └── </span><span className="text-hypr-text">hyprwall-scheduler.timer</span>{'\n'}
              <span className="text-hypr-text-muted">├── </span><span className="text-hypr-text">Makefile</span>{'\n'}
              <span className="text-hypr-text-muted">└── </span><span className="text-hypr-text">README.md</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ icon, title, description, modules }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  modules: string[];
}) {
  return (
    <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-semibold text-hypr-text">{title}</h4>
      </div>
      <p className="text-xs text-hypr-text-dim mb-3">{description}</p>
      <ul className="space-y-1.5">
        {modules.map((mod, i) => (
          <li key={i} className="text-xs text-hypr-text-muted flex items-start gap-2">
            <span className="text-hypr-accent mt-0.5">•</span>
            <span>{mod}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowStep({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="px-3 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-center">
      <p className="text-hypr-text font-medium">{label}</p>
      <p className="text-hypr-text-muted text-[10px]">{sublabel}</p>
    </div>
  );
}

function InstallStep({ step, title, command }: { step: number; title: string; command: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-hypr-accent/20 border border-hypr-accent/30 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-hypr-accent">{step}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-hypr-text">{title}</p>
        <div className="code-block p-2 mt-1">
          <code className="text-xs text-hypr-cyan">$ {command}</code>
        </div>
      </div>
    </div>
  );
}
