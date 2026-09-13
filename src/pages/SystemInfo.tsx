import { systemInfo, backends } from '../data/store';
import {
  Cpu,
  Monitor,
  HardDrive,
  Terminal,
  Shield,
  Layers,
  Check,
  X,
  Copy,
  TerminalSquare,
} from 'lucide-react';

export default function SystemInfo() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">System Information</h2>
          <p className="text-sm text-hypr-text-muted mt-1">Hardware and software environment details</p>
        </div>
        <button
          onClick={() => copyToClipboard(getSystemReport())}
          className="px-4 py-2 bg-hypr-surface-2 border border-hypr-border rounded-lg text-sm text-hypr-text-dim hover:text-hypr-text transition-colors flex items-center gap-2"
        >
          <Copy size={14} />
          Copy Report
        </button>
      </div>

      {/* Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-hypr-accent" />
            <h3 className="font-semibold text-hypr-text">Hardware</h3>
          </div>
          <div className="space-y-3">
            <InfoCard icon={<Cpu size={14} />} label="CPU" value={systemInfo.cpu} detail="14 cores / 20 threads" />
            <InfoCard icon={<Layers size={14} />} label="GPU (Dedicated)" value={systemInfo.gpu} detail="8GB GDDR6 VRAM" />
            <InfoCard icon={<Layers size={14} />} label="GPU (Integrated)" value={systemInfo.integratedGpu} detail="Intel UHD" />
            <InfoCard icon={<HardDrive size={14} />} label="RAM" value={systemInfo.ram} detail="DDR5" />
            <InfoCard icon={<HardDrive size={14} />} label="Storage" value={systemInfo.storage} detail="~98GB root partition" />
            <InfoCard icon={<Monitor size={14} />} label="Display" value={systemInfo.display} detail="Lenovo LOQ 15IRX9" />
          </div>
        </div>

        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={18} className="text-hypr-cyan" />
            <h3 className="font-semibold text-hypr-text">Software</h3>
          </div>
          <div className="space-y-3">
            <InfoCard icon={<Terminal size={14} />} label="OS" value="Arch Linux" detail={systemInfo.kernel} />
            <InfoCard icon={<Shield size={14} />} label="Desktop" value={systemInfo.desktop} detail="Tiling WM" />
            <InfoCard icon={<Layers size={14} />} label="Compositor" value={systemInfo.compositor} detail="Wayland native" />
            <InfoCard icon={<Terminal size={14} />} label="Session" value={systemInfo.session} detail="Display protocol" />
            <InfoCard icon={<TerminalSquare size={14} />} label="Shell" value={systemInfo.shell} detail={`${systemInfo.terminal} terminal`} />
            <InfoCard icon={<Shield size={14} />} label="Display Manager" value={systemInfo.displayManager} detail="Dual-boot with Windows" />
          </div>
        </div>
      </div>

      {/* Capability Check */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
          <Shield size={18} className="text-hypr-green" />
          Capability Detection
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CapabilityBadge label="Wayland" active={systemInfo.wayland} description="Display protocol" />
          <CapabilityBadge label="Hyprland" active={systemInfo.hyprland} description="Compositor" />
          <CapabilityBadge label="NVIDIA" active={systemInfo.nvidia} description="Proprietary driver" />
          <CapabilityBadge label="CUDA" active={systemInfo.cuda} description="GPU computing" />
        </div>
      </div>

      {/* Installed Tools */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
          <Terminal size={18} className="text-hypr-yellow" />
          Installed Tools & Backends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {backends.map(backend => (
            <div key={backend.name} className="flex items-center gap-3 p-3 bg-hypr-surface-2 rounded-lg border border-hypr-border/50">
              <div className={`w-2 h-2 rounded-full ${backend.installed ? 'bg-hypr-green' : 'bg-hypr-red'}`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-hypr-text">{backend.name}</span>
                  {backend.version && <span className="text-xs text-hypr-text-muted">v{backend.version}</span>}
                </div>
                <p className="text-xs text-hypr-text-muted">
                  {backend.running ? 'Running' : backend.installed ? 'Installed (not running)' : 'Not installed'}
                </p>
              </div>
              {backend.installed ? (
                <Check size={16} className="text-hypr-green" />
              ) : (
                <X size={16} className="text-hypr-red" />
              )}
            </div>
          ))}
          {/* Additional tools */}
          <ToolItem name="hyprctl" installed={true} description="Hyprland CLI control" />
          <ToolItem name="ffmpeg" installed={true} description="Media processing" />
          <ToolItem name="magick" installed={true} description="ImageMagick" />
          <ToolItem name="systemd" installed={true} description="Service management" />
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
          <TerminalSquare size={18} className="text-hypr-cyan" />
          Quick Diagnostics
        </h3>
        <div className="space-y-2">
          <CommandBlock command="hyprctl monitors" description="List active monitors" />
          <CommandBlock command="hyprctl hyprpaper listactive" description="List active wallpapers" />
          <CommandBlock command="nvidia-smi" description="NVIDIA GPU status" />
          <CommandBlock command="hyprctl systeminfo" description="Full Hyprland system info" />
          <CommandBlock command="systemctl --user status hyprwall" description="HyprWall service status" />
          <CommandBlock command="journalctl --user -u hyprwall --no-pager -n 20" description="Recent HyprWall logs" />
        </div>
      </div>
    </div>
  );
}

function getSystemReport() {
  return `System Report - HyprWall
========================
CPU: Intel Core i7-13650HX (14C/20T)
GPU: NVIDIA GeForce RTX 4060 Laptop (Max-Q) 8GB
RAM: 24GB DDR5
Display: 1920x1080 @ 144Hz
OS: Arch Linux
Kernel: 7.1.3-arch1-2
Desktop: Hyprland 0.55.4
Session: Wayland
Backend: hyprpaper`;
}

function InfoCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 p-2">
      <span className="text-hypr-text-muted mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-hypr-text-muted">{label}</p>
        <p className="text-sm font-medium text-hypr-text">{value}</p>
        <p className="text-xs text-hypr-text-muted">{detail}</p>
      </div>
    </div>
  );
}

