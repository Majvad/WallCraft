#!/usr/bin/env python3
"""
HyprWall Smart Detector — Intelligent system detection and configuration.

This module automatically detects:
  - Linux distribution
  - Desktop environment
  - GPU hardware (NVIDIA/AMD/Intel)
  - Available tools and backends
  - Optimal configuration based on system capabilities

Usage:
  from smart_detector import SmartDetector
  detector = SmartDetector()
  config = detector.detect_and_configure()
"""

import os
import re
import json
import shutil
import socket
import logging
import subprocess
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field, asdict

logger = logging.getLogger("hyprwall.detector")


# ============================================================
# Data Classes
# ============================================================

@dataclass
class DistributionInfo:
    """Linux distribution information."""
    name: str = "Unknown"
    id: str = "unknown"
    version: str = ""
    pretty_name: str = ""
    package_manager: str = "unknown"
    is_arch_based: bool = False
    is_debian_based: bool = False
    is_fedora_based: bool = False


@dataclass
class GPUInfo:
    """GPU hardware information."""
    vendor: str = "unknown"  # nvidia, amd, intel
    model: str = "Unknown"
    vram: str = ""
    driver: str = ""
    has_cuda: bool = False
    has_vaapi: bool = False
    has_nvenc: bool = False
    acceleration_method: str = "none"  # cuda, vaapi, nvenc, none


@dataclass
class DisplayInfo:
    """Display/monitor information."""
    name: str = ""
    description: str = ""
    width: int = 0
    height: int = 0
    refresh_rate: float = 0
    x: int = 0
    y: int = 0
    scale: float = 1.0
    focused: bool = False


@dataclass
class EnvironmentInfo:
    """Desktop environment information."""
    is_wayland: bool = False
    is_hyprland: bool = False
    is_sway: bool = False
    is_gnome: bool = False
    is_kde: bool = False
    compositor: str = "unknown"
    session_type: str = "unknown"
    display_manager: str = "unknown"


@dataclass
class ToolsInfo:
    """Available tools and their status."""
    hyprpaper: bool = False
    swww: bool = False
    mpv: bool = False
    ffmpeg: bool = False
    imagemagick: bool = False
    hyprctl: bool = False
    swaymsg: bool = False
    wlroots_backend: bool = False


@dataclass
class SystemProfile:
    """Complete system profile."""
    distribution: DistributionInfo = field(default_factory=DistributionInfo)
    gpu: GPUInfo = field(default_factory=GPUInfo)
    displays: list = field(default_factory=list)
    environment: EnvironmentInfo = field(default_factory=EnvironmentInfo)
    tools: ToolsInfo = field(default_factory=ToolsInfo)
    hostname: str = ""
    cpu_model: str = ""
    ram_total: str = ""
    recommended_backend: str = "hyprpaper"
    recommended_profile: str = "default"


# ============================================================
# Smart Detector
# ============================================================

