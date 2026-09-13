# WallCraft Makefile
# ==================

PREFIX ?= /usr/local
BINDIR ?= $(PREFIX)/bin
LIBDIR ?= $(PREFIX)/lib/wallcraft
SYSDIR ?= $(HOME)/.config/systemd/user
CFGDIR ?= $(HOME)/.config/wallcraft
CACHEDIR ?= $(HOME)/.cache/wallcraft
STATEDIR ?= $(HOME)/.local/state/wallcraft

.PHONY: all install install-ui install-daemon install-config install-systemd uninstall build clean help

all: build

# Build the web UI
build:
	@echo "Building WallCraft UI..."
	@npm install
	@npm run build
	@echo "Build complete: dist/"

# Install everything
install: install-daemon install-config install-systemd install-ui
	@echo ""
	@echo "╔══════════════════════════════════════════╗"
	@echo "║  WallCraft installed successfully!       ║"
	@echo "╠══════════════════════════════════════════╣"
	@echo "║                                          ║"
	@echo "║  Next steps:                             ║"
	@echo "║  1. systemctl --user start wallcraft     ║"
	@echo "║  2. wallcraft ui                         ║"
	@echo "║  3. Add to hyprland.conf:                ║"
	@echo "║     exec-once = wallcraft start          ║"
	@echo "║                                          ║"
	@echo "╚══════════════════════════════════════════╝"

# Install daemon
install-daemon:
	@echo "Installing daemon..."
	@sudo mkdir -p $(LIBDIR)
	@sudo install -m 755 backend/wallcraft-daemon.py $(LIBDIR)/wallcraft-daemon.py
	@sudo install -m 755 backend/smart_detector.py $(LIBDIR)/smart_detector.py
	@sudo install -m 755 bin/wallcraft $(BINDIR)/wallcraft
	@echo "  Daemon: $(LIBDIR)/wallcraft-daemon.py"
	@echo "  Smart Detector: $(LIBDIR)/smart_detector.py"
	@echo "  CLI:    $(BINDIR)/wallcraft"

# Install config
install-config:
	@echo "Installing config..."
	@mkdir -p $(CFGDIR) $(CACHEDIR) $(STATEDIR)
	@if [ ! -f $(CFGDIR)/config.toml ]; then \
		cp config/config.toml.example $(CFGDIR)/config.toml; \
		echo "  Config: $(CFGDIR)/config.toml (created)"; \
	else \
		echo "  Config: $(CFGDIR)/config.toml (exists, skipped)"; \
	fi

# Install systemd service
install-systemd:
	@echo "Installing systemd service..."
	@mkdir -p $(SYSDIR)
	@cp systemd/wallcraft.service $(SYSDIR)/wallcraft.service
	@cp systemd/wallcraft-scheduler.timer $(SYSDIR)/wallcraft-scheduler.timer
	@systemctl --user daemon-reload
	@echo "  Service: $(SYSDIR)/wallcraft.service"
	@echo "  Timer:   $(SYSDIR)/wallcraft-scheduler.timer"

# Install web UI (serve via daemon)
install-ui:
	@echo "Installing web UI..."
	@sudo mkdir -p $(LIBDIR)/ui
	@sudo cp -r dist/* $(LIBDIR)/ui/
	@echo "  UI: $(LIBDIR)/ui/"

# Uninstall
uninstall:
	@echo "Uninstalling WallCraft..."
	@systemctl --user stop wallcraft.service 2>/dev/null || true
	@systemctl --user disable wallcraft.service 2>/dev/null || true
	@systemctl --user stop wallcraft-scheduler.timer 2>/dev/null || true
	@systemctl --user disable wallcraft-scheduler.timer 2>/dev/null || true
	@sudo rm -f $(BINDIR)/wallcraft
	@sudo rm -rf $(LIBDIR)
	@rm -f $(SYSDIR)/wallcraft.service
	@rm -f $(SYSDIR)/wallcraft-scheduler.timer
	@systemctl --user daemon-reload
	@echo ""
	@echo "WallCraft uninstalled."
	@echo "Config preserved at: $(CFGDIR)"
	@echo "Cache preserved at:  $(CACHEDIR)"
	@echo "To remove completely:"
	@echo "  rm -rf $(CFGDIR) $(CACHEDIR) $(STATEDIR)"

# Clean build artifacts
clean:
	@rm -rf dist node_modules
	@echo "Cleaned."

# Development: run daemon locally
dev:
	@python3 backend/wallcraft-daemon.py --config config/config.toml.example

# Check dependencies
check:
	@echo "Checking dependencies..."
	@echo ""
	@command -v python3 >/dev/null && echo "  ✓ python3" || echo "  ✗ python3 (required)"
	@command -v hyprpaper >/dev/null && echo "  ✓ hyprpaper" || echo "  ○ hyprpaper (optional)"
	@command -v swww >/dev/null && echo "  ✓ swww" || echo "  ○ swww (optional)"
	@command -v mpv >/dev/null && echo "  ✓ mpv" || echo "  ○ mpv (optional)"
	@command -v ffmpeg >/dev/null && echo "  ✓ ffmpeg" || echo "  ○ ffmpeg (optional)"
	@command -v hyprctl >/dev/null && echo "  ✓ hyprctl" || echo "  ✗ hyprctl (required for Hyprland)"
	@command -v npm >/dev/null && echo "  ✓ npm" || echo "  ✗ npm (required for UI build)"
	@echo ""
	@[ -n "$$WAYLAND_DISPLAY" ] && echo "  ✓ Wayland session" || echo "  ✗ Not in Wayland session"
	@[ -n "$$HYPRLAND_INSTANCE_SIGNATURE" ] && echo "  ✓ Hyprland running" || echo "  ✗ Hyprland not detected"
	@command -v nvidia-smi >/dev/null && echo "  ✓ NVIDIA driver" || echo "  ○ NVIDIA not detected"

# Help
help:
	@echo "WallCraft — Wallpaper Manager for Hyprland"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  build          Build the web UI"
	@echo "  install        Install everything (daemon + UI + config + service)"
	@echo "  install-daemon Install daemon and CLI only"
	@echo "  install-ui     Install web UI only"
	@echo "  install-config Install config files only"
	@echo "  install-systemd Install systemd service only"
	@echo "  uninstall      Remove WallCraft"
	@echo "  check          Check dependencies"
	@echo "  dev            Run daemon in development mode"
	@echo "  clean          Clean build artifacts"
	@echo "  help           Show this help"
