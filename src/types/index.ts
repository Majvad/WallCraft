// ============================================================
// HyprWall — Type Definitions
// ============================================================

export interface Monitor {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  scale: number;
  focused: boolean;
  currentWallpaper?: Wallpaper;
}

export interface Wallpaper {
  id: string;
  name: string;
  path: string;
  type: 'image' | 'video' | 'animated' | 'shader';
  thumbnail?: string;
  resolution?: string;
  fileSize?: string;
  tags: string[];
  addedAt: string;
  isFavorite: boolean;
  color?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  wallpapers: Wallpaper[];
  mode: 'sequential' | 'random' | 'shuffle';
  interval: number; // seconds
  isActive: boolean;
  createdAt: string;
}

export interface Schedule {
  id: string;
  name: string;
  playlist: Playlist | null;
  wallpaper: Wallpaper | null;
  cronExpression: string;
  timeRange: { start: string; end: string };
  daysOfWeek: number[];
  isActive: boolean;
}

export interface SystemInfo {
  hostname: string;
  kernel: string;
  desktop: string;
  compositor: string;
  session: string;
  shell: string;
  terminal: string;
  displayManager: string;
  cpu: string;
  gpu: string;
  integratedGpu: string;
  vram: string;
  ram: string;
  storage: string;
  display: string;
  wayland: boolean;
  hyprland: boolean;
  nvidia: boolean;
  cuda: boolean;
}

export interface BackendStatus {
  name: string;
  type: 'hyprpaper' | 'mpv' | 'wpaperd' | 'swww' | 'custom';
  installed: boolean;
  running: boolean;
  version?: string;
  capabilities: string[];
}

export interface PerformanceMetrics {
  cpuUsage: number;
  gpuUsage: number;
  memoryUsage: number;
  vramUsage: number;
  fps: number;
  decodeTime: number;
}

export interface AppConfig {
  backend: string;
  cacheDir: string;
  wallpaperDirs: string[];
  autoStart: boolean;
  hardwareAcceleration: boolean;
  maxCpuUsage: number;
  maxGpuUsage: number;
  transitionEffect: string;
  transitionDuration: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export type Page = 'dashboard' | 'library' | 'monitors' | 'playlists' | 'scheduler' | 'settings' | 'system' | 'architecture';
