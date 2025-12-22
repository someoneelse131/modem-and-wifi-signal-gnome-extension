# Quick Start Guide

Get the Connection Signal Monitor up and running in 3 steps!

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/modem-signal-gnome-extension.git
cd modem-signal-gnome-extension

# 2. Run the installer
./install.sh

# 3. Restart GNOME Shell
# On Wayland: Log out and log back in
# On X11: Alt+F2, type 'r', press Enter

# 4. Enable the extension
gnome-extensions enable modem-signal@custom
```

## What You'll See

The extension **auto-detects** whether you're using WiFi or mobile broadband and shows the appropriate metrics.

### On Mobile Broadband
In your topbar (top-right):
- **📶 18dB** - Icon shows quality, number shows SNR value
- Click to see: Type, Quality, SNR, RSSI, RSRP

### On WiFi
In your topbar (top-right):
- **📶 -39dBm** - Icon shows quality, number shows signal strength
- Click to see: Type (with SSID), Quality, Signal (dBm), Frequency, Device

## Reading the Metrics

| Icon | Meaning |
|------|---------|
| 📶 | Excellent or Good signal |
| 📡 | Fair signal |
| 📉 | Poor signal |

### Mobile Broadband
**Focus on SNR (Signal-to-Noise Ratio)**, not RSSI!
- **≥ 20 dB** = Excellent
- **13-20 dB** = Good
- **0-13 dB** = Fair
- **< 0 dB** = Poor

**Pro tip:** Low RSSI + High SNR = Good connection! The system's "19%" indicator is often wrong.

### WiFi
Signal strength in dBm:
- **≥ -50 dBm** = Excellent
- **-50 to -60 dBm** = Good
- **-60 to -70 dBm** = Fair
- **< -70 dBm** = Poor

## Troubleshooting

**Not showing up?**
```bash
# Check active connections
nmcli connection show --active

# For mobile broadband - check modem
mmcli -L
mmcli -m 0 --signal-setup=5

# Check extension is enabled
gnome-extensions list --enabled | grep modem-signal
```

**Need help?** Check the [full README](README.md) or [open an issue](https://github.com/YOUR-USERNAME/modem-signal-gnome-extension/issues).
