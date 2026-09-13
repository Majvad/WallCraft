# 🖼️ HyprWall

<div align="center">

**Professional Wallpaper Manager for Hyprland & Wayland**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arch Linux](https://img.shields.io/badge/Arch%20Linux-1793D1?logo=arch-linux&logoColor=white)](https://archlinux.org)
[![Hyprland](https://img.shields.io/badge/Hyprland-00AA99?logo=hyprland&logoColor=white)](https://hyprland.org)
[![Wayland](https://img.shields.io/badge/Wayland-Native-blue)](https://wayland.freedesktop.org)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)](https://www.python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)

[Installation](#-quick-install) • [Features](#-features) • [Usage](#-usage) • [Configuration](#-configuration) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 Wallpaper Management
- **Static Images** — JPG, PNG, WebP, BMP via hyprpaper
- **Video Wallpapers** — MP4, MKV, WebM via mpv with hardware acceleration
- **Animated GIFs** — Via swww backend
- **GLSL Shaders** — Custom shader-based wallpapers
- **Multi-Monitor** — Different wallpaper per display
- **Per-Monitor Control** — Set/unset wallpapers independently

### 🔄 Automation
- **Playlists** — Sequential, random, or shuffle rotation
- **Time-Based Scheduling** — Change wallpapers based on time of day
- **Systemd Integration** — Reliable timers and auto-start
- **Smart Detection** — Auto-configure based on your hardware and distro

### ⚡ Performance
- **Hardware Acceleration** — NVIDIA CUDA/VA-API, AMD VA-API, Intel QuickSync
- **Resource Limits** — Configurable CPU/GPU usage caps
- **Smart Backend Selection** — Automatically chooses the best backend
- **Efficient Caching** — Thumbnail and preview caching

### 🌐 Interface
- **Web UI** — Modern React-based control panel
- **CLI** — Full-featured command-line interface
- **IPC** — Unix socket for programmatic control
- **REST API** — HTTP API on localhost:9520

### 🧠 Smart System
- **Auto-Detection** — Detects distro, hardware, and capabilities
- **Adaptive Configuration** — Adjusts settings based on your system
- **Backend Intelligence** — Selects optimal backend for your use case
- **Profile System** — Pre-configured profiles for common setups

---

## 🚀 Quick Install

### One-Line Install (Arch Linux)

```bash
git clone https://github.com/Majvad/hyprwall.git && cd hyprwall && chmod +x install.sh && ./install.sh
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/Majvad/hyprwall.git
cd hyprwall

# Run the installer
chmod +x install.sh
./install.sh
```

The installer will:
- ✅ Detect your Linux distribution
- ✅ Check hardware (NVIDIA/AMD/Intel)
- ✅ Install required dependencies
- ✅ Build the web UI
- ✅ Configure Hyprland integration
- ✅ Enable systemd services

---

## 📖 Usage

### Start the Daemon

```bash
# Start manually
hyprwall start

# Or enable auto-start
systemctl --user enable --now hyprwall.service
```

### Set a Wallpaper

```bash
# Set wallpaper for laptop display
hyprwall set eDP-1 ~/Wallpapers/image.jpg

# Set for external monitor
hyprwall set HDMI-A-1 ~/Wallpapers/video.mp4
```

### Manage Playlists

```bash
# Next wallpaper in rotation
hyprwall next

# Previous wallpaper
hyprwall prev

# Pause rotation
hyprwall pause

# Resume rotation
hyprwall resume
```

### Web UI

```bash
# Open the web interface
hyprwall ui

# Or visit manually
# http://localhost:9520
```

### CLI Commands

```bash
hyprwall status       # Show daemon status
hyprwall monitors     # List connected monitors
hyprwall list         # List available wallpapers
hyprwall system       # Show system information
hyprwall config       # Show current configuration
hyprwall stop         # Stop the daemon
hyprwall restart      # Restart the daemon
```

---

## ⚙️ Configuration

Configuration file: `~/.config/hyprwall/config.toml`

### Basic Configuration

```toml
[general]
backend = "auto"              # auto, hyprpaper, swww, mpv
cache_dir = "~/.cache/hyprwall"
auto_start = true

[directories]
wallpapers = [
    "~/Wallpapers",
    "~/Pictures/Wallpapers",
]

[transition]
effect = "fade"               # fade, slide, wipe, blur, none
duration = 800                # milliseconds

[performance]
hw_accel = true               # Enable hardware acceleration
max_cpu = 15                  # Max CPU usage %
max_gpu = 25                  # Max GPU usage %
```

### Smart Profiles

HyprWall includes pre-configured profiles for common setups:

```bash
# Use NVIDIA profile (optimized for RTX/GTX cards)
hyprwall profile nvidia

# Use AMD profile (optimized for Radeon cards)
hyprwall profile amd

# Use Intel profile (optimized for integrated graphics)
hyprwall profile intel

# Use low-power profile (laptop on battery)
hyprwall profile laptop

# Use performance profile (desktop, max quality)
hyprwall profile performance
```

### Advanced Configuration

```toml
[scheduler]
enabled = true
check_interval = 300          # Check schedule every 5 minutes

[[schedules]]
name = "Night Mode"
time_start = "20:00"
time_end = "07:00"
playlist = "night-vibes"
days = [0, 1, 2, 3, 4, 5, 6]

[[schedules]]
name = "Work Hours"
time_start = "09:00"
time_end = "17:00"
wallpaper = "~/Wallpapers/minimal.jpg"
days = [1, 2, 3, 4, 5]

[api]
host = "127.0.0.1"
port = 9520

[logging]
level = "info"                # debug, info, warn, error
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HyprWall Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Web UI  │  │   CLI    │  │   IPC    │  │ Systemd  │   │
│  │ (React)  │  │  (Bash)  │  │ (Socket) │  │ (Timers) │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │               │               │               │     │
│       └───────────────┴───────┬───────┴───────────────┘     │
│                               │                             │
│                    ┌──────────┴──────────┐                  │
│                    │   Smart Detector    │                  │
│                    │  (Distro + Hardware)│                  │
│                    └──────────┬──────────┘                  │
│                               │                             │
│                    ┌──────────┴──────────┐                  │
│                    │   Core Engine       │                  │
│                    │  (Python Daemon)    │                  │
│                    └──────────┬──────────┘                  │
│                               │                             │
│              ┌────────────────┼────────────────┐           │
│              │                │                │           │
│        ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐    │
│        │ hyprpaper │   │   swww    │   │    mpv    │    │
│        │  (Static) │   │(Animated) │   │  (Video)  │    │
│        └───────────┘   └───────────┘   └───────────┘    │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Smart Detection System

HyprWall automatically detects and configures:

| Component | Detection | Action |
|-----------|-----------|--------|
| **Distro** | `/etc/os-release` | Package manager selection |
| **GPU** | `lspci`, `nvidia-smi` | Backend & acceleration |
| **Display** | `hyprctl monitors` | Monitor configuration |
| **Desktop** | Environment variables | Integration method |
| **Tools** | `which` command | Backend availability |

### Backend Selection Logic

```python
if NVIDIA_GPU and VIDEO_WALLPAPERS:
    backend = "mpv"  # CUDA acceleration
elif HYPRPAPER_AVAILABLE:
    backend = "hyprpaper"  # Best for static
elif SWWW_AVAILABLE:
    backend = "swww"  # Transitions
else:
    backend = "fallback"  # Basic functionality
```

---

## 🔧 Development

### Prerequisites

```bash
# Arch Linux
sudo pacman -S python nodejs npm git

# Fedora
sudo dnf install python3 nodejs npm git

# Ubuntu/Debian
sudo apt install python3 nodejs npm git
```

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/Majvad/hyprwall.git
cd hyprwall

# Install dependencies
npm install

# Build UI
npm run build

# Run daemon in development mode
make dev
```

### Project Structure

```
hyprwall/
├── backend/
│   └── hyprwall-daemon.py    # Python daemon
├── bin/
│   └── hyprwall              # CLI wrapper
├── src/
│   ├── components/           # React components
│   ├── pages/                # UI pages
│   ├── types/                # TypeScript types
│   └── App.tsx               # Main app
├── config/
│   └── config.toml.example   # Config template
├── systemd/
│   ├── hyprwall.service      # Systemd service
│   └── hyprwall-scheduler.timer
├── install.sh                # Installer script
├── Makefile                  # Build automation
└── README.md                 # This file
```

### Testing

```bash
# Check dependencies
make check

# Run tests (future)
make test

# Lint code
make lint
```

---

## 📦 Supported Systems

### Linux Distributions

| Distro | Status | Notes |
|--------|--------|-------|
| **Arch Linux** | ✅ Full Support | Primary target |
| **EndeavourOS** | ✅ Full Support | Arch-based |
| **Manjaro** | ✅ Full Support | Arch-based |
| **Fedora** | ✅ Supported | Auto-detection |
| **Ubuntu** | ✅ Supported | Auto-detection |
| **Debian** | ✅ Supported | Auto-detection |
| **openSUSE** | ✅ Supported | Auto-detection |

### Hardware

| GPU | Support | Acceleration |
|-----|---------|--------------|
| **NVIDIA** (RTX/GTX) | ✅ Full | CUDA, VA-API |
| **AMD** (Radeon) | ✅ Full | VA-API |
| **Intel** (UHD/Iris) | ✅ Full | QuickSync |

### Desktop Environments

| DE/WM | Support | Notes |
|-------|---------|-------|
| **Hyprland** | ✅ Full | Primary target |
| **Sway** | ✅ Full | Wayland |
| **River** | ✅ Full | Wayland |
| **GNOME** | ⚠️ Limited | Wayland only |
| **KDE** | ⚠️ Limited | Wayland only |

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/hyprwall.git
cd hyprwall

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Hyprland](https://hyprland.org) — For the amazing Wayland compositor
- [hyprpaper](https://github.com/hyprwm/hyprpaper) — For static wallpaper support
- [swww](https://github.com/LGFae/swww) — For animated wallpaper support
- [mpv](https://mpv.io) — For video playback
- The Arch Linux community

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Majvad/hyprwall/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Majvad/hyprwall/discussions)
- **Wiki**: [GitHub Wiki](https://github.com/Majvad/hyprwall/wiki)
- **Telegram**: [@Majvad0](https://t.me/Majvad0)

---

<div align="center">

**Made with ❤️ by [Majvad](https://github.com/Majvad)**

[![Telegram](https://img.shields.io/badge/Telegram-@Majvad0-2CA5E0?style=flat&logo=telegram&logoColor=white)](https://t.me/Majvad0)

⭐ Star this repo if you find it useful!

</div>

---

## 👤 Author

**Majvad**
- Telegram: [@Majvad0](https://t.me/Majvad0)
- GitHub: [@Majvad](https://github.com/Majvad)
