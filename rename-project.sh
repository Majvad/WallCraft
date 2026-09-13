#!/usr/bin/env bash
# Rename project from hyprwall to wallcraft
set -euo pipefail

echo "Renaming project from hyprwall to wallcraft..."

# Find and replace in all text files
find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.py" -o -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "Makefile" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -not -path "./dist/*" \
  -exec sed -i 's/hyprwall/wallcraft/g' {} +

# Rename files
if [ -f "bin/hyprwall" ]; then
  mv bin/hyprwall bin/wallcraft
fi

if [ -f "backend/hyprwall-daemon.py" ]; then
  mv backend/hyprwall-daemon.py backend/wallcraft-daemon.py
fi

# Update systemd service names
if [ -f "systemd/hyprwall.service" ]; then
  mv systemd/hyprwall.service systemd/wallcraft.service
fi

if [ -f "systemd/hyprwall-scheduler.timer" ]; then
  mv systemd/hyprwall-scheduler.timer systemd/wallcraft-scheduler.timer
fi

echo "✓ Project renamed to wallcraft!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Commit: git commit -m 'Rename project to wallcraft'"
echo "  3. Push: git push origin main"
