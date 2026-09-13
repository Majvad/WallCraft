# 🚀 راهنمای انتشار در GitHub

این راهنما به شما کمک می‌کند تا پروژه HyprWall را به صورت رسمی در GitHub منتشر کنید.

## 📋 چک‌لیست قبل از انتشار

### 1. آماده‌سازی Repository

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: HyprWall v0.1.0"

# Create GitHub repository
# Go to https://github.com/new
# Repository name: hyprwall
# Description: Professional Wallpaper Manager for Hyprland & Wayland
# Visibility: Public
# DO NOT initialize with README, .gitignore, or license (we already have them)
```

### 2. بروزرسانی اطلاعات در فایل‌ها

قبل از push، این فایل‌ها را ویرایش کنید:

#### README.md
- [ ] تغییر `yourusername` به username واقعی GitHub شما
- [ ] بروزرسانی لینک‌ها
- [ ] اضافه کردن screenshots (اختیاری ولی توصیه شده)

#### CONTRIBUTING.md
- [ ] تغییر `yourusername` به username واقعی
- [ ] بروزرسانی ایمیل تماس

#### SECURITY.md
- [ ] تغییر `your-email@example.com` به ایمیل واقعی شما

#### CODE_OF_CONDUCT.md
- [ ] تغییر `your-email@example.com` به ایمیل واقعی شما

### 3. اضافه کردن Screenshots (توصیه شده)

اسکرین‌شات‌های زیر را بگیرید و در پوشه `assets/` قرار دهید:

```bash
mkdir -p assets/screenshots
```

اسکرین‌شات‌های پیشنهادی:
1. **Dashboard** - نمای کلی سیستم
2. **Smart Detection** - صفحه تشخیص هوشمند
3. **Wallpaper Library** - کتابخانه والپیپرها
4. **Monitor Management** - مدیریت نمایشگرها
5. **CLI in action** - استفاده از خط فرمان

### 4. اضافه کردن Screenshots به README

بعد از آپلود screenshots، این بخش را به README اضافه کنید:

```markdown
## 📸 Screenshots

<div align="center">
  <img src="assets/screenshots/dashboard.png" alt="Dashboard" width="800"/>
  <p><em>Dashboard - System Overview</em></p>
</div>

<div align="center">
  <img src="assets/screenshots/smart-detect.png" alt="Smart Detection" width="800"/>
  <p><em>Smart Detection - AI-powered system analysis</em></p>
</div>
```

### 5. Push به GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/hyprwall.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 6. ایجاد Release

```bash
# Create a tag
git tag -a v0.1.0 -m "HyprWall v0.1.0 - Initial Release"

# Push tag
git push origin v0.1.0
```

سپس در GitHub:
1. به صفحه Releases بروید: `https://github.com/YOUR_USERNAME/hyprwall/releases`
2. روی "Draft a new release" کلیک کنید
3. Tag version: `v0.1.0`
4. Release title: `HyprWall v0.1.0 - Initial Release`
5. توضیحات را از CHANGELOG.md کپی کنید
6. "Publish release" را بزنید

### 7. فعال‌سازی GitHub Pages (اختیاری)

اگر می‌خواهید وب‌سایت پروژه را داشته باشید:

```bash
# Settings > Pages > Source: GitHub Actions
# Workflow را انتخاب کنید
```

### 8. اضافه کردن Topics/Tags

در صفحه repository:
1. روی "About" section کلیک کنید
2. "Edit" را بزنید
3. Topics اضافه کنید:
   - `wallpaper-manager`
   - `hyprland`
   - `wayland`
   - `arch-linux`
   - `linux`
   - `wallpaper`
   - `desktop-customization`

### 9. تنظیمات Repository

در Settings:
- [ ] **General**: توضیحات را وارد کنید
- [ ] **Features**: Issues, Discussions, Wiki را فعال کنید
- [ ] **Branches**: Branch protection rules برای `main`
- [ ] **Actions**: General > Allow all actions

### 10. ایجاد Discussion Categories

