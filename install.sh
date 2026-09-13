#!/usr/bin/env bash
# ============================================================
# HyprWall Installer — Arch Linux + Hyprland
# ============================================================
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BOLD}"
echo "╔══════════════════════════════════════════════╗"
echo "║                                              ║"
echo "║   HyprWall — Wallpaper Manager for Hyprland ║"
echo "║          Installer for Arch Linux            ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================
# Pre-flight checks
# ============================================================

echo -e "${CYAN}[1/6]${NC} Checking environment..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}✗ Do not run as root. Run as your normal user.${NC}"
    exit 1
fi

# Check Arch Linux
if [ ! -f /etc/arch-release ]; then
    echo -e "${YELLOW}⚠ Not running on Arch Linux. Some steps may need adjustment.${NC}"
fi

# Check Wayland
if [ -z "${WAYLAND_DISPLAY:-}" ]; then
    echo -e "${YELLOW}⚠ Not in a Wayland session. Some features may not work.${NC}"
    echo -e "  (You can still install, but run 'hyprwall start' from within Hyprland)"
fi

# Check Hyprland
if [ -z "${HYPRLAND_INSTANCE_SIGNATURE:-}" ]; then
    echo -e "${YELLOW}⚠ Hyprland not detected. Monitor auto-detection may be limited.${NC}"
fi

echo -e "${GREEN}✓${NC} Environment check done"
echo ""

# ============================================================
# Install dependencies
# ============================================================

echo -e "${CYAN}[2/6]${NC} Installing system dependencies..."

# Check what's already installed
NEEDED_PACKAGES=()
OPTIONAL_PACKAGES=()

# Required
command -v python3 &>/dev/null || NEEDED_PACKAGES+=("python")
command -v jq &>/dev/null || NEEDED_PACKAGES+=("jq")
command -v curl &>/dev/null || NEEDED_PACKAGES+=("curl")
command -v npm &>/dev/null || NEEDED_PACKAGES+=("nodejs" "npm")

# Wallpaper backends (at least one needed)
HAS_BACKEND=false
if command -v hyprpaper &>/dev/null; then
    HAS_BACKEND=true
    echo -e "  ${GREEN}✓${NC} hyprpaper (already installed)"
else
    OPTIONAL_PACKAGES+=("hyprpaper")
fi

if command -v swww &>/dev/null; then
    HAS_BACKEND=true
    echo -e "  ${GREEN}✓${NC} swww (already installed)"
else
    OPTIONAL_PACKAGES+=("swww")
fi

if command -v mpv &>/dev/null; then
    echo -e "  ${GREEN}✓${NC} mpv (already installed)"
else
    OPTIONAL_PACKAGES+=("mpv")
fi

# Optional but useful
command -v ffmpeg &>/dev/null || OPTIONAL_PACKAGES+=("ffmpeg")
command -v magick &>/dev/null || command -v convert &>/dev/null || OPTIONAL_PACKAGES+=("imagemagick")

