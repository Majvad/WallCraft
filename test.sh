#!/usr/bin/env bash
# ============================================================
# HyprWall Quick Test Script
# ============================================================
set -euo pipefail

echo "╔══════════════════════════════════════════════╗"
echo "║      HyprWall Quick Test                     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

pass=0
fail=0

test_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((pass++))
}

test_fail() {
    echo -e "${RED}✗${NC} $1"
    ((fail++))
}

test_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Test 1: Check if files are installed
echo "Testing installation..."
if [ -f "/usr/local/bin/hyprwall" ]; then
    test_pass "CLI installed at /usr/local/bin/hyprwall"
else
    test_fail "CLI not found at /usr/local/bin/hyprwall"
fi

if [ -f "/usr/local/lib/hyprwall/hyprwall-daemon.py" ]; then
    test_pass "Daemon installed at /usr/local/lib/hyprwall/"
else
    test_fail "Daemon not found"
fi

if [ -f "/usr/local/lib/hyprwall/smart_detector.py" ]; then
    test_pass "Smart detector installed"
else
    test_fail "Smart detector not found"
fi

echo ""

# Test 2: Check if daemon is running
echo "Testing daemon..."
if curl -s --connect-timeout 2 http://localhost:9520/api/status >/dev/null 2>&1; then
    test_pass "Daemon is running on port 9520"
else
    test_fail "Daemon is not running"
    echo "  Run: hyprwall start"
fi

echo ""

# Test 3: Test CLI commands
echo "Testing CLI commands..."

if command -v hyprwall &>/dev/null; then
    test_pass "hyprwall command available"
    
    # Test status
    if hyprwall status &>/dev/null; then
        test_pass "hyprwall status works"
    else
        test_fail "hyprwall status failed"
    fi
    
    # Test detect
    if hyprwall detect &>/dev/null; then
        test_pass "hyprwall detect works"
    else
        test_fail "hyprwall detect failed"
    fi
    
    # Test monitors
    if hyprwall monitors &>/dev/null; then
        test_pass "hyprwall monitors works"
    else
        test_fail "hyprwall monitors failed"
    fi
else
    test_fail "hyprwall command not found in PATH"
fi

echo ""

# Test 4: Test direct commands
echo "Testing direct commands..."

if command -v hyprctl &>/dev/null; then
    if hyprctl monitors -j &>/dev/null; then
        test_pass "hyprctl monitors works"
    else
        test_fail "hyprctl monitors failed"
    fi
else
    test_warn "hyprctl not found (not in Hyprland?)"
fi

if command -v python3 &>/dev/null; then
    if python3 /usr/local/lib/hyprwall/smart_detector.py &>/dev/null; then
        test_pass "smart_detector.py works"
    else
        test_fail "smart_detector.py failed"
    fi
else
    test_fail "python3 not found"
fi

echo ""

# Test 5: Test Web UI
echo "Testing Web UI..."
if curl -s --connect-timeout 2 http://localhost:9520/ | grep -q "HyprWall" &>/dev/null; then
    test_pass "Web UI accessible at http://localhost:9520"
else
    test_fail "Web UI not accessible"
fi

echo ""

# Summary
echo "══════════════════════════════════════════════"
echo -e "Tests passed: ${GREEN}${pass}${NC}"
echo -e "Tests failed: ${RED}${fail}${NC}"
echo "══════════════════════════════════════════════"

if [ $fail -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "HyprWall is working correctly!"
    echo ""
    echo "Quick start:"
    echo "  hyprwall status       # Check status"
    echo "  hyprwall monitors     # List monitors"
    echo "  hyprwall list         # List wallpapers"
    echo "  hyprwall ui           # Open web UI"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some tests failed${NC}"
    echo ""
    echo "Try reinstalling:"
    echo "  cd ~/Desktop/hyprwall"
    echo "  sudo make install"
    echo "  hyprwall start"
    echo ""
    exit 1
fi
