# 🛠️ راهنمای رفع اشکال HyprWall

این راهنما به شما کمک می‌کند مشکلات رایج را حل کنید.

---

## 🔍 تست سریع

اولین کار: اجرای اسکریپت تست

```bash
chmod +x test.sh
./test.sh
```

این اسکریپت همه چیز را بررسی می‌کند و مشکلات را نشان می‌دهد.

---

## ❌ مشکلات رایج و راه‌حل‌ها

### مشکل ۱: `hyprwall detect` کار نمی‌کند

**خطا:**
```
[ERROR] Smart detector not found at /usr/local/bin/../backend/smart_detector.py
```

**راه‌حل:**
```bash
# فایل‌ها را دوباره نصب کنید
cd ~/Desktop/hyprwall  # یا هر جایی که clone کردید
sudo install -m 755 bin/hyprwall /usr/local/bin/hyprwall
sudo install -m 755 backend/smart_detector.py /usr/local/lib/hyprwall/smart_detector.py
sudo install -m 755 backend/hyprwall-daemon.py /usr/local/lib/hyprwall/hyprwall-daemon.py

# یا با make
sudo make install
```

**تست:**
```bash
# مستقیم تست کنید
python3 /usr/local/lib/hyprwall/smart_detector.py
```

---

### مشکل ۲: `hyprwall monitors` مانیتورها را نشان نمی‌دهد

**خطا:**
```
No monitors detected (is Hyprland running?)
```

**راه‌حل:**
```bash
# اول hyprctl را تست کنید
hyprctl monitors

# اگر hyprctl کار می‌کند، CLI باید کار کند
# اگر نه، Hyprland را ریستارت کنید
```

**تست مستقیم:**
```bash
hyprctl monitors -j
```

---

### مشکل ۳: Daemon شروع نمی‌شود

**خطا:**
```
Daemon script not found at /usr/local/lib/hyprwall/hyprwall-daemon.py
```

**راه‌حل:**
```bash
# فایل‌ها را نصب کنید
sudo install -m 755 backend/hyprwall-daemon.py /usr/local/lib/hyprwall/
sudo install -m 755 backend/smart_detector.py /usr/local/lib/hyprwall/

# یا کامل
sudo make install-daemon
```

**تست:**
```bash
# مستقیم اجرا کنید
python3 /usr/local/lib/hyprwall/hyprwall-daemon.py
```

---

### مشکل ۴: Web UI باز نمی‌شود

**خطا:**
```
Unable to connect to http://localhost:9520
```

**راه‌حل:**
```bash
# ۱. چک کنید daemon running است
hyprwall status

# ۲. اگر نیست، شروع کنید
hyprwall start

# ۳. پورت را چک کنید
curl http://localhost:9520/api/status

# ۴. اگر کار نمی‌کند، ریستارت کنید
hyprwall restart
```

**لاگ‌ها:**
```bash
cat ~/.local/state/hyprwall/hyprwall.log
```

---

### مشکل ۵: والپیپر تنظیم نمی‌شود

**خطا:**
```
Failed to set wallpaper
```

**راه‌حل:**
```bash
# ۱. چک کنید hyprpaper running است
pgrep hyprpaper

# ۲. اگر نیست، شروع کنید
hyprpaper &

# ۳. مسیر فایل را چک کنید
ls -l ~/Wallpapers/your-image.jpg

# ۴. مسیر کامل بدهید
hyprwall set eDP-1 /home/majvad/Wallpapers/image.jpg
```

**تست مستقیم:**
```bash
hyprctl hyprpaper preload "/path/to/image.jpg"
hyprctl hyprpaper wallpaper "eDP-1,/path/to/image.jpg"
```

---

### مشکل ۶: `git pull` کار نمی‌کند

**خطا:**
```
fatal: couldn't find remote ref main
```

**راه‌حل:**
```bash
# branch را چک کنید
git branch -a

# اگر master است
git pull origin master

# اگر هیچ branch نیست
git fetch --all
git reset --hard origin/main  # یا origin/master
```

---

## 🔧 نصب مجدد کامل

اگر هیچکدام کار نکرد، از اول نصب کنید:

```bash
# ۱. حذف کامل
hyprwall stop
sudo rm -f /usr/local/bin/hyprwall
sudo rm -rf /usr/local/lib/hyprwall
rm -rf ~/.config/hyprwall
rm -rf ~/.cache/hyprwall
rm -rf ~/.local/state/hyprwall

# ۲. نصب مجدد
cd ~/Desktop/hyprwall
sudo make install

# ۳. شروع
hyprwall start

# ۴. تست
./test.sh
```

---

## 📊 چک کردن لاگ‌ها

```bash
# لاگ daemon
cat ~/.local/state/hyprwall/hyprwall.log

# یا با journalctl
journalctl --user -u hyprwall -f

# لاگ hyprpaper
journalctl --user -u hyprpaper -f
```

---

## 🎯 دستورات مفید

```bash
# وضعیت کامل
hyprwall status

# تشخیص سیستم
hyprwall detect

# لیست مانیتورها
hyprwall monitors

# لیست والپیپرها
hyprwall list

# تنظیم والپیپر
hyprwall set eDP-1 /path/to/image.jpg

# والپیپر بعدی
hyprwall next

# باز کردن Web UI
hyprwall ui

# ریستارت daemon
hyprwall restart

# توقف daemon
hyprwall stop
```

---

## 🆘 اگر هنوز مشکل دارید

### اطلاعات را جمع‌آوری کنید:

```bash
# این دستورات را اجرا کنید و خروجی را کپی کنید:
echo "=== System Info ==="
uname -a
echo ""

echo "=== HyprWall Status ==="
hyprwall status
echo ""

echo "=== Hyprland ==="
hyprctl monitors
echo ""

echo "=== Logs ==="
tail -20 ~/.local/state/hyprwall/hyprwall.log
echo ""

echo "=== Files ==="
ls -lh /usr/local/bin/hyprwall
ls -lh /usr/local/lib/hyprwall/
```

### سپس:
1. در GitHub Issue باز کنید: https://github.com/Majvad/hyprwall/issues
2. یا در تلگرام به @Majvad0 پیام دهید

---

## ✅ چک‌لیست نهایی

- [ ] فایل‌ها نصب شده‌اند (`/usr/local/bin/hyprwall`)
- [ ] Daemon running است (`hyprwall status`)
- [ ] Web UI باز می‌شود (`http://localhost:9520`)
- [ ] مانیتورها شناسایی شده‌اند (`hyprwall monitors`)
- [ ] والپیپر تنظیم می‌شود (`hyprwall set`)
- [ ] Smart detection کار می‌کند (`hyprwall detect`)

---

**موفق باشید!** 🚀
