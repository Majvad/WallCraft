# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via Telegram to [@Majvad0](https://t.me/Majvad0).

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

  * Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
  * Full paths of source file(s) related to the manifestation of the issue
  * The location of the affected source code (tag/branch/commit or direct URL)
  * Any special configuration required to reproduce the issue
  * Step-by-step instructions to reproduce the issue
  * Proof-of-concept or exploit code (if possible)
  * Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Policy

We follow the principle of [Coordinated Vulnerability Disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure).

## Security Best Practices

When using HyprWall:

1. **Keep Updated**: Always use the latest version
2. **Verify Sources**: Only download from official GitHub releases
3. **Check Permissions**: Ensure config files have appropriate permissions
4. **Review Config**: Check `~/.config/hyprwall/config.toml` for sensitive data
5. **Monitor Logs**: Check `~/.local/state/hyprwall/hyprwall.log` for unusual activity

## Security Features

HyprWall includes several security features:

- **Local-only API**: REST API binds to 127.0.0.1 by default
- **No Remote Access**: No external network connections required
- **Sandboxed Service**: Systemd service with security hardening
- **XDG Compliance**: Follows XDG Base Directory Specification
- **No Privilege Escalation**: Runs as regular user, no root required

## Audit Trail

All significant changes are logged in:
- `~/.local/state/hyprwall/hyprwall.log` - Application logs
- `journalctl --user -u hyprwall` - Systemd journal

---

Thank you for helping keep HyprWall secure!
