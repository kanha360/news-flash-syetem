# News Flash Overlay System

Professional animated news flash overlay system for streaming with **OBS Studio** and **Prism Live Streaming App**.

## 🚀 Live Demo

**Control Panel:** https://kanha360.github.io/news-flash-syetem/

**Overlay URL:** https://kanha360.github.io/news-flash-syetem/overlay.html

## 📺 How to Use with Prism Live Streaming

### Step 1: Copy the Overlay URL
```
https://kanha360.github.io/news-flash-syetem/overlay.html
```

### Step 2: Add to Prism Live
1. Open **Prism Live Streaming App**
2. In your scene, click **Add Source** → **Web Page**
3. Paste the overlay URL above
4. Set width: **1920** and height: **1080** (or your stream resolution)
5. Click **OK**

### Step 3: Control from Browser
1. Open the control panel in your browser: https://kanha360.github.io/news-flash-syetem/
2. Create flash messages
3. Click "Start Telecast" to broadcast to your stream
4. The overlay will update in real-time in Prism Live

---

## ✨ Features

- ✅ **Flash Message Editor** - Create unlimited flash messages
- ✅ **Customizable Colors** - Font and background colors
- ✅ **Text Alignment** - Left, Center, or Right alignment
- ✅ **Overlay Positioning** - Center, Upper, Lower, or Full Screen
- ✅ **Font Control** - Multiple font families and sizes
- ✅ **Telecast System** - Broadcast to all connected overlays
- ✅ **Real-time Sync** - Cross-tab and cross-device synchronization
- ✅ **Persistent Storage** - All messages saved locally

---

## 🎨 Customization Options

### Text Properties
- **Font Family**: Arial, Segoe UI, Georgia, Times New Roman, Courier New, Impact
- **Font Size**: 16px to 120px
- **Font Color**: Any color (RGB picker)
- **Text Alignment**: Left, Center, Right

### Display Properties
- **Background Color**: Any color (RGB picker)
- **Overlay Location**: Center, Upper, Lower, Full Screen
- **Minimum Lines**: 1+ lines (controls text wrapping)
- **Display Duration**: 2-30+ seconds per flash

---

## 🔄 How It Works

1. **Control Panel** (index.html) - Manage flash messages
2. **Overlay Display** (overlay.html) - Shows messages in streaming software
3. **Broadcast Channel** - Real-time sync via browser BroadcastChannel API
4. **LocalStorage** - Persistent state management

---

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Edge
- Firefox
- Safari

---

## ⚙️ Technical Details

- Pure HTML/CSS/JavaScript (no dependencies)
- Works offline after first load
- Uses BroadcastChannel API for real-time sync
- Responsive design
- Dark theme UI

---

## 🎯 Tips for Best Results

1. **Open Control Panel on a Separate Monitor** - Use your host machine's browser
2. **Keep Overlay URL Static** - This URL won't change
3. **Test Before Going Live** - Preview messages before broadcasting
4. **Use Contrasting Colors** - Ensure readability over your stream background
5. **Position Strategically** - Avoid covering important content

---

## 📝 URL Reference

| Page | URL | Purpose |
|------|-----|---------|
| Control Panel | `https://kanha360.github.io/news-flash-syetem/` | Manage messages & settings |
| Overlay | `https://kanha360.github.io/news-flash-syetem/overlay.html` | Add to streaming software |

---

Created with ❤️ for streamers using Prism Live and OBS Studio