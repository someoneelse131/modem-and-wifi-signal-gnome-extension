# Connection Signal Monitor for GNOME Shell

A smart GNOME Shell extension that **auto-detects** your active connection (WiFi or mobile broadband) and displays **accurate** signal metrics in your topbar.

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-45%2B-brightgreen.svg)
![Version](https://img.shields.io/badge/version-2.0-blue.svg)

## Why This Extension?

Your system's default signal indicator can be **very misleading**, especially for mobile broadband. You might see "19% signal" when your connection is actually excellent!

**The Problem:** Default indicators use RSSI (raw signal power), not connection quality. A weak but clean signal performs better than a strong but noisy signal.

**The Solution:**
- For **Mobile Broadband**: Uses **SNR (Signal-to-Noise Ratio)** for accurate quality assessment
- For **WiFi**: Shows real signal strength in dBm with proper quality thresholds
- **Auto-switches** between connection types seamlessly

## Features

✨ **Auto-Detection**: Automatically detects and monitors your active connection
📱 **Mobile Broadband Support**: SNR-based quality (not misleading RSSI percentages)
📶 **WiFi Support**: Real signal strength with quality indicators
🎯 **Accurate Quality Icons**: Shows actual connection performance
📊 **Detailed Metrics**: Click to see comprehensive signal data
⚡ **Real-time Updates**: Refreshes every 5 seconds
🪶 **Lightweight**: Minimal resource usage

## What You'll See

### Mobile Broadband Mode
- **Topbar**: 📶 18dB (icon + SNR value)
- **Popup Menu**:
  - Type: Mobile Broadband
  - Quality: Good
  - SNR: 18 dB
  - RSSI: -104 dBm
  - RSRP: -100 dBm

### WiFi Mode
- **Topbar**: 📶 -39dBm (icon + signal strength)
- **Popup Menu**:
  - Type: WiFi (NetworkName)
  - Quality: Excellent
  - Signal: -39 dBm
  - Frequency: 5745 MHz
  - Device: wlp0s20f3

## Signal Quality Indicators

### Mobile Broadband (SNR-based)

| Icon | Quality | SNR Range | Meaning |
|------|---------|-----------|---------|
| 📶 | Excellent | ≥ 20 dB | Fast, stable connection |
| 📶 | Good | 13-20 dB | Reliable performance |
| 📡 | Fair | 0-13 dB | Usable but slower |
| 📉 | Poor | < 0 dB | Unstable, slow |

### WiFi (Signal strength in dBm)

| Icon | Quality | Signal Range | Meaning |
|------|---------|--------------|---------|
| 📶 | Excellent | ≥ -50 dBm | Strong signal |
| 📶 | Good | -50 to -60 dBm | Reliable connection |
| 📡 | Fair | -60 to -70 dBm | Moderate signal |
| 📉 | Poor | < -70 dBm | Weak signal |

## Understanding Mobile Broadband Metrics

### SNR (Signal-to-Noise Ratio) - **Most Important!**
- The difference between your signal and background noise
- **Best indicator of actual connection quality**
- Higher is better (20+ dB = excellent)

### RSSI (Received Signal Strength Indicator)
- Total received power including noise and interference
- Measured in dBm (negative numbers, closer to 0 = stronger)
- Can be misleading on its own

### RSRP (Reference Signal Received Power)
- Power of the LTE reference signal from the tower
- More accurate than RSSI for LTE connections
- Also measured in dBm

**Example:** RSSI of -104 dBm (appears weak, "19%") + SNR of 18 dB (good) = Actually a good, stable connection!

## Requirements

- GNOME Shell 45 or later (tested on GNOME 49)
- NetworkManager (standard on most Linux systems)
- For mobile broadband: ModemManager (usually pre-installed)
- For WiFi: `iw` tool and standard WiFi drivers (iw is usually pre-installed)

## Installation

### Method 1: Automated Installation (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/someoneelse131/modem-and-wifi-signal-gnome-extension.git
   cd modem-and-wifi-signal-gnome-extension
   ```

2. **Run the installation script:**
   ```bash
   ./install.sh
   ```

3. **Restart GNOME Shell:**
   - On **X11**: Press `Alt+F2`, type `r`, press Enter
   - On **Wayland**: Log out and log back in

4. **Enable the extension:**
   ```bash
   gnome-extensions enable modem-signal@custom
   ```

### Method 2: Manual Installation

1. **Copy the extension:**
   ```bash
   cp -r modem-signal@custom ~/.local/share/gnome-shell/extensions/
   ```

2. **Restart GNOME Shell** (see above)

3. **Enable the extension:**
   ```bash
   gnome-extensions enable modem-signal@custom
   ```

## Uninstallation

```bash
gnome-extensions disable modem-signal@custom
rm -rf ~/.local/share/gnome-shell/extensions/modem-signal@custom
```

## Troubleshooting

### Extension doesn't appear after installation

**For Mobile Broadband:**
1. Check if ModemManager is running:
   ```bash
   systemctl status ModemManager
   ```

2. Verify your modem is detected:
   ```bash
   mmcli -L
   ```

3. Enable signal monitoring:
   ```bash
   mmcli -m 0 --signal-setup=5
   ```

**For WiFi:**
1. Check if NetworkManager is running:
   ```bash
   systemctl status NetworkManager
   ```

2. Verify WiFi is active:
   ```bash
   nmcli device status
   ```

### Shows "No Active Connection"

- Make sure you're connected to either WiFi or mobile broadband
- Check that the connection is actually active with `nmcli connection show --active`

### Mobile broadband: Modem not at index 0

If your modem is not at index 0:

1. Find your modem index:
   ```bash
   mmcli -L
   ```

2. Edit the extension:
   ```bash
   nano ~/.local/share/gnome-shell/extensions/modem-signal@custom/extension.js
   ```

3. Change line 152 from `mmcli -m 0` to `mmcli -m YOUR_INDEX`

### Check Extension Logs

```bash
journalctl /usr/bin/gnome-shell -f | grep -i "signal\|error"
```

## How It Works

The extension automatically:
1. Detects your active connection type (WiFi or mobile broadband)
2. Uses the appropriate monitoring method:
   - **WiFi**: `iw` for signal strength in dBm and `nmcli` for network info
   - **Mobile Broadband**: `mmcli` (ModemManager) for SNR/RSSI/RSRP
3. Updates the topbar icon and value every 5 seconds
4. Switches seamlessly when you change connections

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Credits

Created to solve the problem of misleading signal indicators on Linux systems, especially for mobile broadband connections.

## Support

If you encounter issues or have suggestions, please [open an issue](https://github.com/someoneelse131/modem-and-wifi-signal-gnome-extension/issues) on GitHub.
