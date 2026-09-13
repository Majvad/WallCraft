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

echo -e "${CYAN}[1/7]${NC} Running smart system detection..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}✗ Do not run as root. Run as your normal user.${NC}"
    exit 1
fi

# Run Python smart detector if available
if command -v python3 &>/dev/null && [ -f "backend/smart_detector.py" ]; then
    echo -e "  Detecting system configuration..."
    DETECT_OUTPUT=$(python3 backend/smart_detector.py 2>/dev/null || echo "")

    if [ -n "$DETECT_OUTPUT" ]; then
        # Parse detection results
        DISTRO=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['distribution']['pretty_name'])" 2>/dev/null || echo "Unknown")
        GPU_VENDOR=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['gpu']['vendor'])" 2>/dev/null || echo "unknown")
        GPU_MODEL=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['gpu']['model'])" 2>/dev/null || echo "Unknown")
        RECOMMENDED_BACKEND=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['recommended_backend'])" 2>/dev/null || echo "auto")
        RECOMMENDED_PROFILE=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['recommended_profile'])" 2>/dev/null || echo "default")
        IS_WAYLAND=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(str(d['environment']['is_wayland']).lower())" 2>/dev/null || echo "false")
        IS_HYPRLAND=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(str(d['environment']['is_hyprland']).lower())" 2>/dev/null || echo "false")
        COMPOSITOR=$(echo "$DETECT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['environment']['compositor'])" 2>/dev/null || echo "Unknown")

        echo -e "  ${GREEN}✓${NC} Distribution: ${DISTRO}"
        echo -e "  ${GREEN}✓${NC} GPU: ${GPU_VENDOR} ${GPU_MODEL}"
        echo -e "  ${GREEN}✓${NC} Compositor: ${COMPOSITOR}"
        echo -e "  ${GREEN}✓${NC} Recommended backend: ${RECOMMENDED_BACKEND}"
        echo -e "  ${GREEN}✓${NC} Recommended profile: ${RECOMMENDED_PROFILE}"

        # Save detection results for later use
        echo "$DETECT_OUTPUT" > /tmp/hyprwall-detection.json
    else
        echo -e "  ${YELLOW}⚠ Smart detection failed, using fallback${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ Smart detector not available, using basic checks${NC}"
fi

# Fallback checks
if [ -z "${WAYLAND_DISPLAY:-}" ]; then
    echo -e "  ${YELLOW}⚠ Not in a Wayland session. Some features may not work.${NC}"
fi

if [ -z "${HYPRLAND_INSTANCE_SIGNATURE:-}" ]; then
    echo -e "  ${YELLOW}⚠ Hyprland not detected. Monitor auto-detection may be limited.${NC}"
fi

echo ""

# ============================================================
# Install dependencies
# ============================================================

echo -e "${CYAN}[2/7]${NC} Installing system dependencies..."

# Detect package manager
PKG_MANAGER="unknown"
if [ -f /etc/arch-release ] || command -v pacman &>/dev/null; then
    PKG_MANAGER="pacman"
elif command -v apt &>/dev/null; then
    PKG_MANAGER="apt"
elif command -v dnf &>/dev/null; then
    PKG_MANAGER="dnf"
elif command -v zypper &>/dev/null; then
    PKG_MANAGER="zypper"
fi

echo -e "  Package manager: ${PKG_MANAGER}"

# Check what's already installed
NEEDED_PACKAGES=()
OPTIONAL_PACKAGES=()

# Required packages based on distro
if [ "$PKG_MANAGER" = "pacman" ]; then
    command -v python3 &>/dev/null || NEEDED_PACKAGES+=("python")
    command -v jq &>/dev/null || NEEDED_PACKAGES+=("jq")
    command -v curl &>/dev/null || NEEDED_PACKAGES+=("curl")
    command -v npm &>/dev/null || NEEDED_PACKAGES+=("nodejs" "npm")
elif [ "$PKG_MANAGER" = "apt" ]; then
    command -v python3 &>/dev/null || NEEDED_PACKAGES+=("python3")
    command -v jq &>/dev/null || NEEDED_PACKAGES+=("jq")
    command -v curl &>/dev/null || NEEDED_PACKAGES+=("curl")
    command -v npm &>/dev/null || NEEDED_PACKAGES+=("nodejs" "npm")
elif [ "$PKG_MANAGER" = "dnf" ]; then
    command -v python3 &>/dev/null || NEEDED_PACKAGES+=("python3")
    command -v jq &>/dev/null || NEEDED_PACKAGES+=("jq")
    command -v curl &>/dev/null || NEEDED_PACKAGES+=("curl")
    command -v npm &>/dev/null || NEEDED_PACKAGES+=("nodejs" "npm")
elif [ "$PKG_MANAGER" = "zypper" ]; then
    command -v python3 &>/dev/null || NEEDED_PACKAGES+=("python3")
    command -v jq &>/dev/null || NEEDED_PACKAGES+=("jq")
    command -v curl &>/dev/null || NEEDED_PACKAGES+=("curl")
    command -v npm &>/dev/null || NEEDED_PACKAGES+=("nodejs" "npm")
fi

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

echo -e "${CYAN}[3/7]${NC} Building web UI..."

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

echo -e "${CYAN}[4/7]${NC} Installing files..."

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

echo -e "${CYAN}[5/7]${NC} Configuring Hyprland integration..."

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

echo -e "${CYAN}[6/7]${NC} Setting up wallpaper directory..."

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

# ============================================================
# Apply smart configuration
# ============================================================

echo -e "${CYAN}[7/7]${NC} Applying smart configuration..."

if [ -f /tmp/hyprwall-detection.json ] && [ -f "$CFG_DIR/config.toml" ]; then
    # Generate optimized config based on detection
    python3 -c "
import json
import sys

try:
    with open('/tmp/hyprwall-detection.json') as f:
        detection = json.load(f)

    backend = detection.get('recommended_backend', 'auto')
    profile = detection.get('recommended_profile', 'default')
    gpu_vendor = detection.get('gpu', {}).get('vendor', 'unknown')
    accel = detection.get('gpu', {}).get('acceleration_method', 'none')

    # Read existing config
    with open('$CFG_DIR/config.toml', 'r') as f:
        config = f.read()

    # Update backend
    config = config.replace('backend = \"auto\"', f'backend = \"{backend}\"')

    # Update HW accel
    hw_accel = 'true' if accel != 'none' else 'false'
    config = config.replace('hw_accel = true', f'hw_accel = {hw_accel}')

    # Adjust for laptop
    if 'laptop' in profile:
        config = config.replace('max_cpu = 15', 'max_cpu = 10')
        config = config.replace('max_gpu = 25', 'max_gpu = 15')

    # Write updated config
    with open('$CFG_DIR/config.toml', 'w') as f:
        f.write(config)

    print(f'  ✓ Config optimized for: {profile}')
    print(f'  ✓ Backend: {backend}')
    print(f'  ✓ HW Acceleration: {hw_accel}')

except Exception as e:
    print(f'  ⚠ Smart config failed: {e}')
" 2>/dev/null || echo -e "  ${YELLOW}⚠ Smart config generation failed${NC}"

    rm -f /tmp/hyprwall-detection.json
else
    echo -e "  ${YELLOW}⚠ No detection data available, using default config${NC}"
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