class SmartDetector:
    """Intelligent system detection and configuration."""

    def __init__(self):
        self.profile = SystemProfile()

    def detect_all(self) -> SystemProfile:
        """Run all detection methods and return complete profile."""
        logger.info("Starting system detection...")

        self.profile.hostname = socket.gethostname()
        self._detect_distribution()
        self._detect_environment()
        self._detect_gpu()
        self._detect_displays()
        self._detect_tools()
        self._detect_hardware()
        self._determine_recommendations()

        logger.info(f"Detection complete. Recommended backend: {self.profile.recommended_backend}")
        logger.info(f"Recommended profile: {self.profile.recommended_profile}")

        return self.profile

    def _detect_distribution(self) -> None:
        """Detect Linux distribution from /etc/os-release."""
        os_release_paths = [
            "/etc/os-release",
            "/usr/lib/os-release",
        ]

        dist = self.profile.distribution

        for path in os_release_paths:
            if os.path.exists(path):
                try:
                    with open(path) as f:
                        for line in f:
                            line = line.strip()
                            if "=" not in line:
                                continue
                            key, value = line.split("=", 1)
                            value = value.strip('"').strip("'")

                            if key == "NAME":
                                dist.name = value
                            elif key == "ID":
                                dist.id = value
                            elif key == "VERSION":
                                dist.version = value
                            elif key == "PRETTY_NAME":
                                dist.pretty_name = value

                    # Determine distro family
                    arch_distros = {"arch", "endeavouros", "manjaro", "arcolinux", "garuda", "cachyos"}
                    debian_distros = {"debian", "ubuntu", "pop", "linuxmint", "elementary", "zorin"}
                    fedora_distros = {"fedora", "nobara", "bazzite", "ultramarine"}

                    dist.is_arch_based = dist.id in arch_distros
                    dist.is_debian_based = dist.id in debian_distros
                    dist.is_fedora_based = dist.id in fedora_distros

                    # Determine package manager
                    if dist.is_arch_based:
                        dist.package_manager = "pacman"
                    elif dist.is_debian_based:
                        dist.package_manager = "apt"
                    elif dist.is_fedora_based:
                        dist.package_manager = "dnf"
                    elif dist.id in {"opensuse", "opensuse-tumbleweed", "opensuse-leap"}:
                        dist.package_manager = "zypper"
                    elif dist.id in {"void"}:
                        dist.package_manager = "xbps"

                    logger.info(f"Detected distribution: {dist.pretty_name} ({dist.id})")
                    return

                except Exception as e:
                    logger.warning(f"Failed to read {path}: {e}")

        logger.warning("Could not detect distribution")

    def _detect_environment(self) -> None:
        """Detect desktop environment and session type."""
        env = self.profile.environment

        # Wayland detection
        env.is_wayland = os.environ.get("WAYLAND_DISPLAY") is not None

        # Session type
        env.session_type = os.environ.get("XDG_SESSION_TYPE", "unknown")

        # Hyprland detection
        env.is_hyprland = os.environ.get("HYPRLAND_INSTANCE_SIGNATURE") is not None
        if env.is_hyprland:
            env.compositor = "Hyprland"

        # Sway detection
        if not env.is_hyprland:
            sway_sock = os.environ.get("SWAYSOCK")
            env.is_sway = sway_sock is not None and os.path.exists(sway_sock)
            if env.is_sway:
                env.compositor = "Sway"

        # GNOME detection
        env.is_gnome = os.environ.get("GNOME_DESKTOP_SESSION_ID") is not None or \
                       os.environ.get("XDG_CURRENT_DESKTOP", "").lower() == "gnome"
        if env.is_gnome:
            env.compositor = "GNOME"

        # KDE detection
        env.is_kde = os.environ.get("KDE_FULL_SESSION") is not None or \
                     os.environ.get("XDG_CURRENT_DESKTOP", "").lower() == "kde"
        if env.is_kde:
            env.compositor = "KDE"

        # Display manager detection
        dm_indicators = {
            "sddm": "SDDM",
            "gdm": "GDM",
            "lightdm": "LightDM",
            "lxdm": "LXDM",
        }
        for indicator, name in dm_indicators.items():
            try:
                result = subprocess.run(
                    ["pgrep", "-x", indicator],
                    capture_output=True, timeout=2
                )
                if result.returncode == 0:
                    env.display_manager = name
                    break
            except Exception:
                pass

        logger.info(f"Environment: {env.compositor}, Wayland={env.is_wayland}")

    def _detect_gpu(self) -> None:
        """Detect GPU hardware and capabilities."""
        gpu = self.profile.gpu

        # Try lspci first
        try:
            result = subprocess.run(
                ["lspci", "-nn"],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                for line in result.stdout.splitlines():
                    line_lower = line.lower()
                    if "vga" in line_lower or "3d controller" in line_lower or "display controller" in line_lower:
                        if "nvidia" in line_lower:
                            gpu.vendor = "nvidia"
                            gpu.model = self._extract_gpu_model(line)
                        elif "amd" in line_lower or "radeon" in line_lower or "advanced micro devices" in line_lower:
                            gpu.vendor = "amd"
                            gpu.model = self._extract_gpu_model(line)
                        elif "intel" in line_lower:
                            gpu.vendor = "intel"
                            gpu.model = self._extract_gpu_model(line)
        except Exception as e:
            logger.warning(f"lspci failed: {e}")

        # NVIDIA specific detection
        if gpu.vendor == "nvidia":
            self._detect_nvidia_details(gpu)
        elif gpu.vendor == "amd":
            self._detect_amd_details(gpu)
        elif gpu.vendor == "intel":
            self._detect_intel_details(gpu)

        # Check for CUDA
        gpu.has_cuda = shutil.which("nvcc") is not None or \
                       Path("/usr/lib/libcuda.so").exists() or \
                       Path("/usr/lib64/libcuda.so").exists()

        # Check for VA-API
        vaapi_paths = [
            "/usr/lib/dri",
            "/usr/lib64/dri",
            "/usr/lib/x86_64-linux-gnu/dri",
        ]
        for path in vaapi_paths:
            if os.path.isdir(path):
                gpu.has_vaapi = True
                break

        # Determine acceleration method
        if gpu.vendor == "nvidia" and gpu.has_cuda:
            gpu.acceleration_method = "cuda"
        elif gpu.vendor == "nvidia" and gpu.has_nvenc:
            gpu.acceleration_method = "nvenc"
        elif gpu.has_vaapi:
            gpu.acceleration_method = "vaapi"

        logger.info(f"GPU: {gpu.vendor} {gpu.model}, accel={gpu.acceleration_method}")

    def _extract_gpu_model(self, lspci_line: str) -> str:
        """Extract GPU model name from lspci output."""
        # Remove the PCI ID part [xxxx:xxxx]
        model = re.sub(r'\[.*?\]', '', lspci_line)
        # Remove the device class prefix
        model = re.sub(r'^.*:\s*', '', model)
        # Clean up
        model = model.strip()
        # Take the part after "Corporation" if present
        if "Corporation" in model:
            model = model.split("Corporation")[-1].strip()
        return model[:80]  # Limit length

    def _detect_nvidia_details(self, gpu: GPUInfo) -> None:
        """Get detailed NVIDIA GPU info."""
        try:
            result = subprocess.run(
                ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                parts = [p.strip() for p in result.stdout.strip().split(",")]
                if len(parts) >= 1:
                    gpu.model = parts[0]
                if len(parts) >= 2:
                    gpu.vram = parts[1]
                if len(parts) >= 3:
                    gpu.driver = parts[2]

            # Check NVENC
            result = subprocess.run(
                ["nvidia-smi", "--query-gpu=encoder.capacity", "--format=csv,noheader"],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0 and result.stdout.strip():
                gpu.has_nvenc = True

        except Exception as e:
            logger.warning(f"nvidia-smi failed: {e}")

    def _detect_amd_details(self, gpu: GPUInfo) -> None:
        """Get detailed AMD GPU info."""
        try:
            # Check for AMD driver info
            if os.path.exists("/sys/class/drm/card0/device/gpu_busy_percent"):
                pass  # AMD GPU is active
            gpu.driver = "amdgpu" if os.path.exists("/sys/module/amdgpu") else "radeon"
        except Exception:
            pass

    def _detect_intel_details(self, gpu: GPUInfo) -> None:
        """Get detailed Intel GPU info."""
        try:
            gpu.driver = "i915" if os.path.exists("/sys/module/i915") else "unknown"
        except Exception:
            pass

    def _detect_displays(self) -> None:
        """Detect connected displays via Hyprland or fallback methods."""
        # Try Hyprland IPC
        if self.profile.environment.is_hyprland:
            monitors = self._get_hyprland_monitors()
            if monitors:
                self.profile.displays = monitors
                logger.info(f"Detected {len(monitors)} monitor(s) via Hyprland")
                return

        # Try Sway IPC
        if self.profile.environment.is_sway:
            monitors = self._get_sway_monitors()
            if monitors:
                self.profile.displays = monitors
                logger.info(f"Detected {len(monitors)} monitor(s) via Sway")
                return

        # Fallback: wlr-randr or other tools
        logger.warning("Could not detect displays via compositor IPC")

    def _get_hyprland_monitors(self) -> list:
        """Get monitors from Hyprland IPC."""
        try:
            sig = os.environ.get("HYPRLAND_INSTANCE_SIGNATURE")
            if not sig:
                return []

            sock_path = f"/tmp/hypr/{sig}/.socket.sock"
            if not os.path.exists(sock_path):
                return []

            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as s:
                s.connect(sock_path)
                s.sendall(b"j/monitors")
                data = b""
                while True:
                    chunk = s.recv(4096)
                    if not chunk:
                        break
                    data += chunk

                raw_monitors = json.loads(data.decode())
                monitors = []
                for m in raw_monitors:
                    monitors.append(DisplayInfo(
                        name=m.get("name", ""),
                        description=m.get("description", ""),
                        width=m.get("width", 0),
                        height=m.get("height", 0),
                        refresh_rate=m.get("refreshRate", 0),
                        x=m.get("x", 0),
                        y=m.get("y", 0),
                        scale=m.get("scale", 1.0),
                        focused=m.get("focused", False),
                    ))
                return monitors
        except Exception as e:
            logger.warning(f"Failed to get Hyprland monitors: {e}")
            return []

    def _get_sway_monitors(self) -> list:
        """Get monitors from Sway IPC."""
        try:
            result = subprocess.run(
                ["swaymsg", "-t", "get_outputs", "-r"],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                raw_monitors = json.loads(result.stdout)
                monitors = []
                for m in raw_monitors:
                    if m.get("active", False):
                        monitors.append(DisplayInfo(
                            name=m.get("name", ""),
                            description=m.get("make", "") + " " + m.get("model", ""),
                            width=m.get("current_mode", {}).get("width", 0),
                            height=m.get("current_mode", {}).get("height", 0),
                            refresh_rate=m.get("current_mode", {}).get("refresh", 0),
                            x=m.get("rect", {}).get("x", 0),
                            y=m.get("rect", {}).get("y", 0),
                            scale=m.get("scale", 1.0),
                            focused=m.get("focused", False),
                        ))
                return monitors
        except Exception as e:
            logger.warning(f"Failed to get Sway monitors: {e}")
        return []

    def _detect_tools(self) -> None:
        """Detect available tools."""
        tools = self.profile.tools

        tool_checks = {
            "hyprpaper": "hyprpaper",
            "swww": "swww",
            "mpv": "mpv",
            "ffmpeg": "ffmpeg",
            "hyprctl": "hyprctl",
            "swaymsg": "swaymsg",
        }

        for attr, cmd in tool_checks.items():
            setattr(tools, attr, shutil.which(cmd) is not None)

        # ImageMagick (could be 'magick' or 'convert')
        tools.imagemagick = shutil.which("magick") is not None or \
                           shutil.which("convert") is not None

        # Check if running under wlroots-based compositor
        tools.wlroots_backend = self.profile.environment.is_hyprland or \
                               self.profile.environment.is_sway

        logger.info(f"Tools: hyprpaper={tools.hyprpaper}, swww={tools.swww}, mpv={tools.mpv}")

    def _detect_hardware(self) -> None:
        """Detect CPU and RAM."""
        # CPU
        try:
            with open("/proc/cpuinfo") as f:
                for line in f:
                    if "model name" in line:
                        self.profile.cpu_model = line.split(":")[1].strip()
                        break
        except FileNotFoundError:
            pass

        # RAM
        try:
            with open("/proc/meminfo") as f:
                for line in f:
                    if "MemTotal" in line:
                        kb = int(line.split()[1])
                        gb = kb / (1024 * 1024)
                        self.profile.ram_total = f"{gb:.1f} GB"
                        break
        except FileNotFoundError:
            pass

    def _determine_recommendations(self) -> None:
        """Determine recommended backend and profile based on system."""
        gpu = self.profile.gpu
        tools = self.profile.tools
        env = self.profile.environment

        # Backend recommendation
        if gpu.vendor == "nvidia" and tools.mpv:
            # NVIDIA + mpv = best video support with CUDA
            self.profile.recommended_backend = "mpv"
        elif tools.hyprpaper:
            # hyprpaper is best for static wallpapers on Hyprland
            self.profile.recommended_backend = "hyprpaper"
        elif tools.swww:
            # swww for transitions and animated
            self.profile.recommended_backend = "swww"
        elif tools.mpv:
            # mpv as fallback for video
            self.profile.recommended_backend = "mpv"
        else:
            self.profile.recommended_backend = "none"

        # Profile recommendation
        if gpu.vendor == "nvidia":
            self.profile.recommended_profile = "nvidia"
        elif gpu.vendor == "amd":
            self.profile.recommended_profile = "amd"
        elif gpu.vendor == "intel":
            self.profile.recommended_profile = "intel"
        else:
            self.profile.recommended_profile = "default"

        # Check if laptop (battery present)
        battery_path = Path("/sys/class/power_supply/BAT0")
        if battery_path.exists():
            if self.profile.recommended_profile in ("nvidia", "amd"):
                self.profile.recommended_profile += "-laptop"

    def get_install_commands(self) -> dict:
        """Get package installation commands for the detected distro."""
        dist = self.profile.distribution
        pm = dist.package_manager

        commands = {
            "required": [],
            "optional": [],
            "aur": [],
        }

        if pm == "pacman":
            commands["required"] = ["python", "jq", "curl"]
            commands["optional"] = ["hyprpaper", "swww", "mpv", "ffmpeg", "imagemagick"]
            # swww might be in AUR
            if not self.profile.tools.swww:
                commands["aur"] = ["swww"]
        elif pm == "apt":
            commands["required"] = ["python3", "jq", "curl", "nodejs", "npm"]
            commands["optional"] = ["mpv", "ffmpeg", "imagemagick"]
        elif pm == "dnf":
            commands["required"] = ["python3", "jq", "curl", "nodejs", "npm"]
            commands["optional"] = ["mpv", "ffmpeg", "ImageMagick"]
        elif pm == "zypper":
            commands["required"] = ["python3", "jq", "curl", "nodejs", "npm"]
            commands["optional"] = ["mpv", "ffmpeg", "ImageMagick"]

        return commands

    def get_optimal_config(self) -> dict:
        """Generate optimal configuration based on system detection."""
        gpu = self.profile.gpu
        tools = self.profile.tools
        profile = self.profile.recommended_profile

        config = {
            "general": {
                "backend": self.profile.recommended_backend,
                "auto_start": True,
            },
            "performance": {
                "hw_accel": gpu.acceleration_method != "none",
                "max_cpu": 15,
                "max_gpu": 25,
            },
            "transition": {
                "effect": "fade",
                "duration": 800,
            },
        }

        # Adjust based on profile
        if "laptop" in profile:
            config["performance"]["max_cpu"] = 10
            config["performance"]["max_gpu"] = 15
            config["performance"]["hw_accel"] = True  # Still use HW accel but with lower limits

        if profile == "performance":
            config["performance"]["max_cpu"] = 30
            config["performance"]["max_gpu"] = 50

        if gpu.vendor == "nvidia" and tools.mpv:
            config["performance"]["hw_accel"] = True

        return config

    def to_dict(self) -> dict:
        """Convert profile to dictionary."""
        return {
            "hostname": self.profile.hostname,
            "cpu": self.profile.cpu_model,
            "ram": self.profile.ram_total,
            "distribution": asdict(self.profile.distribution),
            "gpu": asdict(self.profile.gpu),
            "displays": [asdict(d) for d in self.profile.displays],
            "environment": asdict(self.profile.environment),
            "tools": asdict(self.profile.tools),
            "recommended_backend": self.profile.recommended_backend,
            "recommended_profile": self.profile.recommended_profile,
        }


# ============================================================
# CLI Entry Point
# ============================================================

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    detector = SmartDetector()
    profile = detector.detect_all()

    print(json.dumps(detector.to_dict(), indent=2))
    print(f"\nRecommended backend: {profile.recommended_backend}")
    print(f"Recommended profile: {profile.recommended_profile}")
    print(f"\nInstall commands:")
    cmds = detector.get_install_commands()
    for category, packages in cmds.items():
        if packages:
            print(f"  {category}: {' '.join(packages)}")
