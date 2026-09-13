#!/usr/bin/env python3
"""
HyprWall Daemon — Backend service for wallpaper management on Hyprland/Wayland.

This daemon:
  - Detects the environment (Hyprland, Wayland, available backends)
  - Manages wallpapers via hyprpaper / swww / mpv
  - Exposes a REST API on localhost:9520 for the Web UI
  - Handles scheduling via internal timer or systemd
  - Provides IPC via Unix socket

Usage:
  hyprwall-daemon [--port 9520] [--config ~/.config/hyprwall/config.toml]
"""

import os
import sys
import json
import time
import signal
import shutil
import socket
import logging
import argparse
import threading
import subprocess
from pathlib import Path
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# ============================================================
# Configuration
# ============================================================

DEFAULT_CONFIG = {
    "general": {
        "backend": "auto",
        "cache_dir": os.path.expanduser("~/.cache/hyprwall"),
        "auto_start": True,
    },
    "performance": {
        "hw_accel": True,
        "max_cpu": 15,
        "max_gpu": 25,
    },
    "transition": {
        "effect": "fade",
        "duration": 800,
    },
    "directories": {
        "wallpapers": [
            os.path.expanduser("~/Wallpapers"),
            os.path.expanduser("~/Pictures/Wallpapers"),
            "/usr/share/backgrounds",
        ]
    },
    "logging": {
        "level": "info",
    },
}

# ============================================================
# Logging Setup
# ============================================================

def setup_logging(level_str="info"):
    level = getattr(logging, level_str.upper(), logging.INFO)
    log_dir = Path(os.path.expanduser("~/.local/state/hyprwall"))
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / "hyprwall.log"

    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(sys.stdout),
        ],
    )
    return logging.getLogger("hyprwall")

logger = setup_logging()

# ============================================================
# Environment Detection
# ============================================================

class EnvironmentDetector:
    """Detects the current desktop environment and available tools."""

    @staticmethod
    def is_wayland():
        return os.environ.get("WAYLAND_DISPLAY") is not None

    @staticmethod
    def is_hyprland():
        return os.environ.get("HYPRLAND_INSTANCE_SIGNATURE") is not None

    @staticmethod
    def has_nvidia():
        try:
            result = subprocess.run(
                ["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"],
                capture_output=True, text=True, timeout=5
            )
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False

    @staticmethod
    def has_cuda():
        return shutil.which("nvcc") is not None or Path("/usr/lib/libcuda.so").exists()

    @staticmethod
    def tool_installed(name):
        return shutil.which(name) is not None

    @staticmethod
    def get_hyprland_monitors():
        """Get monitor list from Hyprland IPC."""
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
                monitors = json.loads(data.decode())
                return monitors
        except Exception as e:
            logger.warning(f"Failed to get Hyprland monitors: {e}")
            return []

    @staticmethod
    def get_system_info():
        """Collect system information."""
        info = {
            "wayland": EnvironmentDetector.is_wayland(),
            "hyprland": EnvironmentDetector.is_hyprland(),
            "nvidia": EnvironmentDetector.has_nvidia(),
            "cuda": EnvironmentDetector.has_cuda(),
            "tools": {
                "hyprpaper": EnvironmentDetector.tool_installed("hyprpaper"),
                "swww": EnvironmentDetector.tool_installed("swww"),
                "mpv": EnvironmentDetector.tool_installed("mpv"),
                "ffmpeg": EnvironmentDetector.tool_installed("ffmpeg"),
                "magick": EnvironmentDetector.tool_installed("magick") or EnvironmentDetector.tool_installed("convert"),
                "hyprctl": EnvironmentDetector.tool_installed("hyprctl"),
            },
            "hostname": socket.gethostname(),
        }

        # Get CPU info
        try:
            with open("/proc/cpuinfo") as f:
                for line in f:
                    if "model name" in line:
                        info["cpu"] = line.split(":")[1].strip()
                        break
        except FileNotFoundError:
            info["cpu"] = "Unknown"

        # Get GPU info
        if info["nvidia"]:
            try:
                result = subprocess.run(
                    ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
                    capture_output=True, text=True, timeout=5
                )
                if result.returncode == 0:
                    info["gpu"] = result.stdout.strip()
            except Exception:
                pass

        # Get monitors
        info["monitors"] = EnvironmentDetector.get_hyprland_monitors()

        return info

# ============================================================
# Backend Abstraction
# ============================================================

class WallpaperBackend:
    """Abstract base for wallpaper backends."""

    name = "abstract"

    def set_wallpaper(self, monitor: str, path: str) -> bool:
        raise NotImplementedError

    def preload(self, path: str) -> bool:
        raise NotImplementedError

    def unload(self, path: str) -> bool:
        return True

    def is_running(self) -> bool:
        raise NotImplementedError

    def stop(self):
        pass