function CapabilityBadge({ label, active, description }: { label: string; active: boolean; description: string }) {
  return (
    <div className={`p-3 rounded-lg border ${active ? 'bg-hypr-green/5 border-hypr-green/30' : 'bg-hypr-surface-2 border-hypr-border'}`}>
      <div className="flex items-center gap-2 mb-1">
        {active ? <Check size={14} className="text-hypr-green" /> : <X size={14} className="text-hypr-red" />}
        <span className={`text-sm font-medium ${active ? 'text-hypr-green' : 'text-hypr-red'}`}>{label}</span>
      </div>
      <p className="text-xs text-hypr-text-muted">{description}</p>
    </div>
  );
}

function ToolItem({ name, installed, description }: { name: string; installed: boolean; description: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-hypr-surface-2 rounded-lg border border-hypr-border/50">
      <div className={`w-2 h-2 rounded-full ${installed ? 'bg-hypr-green' : 'bg-hypr-red'}`}></div>
      <div className="flex-1">
        <span className="text-sm font-medium text-hypr-text">{name}</span>
        <p className="text-xs text-hypr-text-muted">{description}</p>
      </div>
      {installed ? <Check size={16} className="text-hypr-green" /> : <X size={16} className="text-hypr-red" />}
    </div>
  );
}

function CommandBlock({ command, description }: { command: string; description: string }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-hypr-surface-2 rounded-lg group">
      <code className="flex-1 text-xs font-mono text-hypr-cyan">{command}</code>
      <span className="text-xs text-hypr-text-muted">{description}</span>
      <button
        onClick={() => navigator.clipboard.writeText(command)}
        className="p-1 opacity-0 group-hover:opacity-100 text-hypr-text-muted hover:text-hypr-text transition-all"
      >
        <Copy size={12} />
      </button>
    </div>
  );
}
