import { useEffect, useState } from 'react';
import {
  Folder,
  Github,
  Mail,
  ExternalLink,
  ArrowUpRight,
  Package,
  ChevronDown,
  ChevronUp,
  Download,
  History
} from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRepos, setExpandedRepos] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    const endpoint = activeTab === 'projects' ? '/api/projects' : '/api/releases';
    
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (activeTab === 'projects') {
          setProjects(Array.isArray(data) ? data : []);
        } else {
          setReleases(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [activeTab]);

  const toggleExpand = (repoId) => {
    const newExpanded = new Set(expandedRepos);
    if (newExpanded.has(repoId)) {
      newExpanded.delete(repoId);
    } else {
      newExpanded.add(repoId);
    }
    setExpandedRepos(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <span className="mobile-brand">Kimura Mutahi</span>
        <div className="mobile-nav">
          <button 
            onClick={() => setActiveTab('projects')} 
            className={`mobile-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <Folder size={20} />
            <span>Projects</span>
          </button>
          <button 
            onClick={() => setActiveTab('releases')} 
            className={`mobile-nav-item ${activeTab === 'releases' ? 'active' : ''}`}
          >
            <Package size={20} />
            <span>Releases</span>
          </button>
          <a href="https://github.com/wilfredkimura" target="_blank" rel="noreferrer" className="mobile-nav-item">
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a href="mailto:wilfredmutahi9@gmail.com" className="mobile-nav-item">
            <Mail size={20} />
            <span>Contact</span>
          </a>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="profile-section">
          <h1 className="profile-name">Kimura Mutahi</h1>
          <p className="profile-title">
            Software Developer & Student at Technical University of Kenya
          </p>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('projects')} 
                className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <Folder size={18} className="icon" />
                <span className="nav-text">Projects</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('releases')} 
                className={`nav-link ${activeTab === 'releases' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
              >
                <Package size={18} className="icon" />
                <span className="nav-text">Releases</span>
              </button>
            </li>
            <li className="nav-item" style={{ marginTop: '24px', borderTop: '1px solid var(--card-border)', paddingTop: '24px' }}>
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
        {activeTab === 'projects' ? (
          <>
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
          </>
        ) : (
          <>
            <header className="section-header">
              <h2 className="section-title">Releases</h2>
              <p className="section-desc">
                Latest stable versions and binaries for my distributed projects.
                Always stay up to date with the newest features.
              </p>
            </header>

            <section id="releases">
              {loading ? (
                <div className="loading">Fetching releases...</div>
              ) : (
                <div className="releases-list">
                  {releases.length > 0 ? (
                    releases.map((repo) => {
                      const latest = repo.releases[0];
                      const previous = repo.releases.slice(1);
                      const isExpanded = expandedRepos.has(repo.id);

                      return (
                        <div key={repo.id} className="release-card">
                          <div className="release-header">
                            <div>
                              <h3 className="project-title" style={{ marginBottom: '8px' }}>{repo.name}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="latest-tag">Latest</span>
                                <span className="history-tag">{latest.tagName}</span>
                                <span className="history-date" style={{ color: 'var(--text-secondary)' }}>• {formatDate(latest.publishedAt)}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => window.open(latest.url, '_blank')}
                              className="demo-btn"
                              title="View on GitHub"
                            >
                              <Github size={16} />
                            </button>
                          </div>

                          <div className="assets-grid">
                            {latest.assets.map((asset, i) => (
                              <a key={i} href={asset.downloadUrl} className="asset-link">
                                <Download size={16} className="text-secondary" />
                                <span>{asset.name}</span>
                              </a>
                            ))}
                            <a href={latest.url} className="asset-link" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                              <ExternalLink size={16} />
                              <span>View Release Notes</span>
                            </a>
                          </div>

                          {previous.length > 0 && (
                            <>
                              <button 
                                className="history-toggle"
                                onClick={() => toggleExpand(repo.id)}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                <span>{isExpanded ? 'Hide' : 'Show'} older versions ({previous.length})</span>
                              </button>

                              {isExpanded && (
                                <div className="history-content">
                                  {previous.map((rel) => (
                                    <div key={rel.id} className="history-item">
                                      <div className="history-item-header">
                                        <History size={14} className="text-secondary" />
                                        <span className="history-tag" style={{ fontWeight: 600 }}>{rel.tagName}</span>
                                        <span className="history-date">{formatDate(rel.publishedAt)}</span>
                                      </div>
                                      <div className="assets-grid" style={{ marginTop: '12px' }}>
                                        {rel.assets.map((asset, i) => (
                                          <a key={i} href={asset.downloadUrl} className="asset-link" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                            <Download size={14} />
                                            <span>{asset.name}</span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="loading" style={{ opacity: 0.5 }}>No releases found yet.</div>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Wilfred Kimura</p>
        </footer>
      </main>
    </div>
  );
}

export default App;

