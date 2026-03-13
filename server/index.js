const express = require('express');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = require('better-sqlite3')(dbPath);
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB
db.prepare(`CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT UNIQUE, 
    browser TEXT, 
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

// 1. The Visitor Tracker Middleware
app.use((req, res, next) => {
    // Ignore internal calls and common crawler-like requests if necessary
    // For now, let's keep it simple as requested
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const browser = req.headers['user-agent'];
    
    try {
        const logVisitor = db.prepare(`
            INSERT INTO visitors (ip, browser) VALUES (?, ?)
            ON CONFLICT(ip) DO UPDATE SET last_seen = CURRENT_TIMESTAMP
        `);
        logVisitor.run(ip, browser);
    } catch (err) {
        console.error('Database logging error:', err);
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
