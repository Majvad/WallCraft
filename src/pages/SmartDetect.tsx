import { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DetectionResult {
  hostname: string;
  cpu: string;
  ram: string;
  distribution: {
    name: string;
    id: string;
    pretty_name: string;
    package_manager: string;
    is_arch_based: boolean;
    is_debian_based: boolean;
    is_fedora_based: boolean;
  };
  gpu: {
    vendor: string;
    model: string;
    vram: string;
    driver: string;
    acceleration_method: string;
    has_cuda: boolean;
    has_vaapi: boolean;
    has_nvenc: boolean;
  };
  environment: {
    is_wayland: boolean;
    is_hyprland: boolean;
    is_sway: boolean;
    compositor: string;
    session_type: string;
  };
  tools: Record<string, boolean>;
  displays: Array<{
    name: string;
    width: number;
    height: number;
    refresh_rate: number;
  }>;
  recommended_backend: string;
  recommended_profile: string;
}

export default function SmartDetect() {
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runDetection = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate detection for demo (in real app, this would call the API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock detection result
      const mockResult: DetectionResult = {
        hostname: 'lenovo-loq',
        cpu: 'Intel Core i7-13650HX',
        ram: '24.0 GB',
        distribution: {
          name: 'Arch Linux',
          id: 'arch',
          pretty_name: 'Arch Linux',
          package_manager: 'pacman',
          is_arch_based: true,
          is_debian_based: false,
          is_fedora_based: false,
        },
        gpu: {
          vendor: 'nvidia',
          model: 'NVIDIA GeForce RTX 4060 Laptop GPU',
          vram: '8 GB',
          driver: '550.54.14',
          acceleration_method: 'cuda',
          has_cuda: true,
          has_vaapi: true,
          has_nvenc: true,
        },
        environment: {
          is_wayland: true,
          is_hyprland: true,
          is_sway: false,
          compositor: 'Hyprland',
          session_type: 'wayland',
        },
        tools: {
          hyprpaper: true,
          swww: true,
          mpv: true,
          ffmpeg: true,
          imagemagick: true,
          hyprctl: true,
        },
        displays: [
          {
            name: 'eDP-1',
            width: 1920,
            height: 1080,
            refresh_rate: 144,
          },
        ],
        recommended_backend: 'mpv',
        recommended_profile: 'nvidia',
      };

      setDetection(mockResult);
    } catch (err) {
      setError('Detection failed. Make sure the daemon is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDetection();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Smart Detection</h2>
          <p className="text-sm text-hypr-text-muted mt-1">Analyzing your system...</p>
        </div>
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-12 flex flex-col items-center justify-center">
          <RefreshCw size={48} className="text-hypr-accent animate-spin mb-4" />
          <p className="text-hypr-text-dim">Detecting system configuration...</p>
          <p className="text-xs text-hypr-text-muted mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Smart Detection</h2>
          <p className="text-sm text-hypr-text-muted mt-1">System analysis failed</p>
        </div>
        <div className="bg-hypr-surface border border-hypr-red/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <X size={24} className="text-hypr-red" />
            <p className="text-hypr-text">{error}</p>
          </div>
          <button
            onClick={runDetection}
            className="px-4 py-2 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors"
          >
            Retry Detection
          </button>
        </div>
      </div>
    );
  }

  if (!detection) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text flex items-center gap-2">
            <Brain size={28} className="text-hypr-accent" />
            Smart Detection
          </h2>
          <p className="text-sm text-hypr-text-muted mt-1">
            Intelligent system analysis and configuration
          </p>
        </div>
        <button
          onClick={runDetection}
          className="px-4 py-2 bg-hypr-surface-2 hover:bg-hypr-surface-3 border border-hypr-border rounded-lg text-sm text-hypr-text-dim transition-colors flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Re-detect
        </button>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-hypr-accent/10 to-hypr-cyan/10 border border-hypr-accent/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-hypr-accent" />
          <h3 className="font-semibold text-hypr-text">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-hypr-surface/50 rounded-lg p-4">
            <p className="text-xs text-hypr-text-muted mb-1">Recommended Backend</p>
            <p className="text-2xl font-bold text-hypr-accent capitalize">{detection.recommended_backend}</p>
            <p className="text-xs text-hypr-text-dim mt-2">
              {detection.recommended_backend === 'mpv' && 'Best for video wallpapers with CUDA acceleration'}
              {detection.recommended_backend === 'hyprpaper' && 'Optimized for static wallpapers on Hyprland'}
              {detection.recommended_backend === 'swww' && 'Great for transitions and animated wallpapers'}
            </p>
          </div>
          <div className="bg-hypr-surface/50 rounded-lg p-4">
            <p className="text-xs text-hypr-text-muted mb-1">Recommended Profile</p>
            <p className="text-2xl font-bold text-hypr-cyan capitalize">{detection.recommended_profile}</p>
            <p className="text-xs text-hypr-text-dim mt-2">
              {detection.recommended_profile.includes('nvidia') && 'Optimized for NVIDIA GPUs with CUDA'}
              {detection.recommended_profile.includes('amd') && 'Optimized for AMD GPUs with VA-API'}
              {detection.recommended_profile.includes('intel') && 'Optimized for Intel integrated graphics'}
              {detection.recommended_profile === 'default' && 'Balanced settings for general use'}
            </p>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribution */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server size={18} className="text-hypr-green" />
            <h3 className="font-semibold text-hypr-text">Distribution</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Name</span>
              <span className="text-sm font-medium text-hypr-text">{detection.distribution.pretty_name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">ID</span>
              <span className="text-sm font-mono text-hypr-text">{detection.distribution.id}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Package Manager</span>
              <span className="text-sm font-mono text-hypr-text">{detection.distribution.package_manager}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-hypr-text-dim">Family</span>
              <span className="text-sm text-hypr-text">
                {detection.distribution.is_arch_based && 'Arch-based'}
                {detection.distribution.is_debian_based && 'Debian-based'}
                {detection.distribution.is_fedora_based && 'Fedora-based'}
                {!detection.distribution.is_arch_based && !detection.distribution.is_debian_based && !detection.distribution.is_fedora_based && 'Other'}
              </span>
            </div>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-hypr-yellow" />
            <h3 className="font-semibold text-hypr-text">GPU</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Vendor</span>
              <span className="text-sm font-medium text-hypr-text capitalize">{detection.gpu.vendor}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Model</span>
              <span className="text-sm text-hypr-text">{detection.gpu.model}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">VRAM</span>
              <span className="text-sm font-mono text-hypr-text">{detection.gpu.vram}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Driver</span>
              <span className="text-sm font-mono text-hypr-text">{detection.gpu.driver}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-hypr-text-dim">Acceleration</span>
              <span className="text-sm font-mono text-hypr-accent uppercase">{detection.gpu.acceleration_method}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {detection.gpu.has_cuda && (
              <span className="text-xs px-2 py-1 rounded bg-hypr-green/10 text-hypr-green border border-hypr-green/30">
                ✓ CUDA
              </span>
            )}
            {detection.gpu.has_vaapi && (
              <span className="text-xs px-2 py-1 rounded bg-hypr-green/10 text-hypr-green border border-hypr-green/30">
                ✓ VA-API
              </span>
            )}
            {detection.gpu.has_nvenc && (
              <span className="text-xs px-2 py-1 rounded bg-hypr-green/10 text-hypr-green border border-hypr-green/30">
                ✓ NVENC
              </span>
            )}
          </div>
        </div>

        {/* Environment */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={18} className="text-hypr-cyan" />
            <h3 className="font-semibold text-hypr-text">Environment</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Compositor</span>
              <span className="text-sm font-medium text-hypr-text">{detection.environment.compositor}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Session Type</span>
              <span className="text-sm font-mono text-hypr-text">{detection.environment.session_type}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-hypr-text-dim">Wayland</span>
              {detection.environment.is_wayland ? (
                <Check size={16} className="text-hypr-green" />
              ) : (
                <X size={16} className="text-hypr-red" />
              )}
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-hypr-text-dim">Hyprland</span>
              {detection.environment.is_hyprland ? (
                <Check size={16} className="text-hypr-green" />
              ) : (
                <X size={16} className="text-hypr-red" />
              )}
            </div>
          </div>
        </div>

        {/* Hardware */}
        <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-hypr-accent" />
            <h3 className="font-semibold text-hypr-text">Hardware</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">Hostname</span>
              <span className="text-sm font-mono text-hypr-text">{detection.hostname}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-hypr-border/50">
              <span className="text-sm text-hypr-text-dim">CPU</span>
              <span className="text-sm text-hypr-text">{detection.cpu}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-hypr-text-dim">RAM</span>
              <span className="text-sm font-mono text-hypr-text">{detection.ram}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Displays */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Monitor size={18} className="text-hypr-cyan" />
          <h3 className="font-semibold text-hypr-text">Displays ({detection.displays.length})</h3>
        </div>
        {detection.displays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {detection.displays.map((display, index) => (
              <div key={index} className="bg-hypr-surface-2 rounded-lg p-4 border border-hypr-border/50">
                <p className="text-sm font-mono font-medium text-hypr-text mb-2">{display.name}</p>
                <p className="text-xs text-hypr-text-dim">
                  {display.width}x{display.height} @ {display.refresh_rate}Hz
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-hypr-text-muted">No displays detected</p>
        )}
      </div>

      {/* Tools */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={18} className="text-hypr-yellow" />
          <h3 className="font-semibold text-hypr-text">Available Tools</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(detection.tools).map(([tool, installed]) => (
            <div
              key={tool}
              className={`flex items-center gap-2 p-3 rounded-lg border ${
                installed
                  ? 'bg-hypr-green/5 border-hypr-green/30'
                  : 'bg-hypr-surface-2 border-hypr-border'
              }`}
            >
              {installed ? (
                <Check size={16} className="text-hypr-green" />
              ) : (
                <X size={16} className="text-hypr-red" />
              )}
              <span className="text-sm font-mono text-hypr-text">{tool}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-hypr-text mb-1">Apply Smart Configuration</h3>
            <p className="text-sm text-hypr-text-dim">
              Automatically configure HyprWall based on detected system
            </p>
          </div>
          <button className="px-6 py-3 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Sparkles size={16} />
            Apply Configuration
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