class HyprpaperBackend(WallpaperBackend):
    """Backend using hyprpaper for static wallpapers."""

    name = "hyprpaper"

    def _hyprpaper_cmd(self, cmd: str) -> str:
        """Send command to hyprpaper via IPC."""
        try:
            result = subprocess.run(
                ["hyprctl", "hyprpaper", cmd],
                capture_output=True, text=True, timeout=10
            )
            return result.stdout.strip()
        except Exception as e:
            logger.error(f"hyprpaper command failed: {e}")
            return ""

    def preload(self, path: str) -> bool:
        result = self._hyprpaper_cmd(f"preload \"{path}\"")
        logger.info(f"hyprpaper preload {path}: {result}")
        return "ok" in result.lower() or result == ""

    def set_wallpaper(self, monitor: str, path: str) -> bool:
        # Preload first
        self.preload(path)
        time.sleep(0.1)
        result = self._hyprpaper_cmd(f"wallpaper \"{monitor},{path}\"")
        logger.info(f"hyprpaper set {monitor} -> {path}: {result}")
        return True

    def unload(self, path: str) -> bool:
        result = self._hyprpaper_cmd(f"unload \"{path}\"")
        logger.info(f"hyprpaper unload {path}: {result}")
        return True

    def is_running(self) -> bool:
        try:
            result = subprocess.run(
                ["pgrep", "-x", "hyprpaper"],
                capture_output=True, timeout=5
            )
            return result.returncode == 0
        except Exception:
            return False


