const express = require('express');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = require('better-sqlite3')(dbPath);
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB
db.prepare(`
  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fingerprint TEXT UNIQUE,   -- The unique ID for the device
    ip TEXT,
    browser TEXT,
    device_type TEXT,          -- Mobile, Tablet, or Desktop
    os TEXT,                   -- Windows, Linux, iOS, etc.
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// 1. The Visitor Tracker Middleware
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] || '';

    // 1. Simple Device & OS Detection
    let deviceType = 'Desktop';
    if (/Mobi|Android|iPhone/i.test(ua)) deviceType = 'Mobile';
    if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';

    let os = 'Unknown OS';
    if (ua.includes('Win')) os = 'Windows';
    if (ua.includes('Mac')) os = 'MacOS';
    if (ua.includes('X11') || ua.includes('Linux')) os = 'Linux';
    if (ua.includes('Android')) os = 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // 2. Create a Unique Fingerprint (ID)
    // We hash the IP + UserAgent so the same device always gets the same ID
    const fingerprint = crypto.createHash('md5').update(ip + ua).digest('hex');

    // 3. Upsert into Database
    const upsert = db.prepare(`
        INSERT INTO visitors (fingerprint, ip, browser, device_type, os) 
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(fingerprint) DO UPDATE SET 
            last_seen = CURRENT_TIMESTAMP,
            ip = excluded.ip -- Update IP in case they moved from WiFi to Data
    `);

    try {
        upsert.run(fingerprint, ip, ua, deviceType, os);
    } catch (err) {
        console.error("Tracking Error:", err);
    }

    next();
});

// 2. Dynamic GitHub Project Proxy
app.get('/api/projects', async (req, res) => {
    try {
        // Fetch repositories from wilfredkimura
        const response = await axios.get('https://api.github.com/users/wilfredkimura/repos', {
            params: {
                sort: 'updated',
                per_page: 100 // Fetch all (up to 100)
            }
        });
        
        // Map to a clean structure for the frontend
        const projects = response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage, // Live demo link
            stars: repo.stargazers_count,
            language: repo.language,
            updatedAt: repo.updated_at
        }));
        
        res.json(projects);
    } catch (err) {
        console.error('GitHub API error:', err.message);
        res.status(500).json({ error: "Failed to fetch GitHub projects" });
    }
});

// Server status endpoint
app.get('/api/status', (req, res) => {
    const visitorCount = db.prepare('SELECT COUNT(*) as count FROM visitors').get();
    res.json({ status: 'online', uniqueVisitors: visitorCount.count });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
