/**
 * Tim Hortons India — Ops & Training Portal
 * Simple HTTP server — share with up to 44 stores
 *
 * Usage:
 *   node server.js
 *   node server.js --port 3000
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

// ── Config ──────────────────────────────────────────────
const PORT      = process.argv.includes('--port')
  ? parseInt(process.argv[process.argv.indexOf('--port') + 1], 10)
  : 8080;
const HTML_FILE = path.join(__dirname, 'timhortons_v2_final.html');

// ── MIME types ──────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css',
  '.js'  : 'application/javascript',
  '.json': 'application/json',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.ico' : 'image/x-icon',
  '.svg' : 'image/svg+xml',
};

// ── Simple request logger ────────────────────────────────
function log(req, status) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const ip  = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[${now}]  ${status}  ${req.method} ${req.url}  — ${ip}`);
}

// ── Server ───────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed   = url.parse(req.url);
  let   pathname = parsed.pathname;

  // Root → serve the portal
  if (pathname === '/' || pathname === '/index.html' || pathname === '/portal') {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: could not read portal file.');
        log(req, 500);
        return;
      }
      res.writeHead(200, {
        'Content-Type'  : 'text/html; charset=utf-8',
        'Cache-Control' : 'no-cache, no-store, must-revalidate',
        'Pragma'        : 'no-cache',
        'Expires'       : '0',
      });
      res.end(data);
      log(req, 200);
    });
    return;
  }

  // Health-check endpoint (useful for uptime monitors)
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    log(req, 200);
    return;
  }

  // Static assets next to server.js (images, icons, etc.)
  const filePath = path.join(__dirname, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
    log(req, 200);
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <html><body style="font-family:sans-serif;text-align:center;padding:60px;">
      <h2 style="color:#C8102E;">404 — Page Not Found</h2>
      <p><a href="/">← Back to Portal</a></p>
    </body></html>
  `);
  log(req, 404);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ☕  Tim Hortons India — Ops & Training Portal');
  console.log('  ─────────────────────────────────────────────');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://<YOUR_IP>:${PORT}  (share this with stores)`);
  console.log('');
  console.log('  Press Ctrl+C to stop the server.');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ✗  Port ${PORT} is already in use. Try:\n     node server.js --port 3000\n`);
  } else {
    console.error('\n  Server error:', err.message);
  }
  process.exit(1);
});
