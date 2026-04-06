# ☕ Tim Hortons India — Portal Server

Share your Ops & Training Portal with all 44 stores in 3 steps.

---

## Files Needed

```
timhortons-portal/
├── server.js                   ← the server
└── timhortons_v2_final.html    ← your portal
```

---

## Step 1 — Install Node.js (one-time)

Download from **https://nodejs.org** → choose the **LTS** version → install.

Verify it works:
```bash
node --version
```
Should print something like `v20.x.x`.

---

## Step 2 — Start the Server

Open **Terminal** (Mac/Linux) or **Command Prompt / PowerShell** (Windows):

```bash
# Go into your folder
cd path/to/timhortons-portal

# Start the server
node server.js
```

You'll see:

```
  ☕  Tim Hortons India — Ops & Training Portal
  ─────────────────────────────────────────────
  Local:   http://localhost:8080
  Network: http://192.168.1.x:8080  ← share this with stores
```

---

## Step 3 — Share the Link with Stores

1. Find **your computer's IP address**:
   - **Windows**: Open CMD → type `ipconfig` → look for `IPv4 Address`
   - **Mac/Linux**: Open Terminal → type `ifconfig` or `ip addr`

2. The URL to share is:
   ```
   http://YOUR_IP:8080
   ```
   Example: `http://192.168.1.50:8080`

3. Send this link to all 44 store managers — they open it in any browser.

> ⚠️ **Important**: Your computer must stay ON and the server must keep running for stores to access the portal.

---

## Optional — Change the Port

If port 8080 is taken:
```bash
node server.js --port 3000
```

---

## Keep It Running 24/7 (Recommended)

Install **PM2** to keep the server alive even if your terminal closes:

```bash
# Install PM2 (one-time)
npm install -g pm2

# Start with PM2
pm2 start server.js --name "timhortons-portal"

# Auto-start on reboot
pm2 save
pm2 startup
```

Check status anytime:
```bash
pm2 status
pm2 logs timhortons-portal
```

---

## Hosting Online (Best for Remote Stores)

If stores are in different cities and not on the same network, host on the internet:

| Option | Cost | Difficulty |
|--------|------|------------|
| **Railway.app** | Free tier | Very Easy |
| **Render.com** | Free tier | Easy |
| **DigitalOcean Droplet** | ~$6/mo | Medium |

For Railway: push your files to GitHub, connect Railway → it auto-deploys.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Port already in use" | Run `node server.js --port 3000` |
| Stores can't access | Check your firewall allows port 8080 |
| Server stops when I close Terminal | Use PM2 (see above) |
| Page not loading | Make sure both files are in the same folder |

---

## Health Check

Visit `http://YOUR_IP:8080/health` to confirm the server is running. You'll see:
```json
{ "status": "ok", "time": "2026-04-06T..." }
```
