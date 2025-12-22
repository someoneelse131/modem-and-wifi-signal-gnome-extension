# Contributing to Modem Signal Monitor

Thank you for your interest in contributing to this project! Here are some guidelines to help you get started.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- Your GNOME Shell version (`gnome-shell --version`)
- Your Linux distribution and version
- Output of `mmcli -L` (to show your modem)
- Steps to reproduce the issue
- Any relevant logs from `journalctl /usr/bin/gnome-shell`

### Suggesting Enhancements

Feature requests are welcome! Please open an issue describing:
- What feature you'd like to see
- Why it would be useful
- How you envision it working

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly on your system
5. Commit with clear, descriptive messages
6. Push to your fork
7. Open a Pull Request

### Code Style

- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Test on GNOME Shell 45+ if possible

### Testing

Before submitting a PR, please test:
- Extension loads without errors
- Signal values are parsed correctly
- UI displays properly
- No console errors in logs

### Questions?

Feel free to open an issue for any questions!
