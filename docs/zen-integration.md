# Zen (Aikido) integration — notes

What this change does
- Adds the npm dependency `@aikidosec/firewall` to the root `package.json`.
- Requires `@aikidosec/firewall` at the very top of `app.ts` so the firewall module initializes before any other code. This follows Aikido's guidance to "Include this before any other code or imports".
- This branch intentionally does not alter CI to keep risk low. CI automation can be added separately to exercise the integrated firewall.

How to test locally
1. From repository root (checkout the branch `feat/zen-integration`):
   - npm ci
   - cd frontend && npm ci --legacy-peer-deps && npm run build || true && cd ..
   - npm run build:server || true
   - npm run serve
2. Check server logs for a message from the firewall. To make it visible, you can temporarily add:
   - require('@aikidosec/firewall'); console.log('[Zen] firewall loaded');
   at the top of app.ts
3. Visit http://localhost:3000 and exercise Juice Shop endpoints. Because the app is intentionally vulnerable, run tests only in an isolated environment.

How to revert
- Remove the `require('@aikidosec/firewall');` line from app.ts
- npm uninstall @aikidosec/firewall
- Commit and push the removal, or revert the branch/PR in GitHub.

Notes & recommendations
- Pin the firewall package to a specific version before merging instead of using `*`. Example: `npm install @aikidosec/firewall@1.2.3 --save`.
- Adding a WAF inside the app may change behavior of some Juice Shop challenges. Keep this change in a feature branch and test thoroughly before merging into main.