import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const SignalIndicator = GObject.registerClass(
class SignalIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Connection Signal Monitor', false);

        // Create box for icon and label
        let box = new St.BoxLayout({
            style_class: 'panel-status-menu-box'
        });

        // Icon label (will contain emoji)
        this._iconLabel = new St.Label({
            text: '📡',
            y_align: Clutter.ActorAlign.CENTER
        });
        box.add_child(this._iconLabel);

        // Signal value label
        this._valueLabel = new St.Label({
            text: '--',
            y_align: Clutter.ActorAlign.CENTER
        });
        box.add_child(this._valueLabel);

        this.add_child(box);

        // Create popup menu items
        this._typeItem = new PopupMenu.PopupMenuItem('Type: --', {reactive: false});
        this._qualityItem = new PopupMenu.PopupMenuItem('Quality: --', {reactive: false});
        this._metric1Item = new PopupMenu.PopupMenuItem('--', {reactive: false});
        this._metric2Item = new PopupMenu.PopupMenuItem('--', {reactive: false});
        this._metric3Item = new PopupMenu.PopupMenuItem('--', {reactive: false});

        this.menu.addMenuItem(this._typeItem);
        this.menu.addMenuItem(this._qualityItem);
        this.menu.addMenuItem(this._metric1Item);
        this.menu.addMenuItem(this._metric2Item);
        this.menu.addMenuItem(this._metric3Item);

        // Start updating
        this._updateSignal();
        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
            this._updateSignal();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _getActiveConnectionType() {
        try {
            // Check default route to find which connection is actually being used
            let [ok, stdout] = GLib.spawn_command_line_sync('ip route show default');
            if (!ok) return null;

            let output = new TextDecoder().decode(stdout);

            // Parse default route - format: "default via X.X.X.X dev DEVICE ..."
            // Get the device name from the route with lowest metric (preferred route)
            let lines = output.split('\n');
            let lowestMetric = 99999;
            let defaultDevice = null;

            for (let line of lines) {
                if (line.startsWith('default')) {
                    let parts = line.split(/\s+/);
                    let devIndex = parts.indexOf('dev');
                    let metricIndex = parts.indexOf('metric');

                    if (devIndex !== -1 && devIndex + 1 < parts.length) {
                        let device = parts[devIndex + 1];
                        let metric = metricIndex !== -1 ? parseInt(parts[metricIndex + 1]) : 0;

                        if (metric < lowestMetric) {
                            lowestMetric = metric;
                            defaultDevice = device;
                        }
                    }
                }
            }

            if (!defaultDevice) return null;

            // Check if device is WiFi or modem
            if (defaultDevice.startsWith('wl') || defaultDevice.startsWith('wlan')) {
                return 'wifi';
            } else if (defaultDevice.startsWith('wwan') || defaultDevice.startsWith('ppp')) {
                return 'modem';
            }
        } catch (e) {
            logError(e, 'Error detecting connection type');
        }
        return null;
    }

    _updateSignal() {
        try {
            let connType = this._getActiveConnectionType();

            if (connType === 'wifi') {
                this._updateWiFiSignal();
            } else if (connType === 'modem') {
                this._updateModemSignal();
            } else {
                this._setNoSignal();
            }
        } catch (e) {
            logError(e, 'Error updating signal');
            this._setNoSignal();
        }
    }

    _updateWiFiSignal() {
        try {
            // Get WiFi device name
            let [ok1, stdout1] = GLib.spawn_command_line_sync('nmcli -t -f DEVICE,TYPE device status');
            if (!ok1) {
                this._setNoSignal();
                return;
            }

            let deviceOutput = new TextDecoder().decode(stdout1);
            let wifiDevice = null;
            for (let line of deviceOutput.split('\n')) {
                if (line.includes(':wifi')) {
                    wifiDevice = line.split(':')[0];
                    break;
                }
            }

            if (!wifiDevice) {
                this._setNoSignal();
                return;
            }

            // Get signal in dBm using iw
            let [ok2, stdout2] = GLib.spawn_command_line_sync(`iw dev ${wifiDevice} link`);
            if (!ok2) {
                this._setNoSignal();
                return;
            }

            let iwOutput = new TextDecoder().decode(stdout2);

            // Parse signal strength in dBm and SSID
            let signalDbm = 0;
            let ssid = 'Unknown';
            let freq = '--';

            for (let line of iwOutput.split('\n')) {
                if (line.includes('signal:')) {
                    let match = line.match(/signal:\s*(-?\d+)\s*dBm/);
                    if (match) signalDbm = parseInt(match[1]);
                } else if (line.includes('SSID:')) {
                    ssid = line.split('SSID:')[1].trim();
                } else if (line.includes('freq:')) {
                    freq = line.split('freq:')[1].trim().split('.')[0];
                }
            }

            // Determine quality and icon based on dBm
            // WiFi signal strength: -30 dBm = excellent, -67 dBm = good, -70 dBm = fair, -80+ = poor
            let icon, quality;
            if (signalDbm >= -50) {
                icon = '📶';
                quality = 'Excellent';
            } else if (signalDbm >= -60) {
                icon = '📶';
                quality = 'Good';
            } else if (signalDbm >= -70) {
                icon = '📡';
                quality = 'Fair';
            } else {
                icon = '📉';
                quality = 'Poor';
            }

            // Update UI
            this._iconLabel.set_text(icon);
            this._valueLabel.set_text(`${signalDbm}dBm`);
            this._typeItem.label.set_text(`Type: WiFi (${ssid})`);
            this._qualityItem.label.set_text(`Quality: ${quality}`);
            this._metric1Item.label.set_text(`Signal: ${signalDbm} dBm`);
            this._metric2Item.label.set_text(`Frequency: ${freq} MHz`);
            this._metric3Item.label.set_text(`Device: ${wifiDevice}`);

        } catch (e) {
            logError(e, 'Error updating WiFi signal');
            this._setNoSignal();
        }
    }

    _updateModemSignal() {
        try {
            let [ok, stdout] = GLib.spawn_command_line_sync('mmcli -m 0 --signal-get');

            if (!ok) {
                this._setNoSignal();
                return;
            }

            let output = new TextDecoder().decode(stdout);

            // Parse values
            let snr = this._parseValue(output, 's/n:', 2);
            let rssi = this._parseValue(output, 'rssi:', 3, 'LTE');
            let rsrp = this._parseValue(output, 'rsrp:', 2);

            // Determine quality and icon based on SNR
            let icon, quality;
            if (snr >= 20) {
                icon = '📶';
                quality = 'Excellent';
            } else if (snr >= 13) {
                icon = '📶';
                quality = 'Good';
            } else if (snr >= 0) {
                icon = '📡';
                quality = 'Fair';
            } else {
                icon = '📉';
                quality = 'Poor';
            }

            // Update UI
            this._iconLabel.set_text(icon);
            this._valueLabel.set_text(`${snr}dB`);
            this._typeItem.label.set_text('Type: Mobile Broadband');
            this._qualityItem.label.set_text(`Quality: ${quality}`);
            this._metric1Item.label.set_text(`SNR: ${snr} dB`);
            this._metric2Item.label.set_text(`RSSI: ${rssi} dBm`);
            this._metric3Item.label.set_text(`RSRP: ${rsrp} dBm`);

        } catch (e) {
            logError(e, 'Error updating modem signal');
            this._setNoSignal();
        }
    }

    _parseValue(output, pattern, field, linePrefix = null) {
        let lines = output.split('\n');
        for (let line of lines) {
            if (linePrefix && !line.includes(linePrefix)) continue;
            if (line.includes(pattern)) {
                let parts = line.trim().split(/\s+/);
                let value = parts[field];
                if (value) {
                    return parseInt(value.split('.')[0]);
                }
            }
        }
        return 0;
    }

    _setNoSignal() {
        this._iconLabel.set_text('📡');
        this._valueLabel.set_text('--');
        this._typeItem.label.set_text('Type: No Active Connection');
        this._qualityItem.label.set_text('Quality: --');
        this._metric1Item.label.set_text('--');
        this._metric2Item.label.set_text('--');
        this._metric3Item.label.set_text('--');
    }

    destroy() {
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }
        super.destroy();
    }
});

export default class SignalMonitorExtension extends Extension {
    enable() {
        this._indicator = new SignalIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
