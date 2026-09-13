# HyprWall — Wallpaper Manager for Hyprland/Wayland

A professional wallpaper manager designed for Arch Linux + Hyprland + Wayland systems.

## Features

- 🖼️ Static image wallpapers (via hyprpaper)
- 🎬 Video wallpapers (via mpv with hardware acceleration)
- 🔄 Wallpaper rotation with playlists
- ⏰ Time-based scheduling (systemd timers)
- 🖥️ Per-monitor wallpaper assignment
- 🎨 Smooth transitions (via swww)
- ⚡ Hardware acceleration (NVIDIA VA-API/CUDA)
- 🌐 Web-based control panel
- 🔌 CLI and IPC control

## System Requirements

- Arch Linux (or Arch-based)
- Hyprland (Wayland compositor)
- One of: hyprpaper, swww, mpv

## Quick Install

```bash
# Clone the repository
git clone https://github.com/your-username/hyprwall.git
cd hyprwall

# Run the installer
chmod +x install.sh
./install.sh
```

## Manual Installation

### 1. Install Dependencies

```bash
# Required (at least one backend)
sudo pacman -S hyprpaper swww mpv ffmpeg imagemagick

# Optional but recommended
sudo pacman -S jq bc python python-flask python-flask-cors
```

### 2. Build the UI

```bash
npm install
npm run build
```

### 3. Install Files

```bash
sudo make install
# or manually:
sudo cp bin/hyprwall /usr/local/bin/
sudo cp bin/hyprwall-daemon /usr/local/bin/
mkdir -p ~/.config/hyprwall
cp config/config.toml.example ~/.config/hyprwall/config.toml
```

### 4. Enable Service

```bash
systemctl --user enable --now hyprwall.service
```

### 5. Add to Hyprland Config

```bash
# Add to ~/.config/hypr/hyprland.conf
exec-once = hyprwall start
```

## Usage

### Web UI

```bash
# Start the web interface
hyprwall ui
# Opens at http://localhost:9520
```

### CLI

```bash
# Set wallpaper for a monitor
hyprwall set eDP-1 /path/to/wallpaper.jpg

# List monitors
hyprwall monitors

# List wallpapers
hyprwall list

# Next wallpaper in playlist
hyprwall next

# Previous wallpaper
hyprwall prev

# Pause/resume rotation
hyprwall pause
hyprwall resume

# Show status
hyprwall status
```

## Configuration

Edit `~/.config/hyprwall/config.toml`:

```toml
[general]
backend = "hyprpaper"
cache_dir = "~/.cache/hyprwall"
auto_start = true

[performance]
hw_accel = true
max_cpu = 15
max_gpu = 25

[transition]
effect = "fade"
duration = 800

[directories]
wallpapers = [
    "~/Wallpapers",
    "~/Pictures/Wallpapers",
    "/usr/share/backgrounds"
]

[logging]
level = "info"
```

## Backend Selection

| Backend  | Static | Video | Transitions | HW Accel | IPC |
|----------|--------|-------|-------------|----------|-----|
| hyprpaper|   ✓    |   ✗   |     ✗       |    ✗     |  ✓  |
| swww     |   ✓    |   ~   |     ✓       |    ~     |  ✓  |
| mpv      |   ✓    |   ✓   |     ✗       |    ✓     |  ✓  |

## Uninstall

```bash
systemctl --user stop hyprwall.service
systemctl --user disable hyprwall.service
sudo rm /usr/local/bin/hyprwall
sudo rm /usr/local/bin/hyprwall-daemon
rm -rf ~/.config/hyprwall
rm -rf ~/.cache/hyprwall
rm -rf ~/.local/state/hyprwall
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  HyprWall — Wallpaper Manager for Hyprland/Wayland         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Web UI  │  │   CLI    │  │   IPC    │  │ Systemd  │   │
│  │ (React)  │  │(hyprwall)│  │(Unix Sock)│  │ (Timers) │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │               │               │               │     │
│       └───────────────┴───────┬───────┴───────────────┘     │
│                               │                             │
│                       ┌───────┴────────┐                    │
│                       │  Core Engine   │                    │
│                       │  (Python/Bash) │                    │
│                       └───────┬────────┘                    │
│                               │                             │
│                    ┌──────────┴──────────┐                  │
│                    │  Backend Abstraction │                  │
│                    └──┬────┬────┬────┬───┘                  │
│                    ┌──┴┐ ┌┴───┐┌┴───┐┌┴────┐               │
│                    │HP │ │SWWW││MPV ││Cust │               │
│                    └───┘ └────┘└────┘└─────┘               │
└─────────────────────────────────────────────────────────────┘
```

## License

MIT