# Install packages
if [ ${#NEEDED_PACKAGES[@]} -gt 0 ]; then
    echo -e "  ${YELLOW}Installing required packages:${NC} ${NEEDED_PACKAGES[*]}"
    sudo pacman -S --needed --noconfirm "${NEEDED_PACKAGES[@]}"
fi

if [ ${#OPTIONAL_PACKAGES[@]} -gt 0 ]; then
    echo ""
    echo -e "  ${CYAN}Install optional packages?${NC} ${OPTIONAL_PACKAGES[*]}"
    echo -e "  (Recommended for full functionality)"
    read -rp "  [Y/n] " answer
    answer=${answer:-Y}
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        # Try AUR packages separately
        AUR_PACKAGES=()
        PACMAN_PACKAGES=()

        for pkg in "${OPTIONAL_PACKAGES[@]}"; do
            case "$pkg" in
                swww)
                    # swww might be in AUR
                    if ! pacman -Si swww &>/dev/null; then
                        AUR_PACKAGES+=("swww")
                    else
                        PACMAN_PACKAGES+=("swww")
                    fi
                    ;;
                *)
                    PACMAN_PACKAGES+=("$pkg")
                    ;;
            esac
        done

        if [ ${#PACMAN_PACKAGES[@]} -gt 0 ]; then
            sudo pacman -S --needed --noconfirm "${PACMAN_PACKAGES[@]}"
        fi

        if [ ${#AUR_PACKAGES[@]} -gt 0 ]; then
            echo -e "  ${YELLOW}AUR packages needed:${NC} ${AUR_PACKAGES[*]}"
            if command -v yay &>/dev/null; then
                yay -S --needed --noconfirm "${AUR_PACKAGES[@]}"
            elif command -v paru &>/dev/null; then
                paru -S --needed --noconfirm "${AUR_PACKAGES[@]}"
            else
                echo -e "  ${YELLOW}⚠ No AUR helper found. Install manually:${NC}"
                for pkg in "${AUR_PACKAGES[@]}"; do
                    echo -e "    yay -S $pkg  OR  paru -S $pkg"
                done
            fi
        fi
    fi
fi

echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# ============================================================
# Build UI
# ============================================================

echo -e "${CYAN}[3/6]${NC} Building web UI..."

if command -v npm &>/dev/null; then
    npm install --silent
    npm run build
    echo -e "${GREEN}✓${NC} UI built successfully"
else
    echo -e "${YELLOW}⚠ npm not found. Skipping UI build.${NC}"
    echo -e "  Install nodejs and npm, then run: npm run build"
fi
echo ""

# ============================================================
# Install files
# ============================================================

echo -e "${CYAN}[4/6]${NC} Installing files..."

# Directories
CFG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/hyprwall"
CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/hyprwall"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/hyprwall"
LIB_DIR="/usr/local/lib/hyprwall"
BIN_DIR="/usr/local/bin"
SYSTEMD_DIR="${HOME}/.config/systemd/user"

mkdir -p "$CFG_DIR" "$CACHE_DIR" "$STATE_DIR" "$SYSTEMD_DIR"

# Daemon
sudo mkdir -p "$LIB_DIR"
sudo install -m 755 backend/hyprwall-daemon.py "$LIB_DIR/hyprwall-daemon.py"
echo -e "  ${GREEN}✓${NC} Daemon: $LIB_DIR/hyprwall-daemon.py"

# CLI
sudo install -m 755 bin/hyprwall "$BIN_DIR/hyprwall"
echo -e "  ${GREEN}✓${NC} CLI: $BIN_DIR/hyprwall"

# Web UI
if [ -d "dist" ]; then
    sudo mkdir -p "$LIB_DIR/ui"
    sudo cp -r dist/* "$LIB_DIR/ui/"
    echo -e "  ${GREEN}✓${NC} Web UI: $LIB_DIR/ui/"
fi

# Config
if [ ! -f "$CFG_DIR/config.toml" ]; then
    cp config/config.toml.example "$CFG_DIR/config.toml"
    echo -e "  ${GREEN}✓${NC} Config: $CFG_DIR/config.toml"
else
    echo -e "  ${GREEN}✓${NC} Config: $CFG_DIR/config.toml (already exists)"
fi

# Systemd
cp systemd/hyprwall.service "$SYSTEMD_DIR/hyprwall.service"
cp systemd/hyprwall-scheduler.timer "$SYSTEMD_DIR/hyprwall-scheduler.timer"
systemctl --user daemon-reload
echo -e "  ${GREEN}✓${NC} Systemd service installed"

echo ""

# ============================================================
# Configure Hyprland
# ============================================================

echo -e "${CYAN}[5/6]${NC} Configuring Hyprland integration..."

HYPRLAND_CONF="${XDG_CONFIG_HOME:-$HOME/.config}/hypr/hyprland.conf"

if [ -f "$HYPRLAND_CONF" ]; then
    if ! grep -q "hyprwall" "$HYPRLAND_CONF"; then
        echo "" >> "$HYPRLAND_CONF"
        echo "# HyprWall — Wallpaper Manager" >> "$HYPRLAND_CONF"
        echo "exec-once = hyprwall start" >> "$HYPRLAND_CONF"
        echo -e "  ${GREEN}✓${NC} Added to $HYPRLAND_CONF"
    else
        echo -e "  ${GREEN}✓${NC} Already configured in $HYPRLAND_CONF"
    fi
else
    echo -e "  ${YELLOW}⚠ Hyprland config not found at $HYPRLAND_CONF${NC}"
    echo -e "  Add manually: exec-once = hyprwall start"
fi

echo ""

# ============================================================
# Create wallpaper directory
# ============================================================

echo -e "${CYAN}[6/6]${NC} Setting up wallpaper directory..."

WP_DIR="$HOME/Wallpapers"
if [ ! -d "$WP_DIR" ]; then
    mkdir -p "$WP_DIR"
    echo -e "  ${GREEN}✓${NC} Created $WP_DIR"
    echo -e "  Put your wallpapers in this directory"
else
    echo -e "  ${GREEN}✓${NC} $WP_DIR already exists"
    wp_count=$(find "$WP_DIR" -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "*.mp4" -o -iname "*.webm" \) 2>/dev/null | wc -l)
    echo -e "  Found $wp_count wallpaper files"
fi

echo ""

# ============================================================
# Done!
# ============================================================

echo -e "${BOLD}${GREEN}"
echo "╔══════════════════════════════════════════════╗"
echo "║          ✓ Installation Complete!            ║"
echo "╠══════════════════════════════════════════════╣"
echo "║                                              ║"
echo "║  Quick Start:                                ║"
echo "║                                              ║"
echo "║  1. Start the daemon:                        ║"
echo "║     $ hyprwall start                         ║"
echo "║                                              ║"
echo "║  2. Open the web UI:                         ║"
echo "║     $ hyprwall ui                            ║"
echo "║                                              ║"
echo "║  3. Set a wallpaper:                         ║"
echo "║     $ hyprwall set eDP-1 ~/Wallpapers/x.jpg  ║"
echo "║                                              ║"
echo "║  4. Or enable auto-start:                    ║"
echo "║     $ systemctl --user enable hyprwall       ║"
echo "║                                              ║"
echo "║  Web UI: http://localhost:9520               ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "  ${CYAN}Useful commands:${NC}"
echo "    hyprwall status       — Check daemon status"
echo "    hyprwall monitors     — List monitors"
echo "    hyprwall list         — List wallpapers"
echo "    hyprwall system       — System information"
echo "    hyprwall next         — Next wallpaper"
echo ""
