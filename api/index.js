const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// GitHub API Headers (Add GITHUB_TOKEN to .env to avoid 403 errors)
const githubHeaders = process.env.GITHUB_TOKEN ? {
    Authorization: `token ${process.env.GITHUB_TOKEN}`
} : {};

app.use(cors());
app.use(express.json());

// 1. Dynamic GitHub Project Proxy
app.get('/api/projects', async (req, res) => {
    try {
        const response = await axios.get('https://api.github.com/users/wilfredkimura/repos', {
            params: { sort: 'updated', per_page: 100 },
            headers: githubHeaders
        });
        
        const projects = response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
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

// 2. Dynamic GitHub Releases Proxy
app.get('/api/releases', async (req, res) => {
    try {
        // Fetch repositories first
        const reposRes = await axios.get('https://api.github.com/users/wilfredkimura/repos', {
            params: { sort: 'updated', per_page: 100 },
            headers: githubHeaders
        });

        // Fetch releases for each repo in parallel
        const releasesPromises = reposRes.data.map(async (repo) => {
            try {
                const releaseRes = await axios.get(`https://api.github.com/repos/wilfredkimura/${repo.name}/releases`, {
                    headers: githubHeaders
                });
                if (releaseRes.data && releaseRes.data.length > 0) {
                    return {
                        id: repo.id,
                        name: repo.name,
                        description: repo.description,
                        releases: releaseRes.data.map(rel => ({
                            id: rel.id,
                            tagName: rel.tag_name,
                            name: rel.name,
                            publishedAt: rel.published_at,
                            body: rel.body,
                            url: rel.html_url,
                            assets: rel.assets.map(asset => ({
                                name: asset.name,
                                downloadUrl: asset.browser_download_url,
                                size: asset.size
                            }))
                        }))
                    };
                }
                return null;
            } catch (err) {
                // Ignore repos without releases or API errors for individual repos
                return null;
            }
        });

        const allReleases = await Promise.all(releasesPromises);
        res.json(allReleases.filter(r => r !== null));
    } catch (err) {
        console.error('GitHub API error (Releases):', err.message);
        res.status(500).json({ error: "Failed to fetch GitHub releases" });
    }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