در Discussions:
- Announcements
- Ideas
- Q&A
- Show and Tell

---

## 📝 Template برای Release Notes

```markdown
# HyprWall v0.1.0 - Initial Release

## ✨ Features

### Core Features
- 🖼️ Static image wallpapers (hyprpaper)
- 🎬 Video wallpapers (mpv with HW acceleration)
- 🔄 Wallpaper rotation and playlists
- ⏰ Time-based scheduling
- 🖥️ Multi-monitor support
- 🌐 Web-based control panel
- 🔌 CLI and IPC control

### Smart System
- 🧠 Intelligent system detection
- 🎯 Automatic backend selection
- ⚡ Hardware acceleration (CUDA/VA-API)
- 📊 Profile-based configuration

### Supported Systems
- ✅ Arch Linux (primary)
- ✅ Fedora, Ubuntu, Debian
- ✅ NVIDIA, AMD, Intel GPUs
- ✅ Hyprland, Sway

## 📦 Installation

```bash
git clone https://github.com/YOUR_USERNAME/hyprwall.git
cd hyprwall
chmod +x install.sh
./install.sh
```

## 🎯 Quick Start

```bash
# Start daemon
hyprwall start

# Open web UI
hyprwall ui

# Set wallpaper
hyprwall set eDP-1 ~/Wallpapers/image.jpg
```

## 📚 Documentation

- [README](https://github.com/YOUR_USERNAME/hyprwall#readme)
- [Installation Guide](https://github.com/YOUR_USERNAME/hyprwall#-quick-install)
- [Configuration](https://github.com/YOUR_USERNAME/hyprwall#-configuration)
- [Contributing](https://github.com/YOUR_USERNAME/hyprwall/blob/main/CONTRIBUTING.md)

## 🐛 Known Issues

- Smart detection may not work on all systems
- Video wallpapers require mpv backend
- Some transitions only work with swww

## 🙏 Acknowledgments

Thanks to the Hyprland community and all contributors!

---

**Full Changelog**: https://github.com/YOUR_USERNAME/hyprwall/commits/v0.1.0
```

---

## 🎨 Badge های اضافی (اختیاری)

می‌توانید این badge ها را به README اضافه کنید:

```markdown
[![GitHub release](https://img.shields.io/github/v/release/YOUR_USERNAME/hyprwall)](https://github.com/YOUR_USERNAME/hyprwall/releases)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/hyprwall)](https://github.com/YOUR_USERNAME/hyprwall/issues)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/hyprwall)](https://github.com/YOUR_USERNAME/hyprwall/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/hyprwall)](https://github.com/YOUR_USERNAME/hyprwall/network)
```

---

## 📢 Promotion

بعد از انتشار:

1. **Reddit**: پست در r/hyprland, r/archlinux, r/unixporn
2. **Twitter/X**: توییت با هشتگ‌های #Hyprland #Linux #WallpaperManager
3. **Discord**: سرور Hyprland Discord
4. **Arch Linux Forums**: پست در انجمن
5. **Hacker News**: Submit اگر فکر می‌کنید جالب است

---

## ✅ چک‌لیست نهایی

- [ ] تمام فایل‌های ضروری وجود دارند
- [ ] README کامل و حرفه‌ای است
- [ ] LICENSE اضافه شده
- [ ] CONTRIBUTING.md وجود دارد
- [ ] SECURITY.md وجود دارد
- [ ] CODE_OF_CONDUCT.md وجود دارد
- [ ] CHANGELOG.md بروز است
- [ ] .gitignore درست است
- [ ] GitHub Actions CI کار می‌کند
- [ ] Issue و PR templates وجود دارند
- [ ] Screenshots اضافه شده‌اند (اختیاری)
- [ ] Topics/tags اضافه شده‌اند
- [ ] Release ایجاد شده
- [ ] Promote در شبکه‌های اجتماعی

---

## 🎉 تبریک!

پروژه شما آماده انتشار است! موفق باشید! 🚀