class SwwwBackend(WallpaperBackend):
    """Backend using swww for wallpapers with transitions."""

    name = "swww"

    def __init__(self, transition="fade", duration=800):
        self.transition = transition
        self.duration = duration

    def set_wallpaper(self, monitor: str, path: str) -> bool:
        try:
            cmd = [
                "swww", "img", path,
                "--outputs", monitor,
                "--transition-type", self.transition,
                "--transition-duration", str(self.duration / 1000),
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            logger.info(f"swww set {monitor} -> {path}: {result.returncode}")
            return result.returncode == 0
        except Exception as e:
            logger.error(f"swww failed: {e}")
            return False

    def preload(self, path: str) -> bool:
        return True  # swww handles this internally

    def is_running(self) -> bool:
        try:
            result = subprocess.run(
                ["pgrep", "-x", "swww-daemon"],
                capture_output=True, timeout=5
            )
            return result.returncode == 0
        except Exception:
            return False

    def stop(self):
        subprocess.run(["swww", "kill"], capture_output=True, timeout=5)


class MpvBackend(WallpaperBackend):
    """Backend using mpv for video wallpapers with hardware acceleration."""

    name = "mpv"

    def __init__(self, hw_accel=True):
        self.hw_accel = hw_accel
        self.processes = {}  # monitor -> subprocess

    def set_wallpaper(self, monitor: str, path: str) -> bool:
        # Stop existing process for this monitor
        if monitor in self.processes:
            self.processes[monitor].terminate()
            del self.processes[monitor]

        # Determine if file is video
        is_video = path.lower().endswith(('.mp4', '.mkv', '.avi', '.webm', '.mov'))

        if not is_video:
            logger.warning(f"mpv backend: {path} is not a video file")
            return False

        try:
            cmd = [
                "mpv",
                "--no-terminal",
                "--loop=inf",
                "--no-border",
                "--no-osc",
                "--no-input-default-bindings",
                "--input-conf=/dev/null",
                "--wid=0",  # Will need wlroots embed
                "--geometry=100%x100%",
            ]

            if self.hw_accel:
                cmd.extend([
                    "--hwdec=auto-safe",
                    "--vo=gpu",
                ])

            cmd.append(path)

            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            self.processes[monitor] = proc
            logger.info(f"mpv started for {monitor}: {path} (pid={proc.pid})")
            return True
        except Exception as e:
            logger.error(f"mpv failed: {e}")
            return False

    def preload(self, path: str) -> bool:
        return True

    def is_running(self) -> bool:
        return len(self.processes) > 0

    def stop(self):
        for monitor, proc in self.processes.items():
            proc.terminate()
        self.processes.clear()


# ============================================================
# Wallpaper Manager (Core)
# ============================================================

class WallpaperManager:
    """Core wallpaper management engine."""

    def __init__(self, config=None):
        self.config = config or DEFAULT_CONFIG
        self.backends = {}
        self.active_backend = None
        self.current_wallpapers = {}  # monitor -> path
        self.playlists = []
        self.active_playlist = None
        self.playlist_index = {}
        self.scheduler_running = False
        self._scheduler_thread = None

        self._init_backends()
        self._select_backend()
        self._scan_wallpapers()

    def _init_backends(self):
        """Initialize available backends."""
        transition = self.config.get("transition", {})

        if EnvironmentDetector.tool_installed("hyprpaper"):
            self.backends["hyprpaper"] = HyprpaperBackend()

        if EnvironmentDetector.tool_installed("swww"):
            self.backends["swww"] = SwwwBackend(
                transition=transition.get("effect", "fade"),
                duration=transition.get("duration", 800),
            )

        if EnvironmentDetector.tool_installed("mpv"):
            hw_accel = self.config.get("performance", {}).get("hw_accel", True)
            self.backends["mpv"] = MpvBackend(hw_accel=hw_accel)

        logger.info(f"Available backends: {list(self.backends.keys())}")

    def _select_backend(self):
        """Select the best available backend."""
        preferred = self.config.get("general", {}).get("backend", "auto")

        if preferred != "auto" and preferred in self.backends:
            self.active_backend = self.backends[preferred]
        else:
            # Auto-select: prefer hyprpaper for static, swww for transitions
            if "hyprpaper" in self.backends:
                self.active_backend = self.backends["hyprpaper"]
            elif "swww" in self.backends:
                self.active_backend = self.backends["swww"]
            elif "mpv" in self.backends:
                self.active_backend = self.backends["mpv"]

        if self.active_backend:
            logger.info(f"Active backend: {self.active_backend.name}")
        else:
            logger.warning("No wallpaper backend available!")

    def _scan_wallpapers(self):
        """Scan configured directories for wallpapers."""
        self.wallpapers = []
        dirs = self.config.get("directories", {}).get("wallpapers", [])
        extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif',
                      '.mp4', '.mkv', '.avi', '.webm', '.mov'}

        for dir_path in dirs:
            dir_path = os.path.expanduser(dir_path)
            if not os.path.isdir(dir_path):
                continue
            try:
                for entry in os.scandir(dir_path):
                    if entry.is_file():
                        ext = os.path.splitext(entry.name)[1].lower()
                        if ext in extensions:
                            wp_type = "video" if ext in {'.mp4', '.mkv', '.avi', '.webm', '.mov'} else "image"
                            self.wallpapers.append({
                                "name": entry.name,
                                "path": entry.path,
                                "type": wp_type,
                                "size": entry.stat().st_size,
                            })
            except PermissionError:
                logger.warning(f"Permission denied: {dir_path}")

        logger.info(f"Found {len(self.wallpapers)} wallpapers")

    def set_wallpaper(self, monitor: str, path: str) -> dict:
        """Set wallpaper for a specific monitor."""
        if not self.active_backend:
            return {"success": False, "error": "No backend available"}

        if not os.path.exists(path):
            return {"success": False, "error": f"File not found: {path}"}

        success = self.active_backend.set_wallpaper(monitor, path)
        if success:
            self.current_wallpapers[monitor] = path

        return {"success": success, "monitor": monitor, "path": path}

    def get_monitors(self) -> list:
        """Get list of connected monitors."""
        monitors = EnvironmentDetector.get_hyprland_monitors()
        # Update current wallpaper info
        for m in monitors:
            m["currentWallpaper"] = self.current_wallpapers.get(m.get("name"), None)
        return monitors

    def get_status(self) -> dict:
        """Get current daemon status."""
        return {
            "backend": self.active_backend.name if self.active_backend else None,
            "backend_running": self.active_backend.is_running() if self.active_backend else False,
            "available_backends": list(self.backends.keys()),
            "current_wallpapers": self.current_wallpapers,
            "wallpaper_count": len(self.wallpapers),
            "scheduler_running": self.scheduler_running,
            "uptime": time.time() - self.start_time if hasattr(self, 'start_time') else 0,
        }

    def next_wallpaper(self, monitor: str = None) -> dict:
        """Switch to next wallpaper (for playlist or random)."""
        if not self.wallpapers:
            return {"success": False, "error": "No wallpapers found"}

        import random
        wp = random.choice(self.wallpapers)

        if monitor:
            return self.set_wallpaper(monitor, wp["path"])
        else:
            # Set for all monitors
            results = []
            monitors = self.get_monitors()
            for m in monitors:
                results.append(self.set_wallpaper(m["name"], wp["path"]))
            return {"success": True, "wallpaper": wp, "results": results}


# ============================================================
# HTTP API Server
# ============================================================

