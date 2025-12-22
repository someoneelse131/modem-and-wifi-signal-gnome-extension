#!/bin/bash
# Installation script for Modem Signal Monitor GNOME Extension

set -e

echo "Installing Modem Signal Monitor GNOME Extension..."

# Define paths
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions"
EXTENSION_UUID="modem-signal@custom"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$EXTENSION_UUID"

# Check if ModemManager is available
if ! command -v mmcli &> /dev/null; then
    echo "Warning: mmcli (ModemManager) not found. This extension requires ModemManager."
    echo "Install it with: sudo apt install modemmanager (Ubuntu/Debian)"
    echo "               or: sudo dnf install ModemManager (Fedora)"
    exit 1
fi

# Check if modem is detected
echo "Checking for modem..."
if ! mmcli -L &> /dev/null; then
    echo "Warning: No modem detected by ModemManager."
    echo "Make sure your mobile broadband device is connected."
fi

# Create extensions directory if it doesn't exist
mkdir -p "$EXTENSION_DIR"

# Copy extension files
echo "Copying extension files to $EXTENSION_DIR/$EXTENSION_UUID..."
cp -r "$SOURCE_DIR" "$EXTENSION_DIR/"

# Enable signal monitoring
echo "Enabling signal monitoring..."
mmcli -m 0 --signal-setup=5 2>/dev/null || echo "Note: Run 'mmcli -m 0 --signal-setup=5' after your modem is connected"

echo ""
echo "Installation complete!"
echo ""
echo "Next steps:"
echo "1. Restart GNOME Shell:"
echo "   - On X11: Press Alt+F2, type 'r', press Enter"
echo "   - On Wayland: Log out and log back in"
echo ""
echo "2. Enable the extension:"
echo "   gnome-extensions enable $EXTENSION_UUID"
echo ""
echo "The signal monitor should appear in your topbar!"
