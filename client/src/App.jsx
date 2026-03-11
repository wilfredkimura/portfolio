import { useEffect, useState } from 'react';
import {
  Folder,
  Github,
  Mail,
  ExternalLink,
  Users,
  ArrowUpRight
} from 'lucide-react';
import './index.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });

    // Fetch stats
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => { });
  }, []);

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <span className="mobile-brand">Kimura Mutahi</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="https://github.com/wilfredkimura" target="_blank" rel="noreferrer" className="mobile-icon">
            <Github size={20} />
          </a>
          <a href="mailto:wilfredmutahi9@gmail.com" className="mobile-icon">
            <Mail size={20} />
          </a>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="profile-section">
          <h1 className="profile-name">Wilfred Kimura</h1>
          <p className="profile-title">
            Software Developer & Student at Technical University of Kenya
          </p>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <a href="#projects" className="nav-link active">
                <Folder size={18} className="icon" />
                <span className="nav-text">Projects</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="https://github.com/wilfredkimura" target="_blank" rel="noreferrer" className="nav-link">
                <Github size={18} className="icon" />
                <span className="nav-text">GitHub</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="mailto:wilfredmutahi9@gmail.com" className="nav-link">
                <Mail size={18} className="icon" />
                <span className="nav-text">Contact</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="section-header">
          <h2 className="section-title">Projects</h2>
          <p className="section-desc">
            A collection of my work, automatically synced from GitHub.
            From safety-focused applications to community platforms.
          </p>
        </header>

        <section id="projects">
          {loading ? (
            <div className="loading">Fetching latest work...</div>
          ) : (
            <div className="projects-grid">
              {projects.map((repo) => (
                <div key={repo.id} className="project-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="project-title">{repo.name}</h3>
                    <ArrowUpRight size={18} className="text-secondary" />
                  </div>
                  <p className="project-description">
                    {repo.description || "No description provided. Click to explore the source code on GitHub."}
                  </p>

                  <div className="project-meta">
                    <span className="tech-tag">{repo.language || 'Code'}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {repo.homepage && (
                        <button
                          onClick={() => window.open(repo.homepage, '_blank')}
                          className="demo-btn"
                          title="Live Demo"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => window.open(repo.url, '_blank')}
                        className="demo-btn"
                        style={{ borderColor: 'transparent', background: 'rgba(255,255,255,0.05)' }}
                        title="View Source"
                      >
                        <Github size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Wilfred Kimura</p>
          <div className="visitor-stats">
            <Users size={14} style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent)' }} />
            <span>{stats ? `${stats.uniqueVisitors} Unique Visitors` : 'Loading Stats...'}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