class APIHandler(BaseHTTPRequestHandler):
    """HTTP request handler for the REST API + static files."""

    manager: WallpaperManager = None
    ui_dir: str = "/usr/local/lib/hyprwall/ui"

    # MIME types for static files
    MIME_TYPES = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
    }

    def log_message(self, format, *args):
        logger.debug(f"API: {format % args}")

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())

    def _serve_static(self, file_path: str):
        """Serve a static file from the UI directory."""
        try:
            if not os.path.exists(file_path):
                self._send_error(404, "File not found")
                return

            ext = os.path.splitext(file_path)[1].lower()
            content_type = self.MIME_TYPES.get(ext, 'application/octet-stream')

            with open(file_path, 'rb') as f:
                content = f.read()

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "public, max-age=3600")
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            logger.error(f"Failed to serve {file_path}: {e}")
            self._send_error(500, str(e))

    def _send_error(self, code: int, message: str):
        self.send_response(code)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(f"<h1>{code}</h1><p>{message}</p>".encode())

    def _read_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            return json.loads(self.rfile.read(content_length))
        return {}

    def do_OPTIONS(self):
        self._send_json({})

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # API routes
        if path == "/api/status":
            self._send_json(self.manager.get_status())

        elif path == "/api/monitors":
            self._send_json({"monitors": self.manager.get_monitors()})

        elif path == "/api/wallpapers":
            self._send_json({"wallpapers": self.manager.wallpapers})

        elif path == "/api/system":
            self._send_json(EnvironmentDetector.get_system_info())

        elif path == "/api/config":
            self._send_json(self.manager.config)

        # Static file serving (Web UI)
        elif path == "/" or path == "":
            index_path = os.path.join(self.ui_dir, "index.html")
            self._serve_static(index_path)

        elif path.startswith("/assets/"):
            # Vite built assets
            file_path = os.path.join(self.ui_dir, path.lstrip("/"))
            self._serve_static(file_path)

        else:
            # SPA fallback: serve index.html for all non-API routes
            index_path = os.path.join(self.ui_dir, "index.html")
            if os.path.exists(index_path):
                self._serve_static(index_path)
            else:
                self._send_json({"error": "Not found", "hint": "UI not installed. Run 'make install-ui'"}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._read_body()

        if path == "/api/wallpaper/set":
            monitor = body.get("monitor")
            wp_path = body.get("path")
            if not monitor or not wp_path:
                self._send_json({"error": "monitor and path required"}, 400)
            else:
                result = self.manager.set_wallpaper(monitor, wp_path)
                self._send_json(result)

        elif path == "/api/wallpaper/next":
            monitor = body.get("monitor")
            result = self.manager.next_wallpaper(monitor)
            self._send_json(result)

        else:
            self._send_json({"error": "Not found"}, 404)


# ============================================================
# Main Entry Point
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="HyprWall Daemon")
    parser.add_argument("--port", type=int, default=9520, help="API port (default: 9520)")
    parser.add_argument("--config", type=str, default=None, help="Config file path")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Bind address")
    parser.add_argument("--ui-dir", type=str, default="/usr/local/lib/hyprwall/ui",
                        help="Path to web UI files (default: /usr/local/lib/hyprwall/ui)")
    args = parser.parse_args()

    # Load config
    config = DEFAULT_CONFIG.copy()
    if args.config and os.path.exists(args.config):
        try:
            import tomllib
            with open(args.config, "rb") as f:
                user_config = tomllib.load(f)
                # Merge configs
                for section, values in user_config.items():
                    if section in config and isinstance(config[section], dict):
                        config[section].update(values)
                    else:
                        config[section] = values
        except ImportError:
            logger.warning("tomllib not available, using default config")
        except Exception as e:
            logger.error(f"Failed to load config: {e}")

    # Check environment
    env = EnvironmentDetector.get_system_info()
    logger.info(f"Environment: Wayland={env['wayland']}, Hyprland={env['hyprland']}, NVIDIA={env['nvidia']}")

    if not env["wayland"]:
        logger.warning("Not running under Wayland! Some features may not work.")

    if not env["hyprland"]:
        logger.warning("Hyprland not detected. Monitor detection may be limited.")

    # Initialize manager
    manager = WallpaperManager(config)
    manager.start_time = time.time()

    # Set up API handler
    APIHandler.manager = manager
    APIHandler.ui_dir = args.ui_dir

    # Check if UI directory exists
    if os.path.isdir(args.ui_dir):
        logger.info(f"Serving Web UI from: {args.ui_dir}")
    else:
        logger.warning(f"UI directory not found: {args.ui_dir}")
        logger.info("Run 'make install-ui' to install the web interface")

    # Start HTTP server
    server = HTTPServer((args.host, args.port), APIHandler)
    logger.info(f"HyprWall daemon started on http://{args.host}:{args.port}")
    logger.info(f"Active backend: {manager.active_backend.name if manager.active_backend else 'None'}")
    logger.info(f"Found {len(manager.wallpapers)} wallpapers")
    logger.info(f"Web UI: http://{args.host}:{args.port}")

    # Handle signals
    def shutdown(signum, frame):
        logger.info("Shutting down...")
        server.shutdown()
        if manager.active_backend:
            manager.active_backend.stop()
        sys.exit(0)

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        shutdown(None, None)


if __name__ == "__main__":
    main()
