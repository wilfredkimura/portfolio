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
  History,
  Activity,
  Search,
  GitCommit
} from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRepos, setExpandedRepos] = useState(new Set());

  // New States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [stats, setStats] = useState({ day: 0, week: 0, month: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

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

  useEffect(() => {
    setActivityLoading(true);
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        setActivity(Array.isArray(data) ? data : []);
        setActivityLoading(false);
      })
      .catch(err => {
        console.error('Fetch activity error:', err);
        setActivityLoading(false);
      });
  }, []);

  useEffect(() => {
    setStatsLoading(true);
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setStatsLoading(false);
      })
      .catch(err => {
        console.error('Fetch stats error:', err);
        setStatsLoading(false);
      });
  }, []);

  const languages = ['All', ...new Set(projects.map(p => p.language).filter(Boolean))];
  
  const filteredProjects = projects.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = selectedLanguage === 'All' || repo.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const currentlyBuilding = projects.length > 0 ? [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] : null;

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
        {currentlyBuilding && (
          <div className="mobile-currently-building">
            <span className="building-label"><Activity size={12} className="pulse-icon" /> Building: </span>
            <a href={currentlyBuilding.url} target="_blank" rel="noreferrer" className="building-project">{currentlyBuilding.name}</a>
          </div>
        )}
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
          {currentlyBuilding && (
            <div className="currently-building">
              <span className="building-label"><Activity size={14} className="pulse-icon" /> Currently Building</span>
              <a href={currentlyBuilding.url} target="_blank" rel="noreferrer" className="building-project">{currentlyBuilding.name}</a>
            </div>
          )}
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

        <div className="activity-widget">
          <h3 className="activity-title"><GitCommit size={16}/> Recent Activity</h3>
          {activityLoading ? (
            <p className="activity-text">Loading...</p>
          ) : activity.slice(0, 4).map(event => (
            <div key={event.id} className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-repo">{event.repo.split('/')[1]}</p>
                <p className="activity-type">{event.type.replace('Event', '')}</p>
                <span className="activity-time">{formatDate(event.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
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

              <div className="project-controls">
                <div className="search-bar">
                  <Search size={18} className="text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="language-filters">
                  {languages.map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`filter-btn ${selectedLanguage === lang ? 'active' : ''}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="heatmap-container">
              <div className="heatmap-header">
                <h3 className="heatmap-title">Contributions</h3>
                <div className="stats-grid">
                  <div className="stats-card">
                    <span className="stats-value">{statsLoading ? '...' : stats.day}</span>
                    <span className="stats-label">Day</span>
                  </div>
                  <div className="stats-card">
                    <span className="stats-value">{statsLoading ? '...' : stats.week}</span>
                    <span className="stats-label">Week</span>
                  </div>
                  <div className="stats-card">
                    <span className="stats-value">{statsLoading ? '...' : stats.month}</span>
                    <span className="stats-label">Month</span>
                  </div>
                  <div className="stats-card">
                    <span className="stats-value">{statsLoading ? '...' : stats.total}</span>
                    <span className="stats-label">Year</span>
                  </div>
                </div>
              </div>
              <img src="https://ghchart.rshah.org/14b8a6/wilfredkimura" alt="GitHub Contributions Heatmap" />
            </div>

            <section id="projects">
              {loading ? (
                <div className="loading">Fetching latest work...</div>
              ) : (
                <div className="projects-grid">
                  {filteredProjects.map((repo) => (
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

        <div className="mobile-activity-widget">
          <h3 className="activity-title"><GitCommit size={16}/> Recent Activity</h3>
          {activityLoading ? (
            <p className="activity-text">Loading...</p>
          ) : activity.slice(0, 3).map(event => (
            <div key={event.id} className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-repo">{event.repo.split('/')[1]}</p>
                <p className="activity-type">{event.type.replace('Event', '')}</p>
                <span className="activity-time">{formatDate(event.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Wilfred Kimura</p>
        </footer>
      </main>
    </div>
  );
}

export default App;

