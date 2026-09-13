# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Smart system detection for automatic configuration
- Profile-based configuration (nvidia, amd, intel, laptop, performance)
- Multi-distribution support (Arch, Fedora, Ubuntu, Debian, openSUSE)
- Hardware acceleration detection (CUDA, VA-API, QuickSync)
- GitHub Actions CI/CD pipeline
- Contributing guidelines and code of conduct

### Changed
- Improved installer with better error handling
- Enhanced backend selection algorithm
- Better logging with structured output

### Fixed
- Monitor detection on multi-display setups
- Wayland session detection edge cases

## [0.1.0] - 2025-01-15

### Added
- Initial release
- Web UI with React
- CLI interface
- Daemon with REST API
- Support for hyprpaper, swww, and mpv backends
- Multi-monitor wallpaper management
- Playlist and rotation system
- Time-based scheduling
- Systemd integration
- Hardware acceleration support
- Per-monitor wallpaper assignment
- Configuration via TOML
- IPC via Unix socket

### Features
- 🖼️ Static image wallpapers
- 🎬 Video wallpapers with hardware acceleration
- 🔄 Wallpaper rotation and playlists
- ⏰ Time-based scheduling
- 🖥️ Multi-monitor support
- 🌐 Web-based control panel
- 🔌 CLI and IPC control
- 🧠 Smart system detection

[Unreleased]: https://github.com/yourusername/hyprwall/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/hyprwall/releases/tag/v0.1.0
