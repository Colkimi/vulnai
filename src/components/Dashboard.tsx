import { useEffect, useState } from 'react';
import { useSecurityAnalysis } from '../hooks/useSecurityAnalysis';
import type { ThreatIntelligenceResponse } from '../types/analysis';
import '../styles/Dashboard.css';

export function Dashboard() {
  const [threatData, setThreatData] = useState<ThreatIntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [techMode, setTechMode] = useState(true);
  const { getThreatIntelligence } = useSecurityAnalysis();

  useEffect(() => {
    loadThreatData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadThreatData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadThreatData = async () => {
    setLoading(true);
    const data = await getThreatIntelligence();
    if (data) {
      setThreatData(data);
    }
    setLoading(false);
  };

  const getUrgencyIcon = (urgency: string): string => {
    switch (urgency) {
      case 'Act Now':
        return '🚨';
      case 'This Week':
        return '⚠️';
      case 'Soon':
        return '📌';
      case 'Monitor':
        return '👁️';
      default:
        return 'ℹ️';
    }
  };

  const getRiskLevel = (count: number): string => {
    if (count >= 10) return 'Critical';
    if (count >= 5) return 'High';
    if (count >= 2) return 'Medium';
    return 'Low';
  };

  const getRiskColor = (count: number): string => {
    if (count >= 10) return '#ef4444';
    if (count >= 5) return '#f97316';
    if (count >= 2) return '#fbbf24';
    return '#10a37f';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-top">
          <div>
            <h1>🛡️ VulnAI Security Dashboard</h1>
            <p>Real-time threat intelligence and vulnerability tracking</p>
          </div>
          <div className="header-controls">
            <button
              className={`mode-toggle ${!techMode ? 'active' : ''}`}
              onClick={() => setTechMode(!techMode)}
            >
              {techMode ? '👨‍💻 Tech Mode' : '👥 Simple Mode'}
            </button>
            <button
              className="refresh-btn"
              onClick={loadThreatData}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>
        </div>
        {threatData && (
          <p className="last-updated">
            Last updated: {new Date(threatData.lastUpdated).toLocaleString()}
          </p>
        )}
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        {threatData ? (
          <>
            {/* TECH MODE */}
            {techMode && (
              <>
                {/* Risk Timeline */}
                <section className="risk-timeline-section">
                  <h2>📊 Risk Timeline</h2>
                  <div className="risk-timeline">
                    <div className="timeline-item">
                      <div className="timeline-label">Now (Actively Exploited)</div>
                      <div
                        className="timeline-bar"
                        style={{
                          width: `${Math.min((threatData.exploitedNow.length / 10) * 100, 100)}%`,
                          backgroundColor: getRiskColor(threatData.exploitedNow.length),
                        }}
                      >
                        <span className="timeline-count">{threatData.exploitedNow.length}</span>
                      </div>
                      <div className="timeline-risk">
                        {getRiskLevel(threatData.exploitedNow.length)}
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label">This Week (Critical)</div>
                      <div
                        className="timeline-bar"
                        style={{
                          width: `${Math.min((threatData.criticalAlerts.length / 10) * 100, 100)}%`,
                          backgroundColor: getRiskColor(threatData.criticalAlerts.length),
                        }}
                      >
                        <span className="timeline-count">{threatData.criticalAlerts.length}</span>
                      </div>
                      <div className="timeline-risk">
                        {getRiskLevel(threatData.criticalAlerts.length)}
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-label">Upcoming (This Week)</div>
                      <div
                        className="timeline-bar"
                        style={{
                          width: `${Math.min((threatData.thisWeekVulnerabilities.length / 10) * 100, 100)}%`,
                          backgroundColor: getRiskColor(threatData.thisWeekVulnerabilities.length),
                        }}
                      >
                        <span className="timeline-count">
                          {threatData.thisWeekVulnerabilities.length}
                        </span>
                      </div>
                      <div className="timeline-risk">
                        {getRiskLevel(threatData.thisWeekVulnerabilities.length)}
                      </div>
                    </div>
                  </div>
                </section>

                {/* CVEs Exploited Right Now - Technical */}
                {threatData.exploitedNow.length > 0 && (
                  <section className="threats-section critical">
                    <h2>🚨 CVEs Exploited RIGHT NOW ({threatData.exploitedNow.length})</h2>
                    <div className="threat-grid">
                      {threatData.exploitedNow.map((alert, idx) => (
                        <div key={idx} className="threat-card critical-card">
                          <div className="card-header">
                            <span className="impact-badge" style={{ backgroundColor: '#ef4444' }}>
                              {alert.impactScore}/10
                            </span>
                          </div>
                          <h3>{alert.title}</h3>
                          <p className="technical-text">{alert.plainLanguage}</p>
                          <div className="card-footer">
                            <span className="urgency-tag">🚨 {alert.urgency}</span>
                            <span className="timestamp">Patch ASAP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Critical Alerts - Technical */}
                {threatData.criticalAlerts.length > 0 && (
                  <section className="threats-section">
                    <h2>⚠️ Critical Alerts ({threatData.criticalAlerts.length})</h2>
                    <div className="threat-grid">
                      {threatData.criticalAlerts.map((alert, idx) => (
                        <div key={idx} className="threat-card">
                          <div className="card-header">
                            <span className="impact-badge">
                              {alert.impactScore}/10
                            </span>
                          </div>
                          <h3>{alert.title}</h3>
                          <p className="technical-text">{alert.plainLanguage}</p>
                          <div className="card-footer">
                            <span className="urgency-tag">{getUrgencyIcon(alert.urgency)} {alert.urgency}</span>
                            <span className="timestamp">Patch Today</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Trending This Week - Technical */}
                {threatData.thisWeekVulnerabilities.length > 0 && (
                  <section className="threats-section">
                    <h2>📈 Trending Vulnerabilities This Week ({threatData.thisWeekVulnerabilities.length})</h2>
                    <div className="threat-grid">
                      {threatData.thisWeekVulnerabilities.slice(0, 6).map((alert, idx) => (
                        <div key={idx} className="threat-card">
                          <div className="card-header">
                            <span className="impact-badge">
                              {alert.impactScore}/10
                            </span>
                          </div>
                          <h3>{alert.title}</h3>
                          <p className="technical-text">{alert.plainLanguage}</p>
                          <div className="card-footer">
                            <span className="urgency-tag">{getUrgencyIcon(alert.urgency)} {alert.urgency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* SIMPLE MODE */}
            {!techMode && (
              <>
                {/* Summary Box */}
                <section className="summary-section">
                  <h2>📋 What's Happening Right Now?</h2>
                  <div className="summary-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: threatData.summaryForNonTechUsers
                          .replace(/\n/g, '<br />')
                          .replace(/## (.*?)<br/g, '<h3>$1</h3>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\* /g, '• '),
                      }}
                    />
                  </div>
                </section>

                {/* DO THIS TODAY - Critical Actions */}
                {threatData.exploitedNow.length > 0 && (
                  <section className="action-section urgent">
                    <h2>🚨 DO THIS TODAY - Critical Issues</h2>
                    <div className="action-list">
                      {threatData.exploitedNow.map((alert, idx) => (
                        <div key={idx} className="action-item urgent">
                          <div className="action-icon">🚨</div>
                          <div className="action-content">
                            <h3>{alert.title}</h3>
                            <p className="plain-text">{alert.plainLanguage}</p>
                            <div className="action-meta">
                              <span className="severity-badge critical">URGENT - Update Now</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* DO THIS WEEK - Important Updates */}
                {threatData.criticalAlerts.length > 0 && (
                  <section className="action-section">
                    <h2>⚠️ DO THIS WEEK - Important Updates</h2>
                    <div className="action-list">
                      {threatData.criticalAlerts.slice(0, 5).map((alert, idx) => (
                        <div key={idx} className="action-item">
                          <div className="action-icon">⚠️</div>
                          <div className="action-content">
                            <h3>{alert.title}</h3>
                            <p className="plain-text">{alert.plainLanguage}</p>
                            <div className="action-meta">
                              <span className="severity-badge">Install Update This Week</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* TRENDING - What Hackers Are Using */}
                {threatData.thisWeekVulnerabilities.length > 0 && (
                  <section className="action-section">
                    <h2>📲 Trending - Popular Vulnerabilities Right Now</h2>
                    <div className="trending-list">
                      {threatData.thisWeekVulnerabilities.slice(0, 5).map((alert, idx) => (
                        <div key={idx} className="trending-item">
                          <span className="trending-number">#{idx + 1}</span>
                          <div className="trending-content">
                            <h4>{alert.title}</h4>
                            <p>{alert.plainLanguage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* General Security Tips */}
                <section className="tips-section">
                  <h2>💡 Simple Tips to Stay Safe</h2>
                  <div className="tips-grid">
                    <div className="tip-card">
                      <span className="tip-icon">🔄</span>
                      <h3>Keep Software Updated</h3>
                      <p>Turn on automatic updates for your computer and programs</p>
                    </div>
                    <div className="tip-card">
                      <span className="tip-icon">🔐</span>
                      <h3>Use Strong Passwords</h3>
                      <p>Use different passwords for each account (use a password manager!)</p>
                    </div>
                    <div className="tip-card">
                      <span className="tip-icon">📱</span>
                      <h3>Two-Factor Authentication</h3>
                      <p>Add 2-factor authentication to important accounts like email and banking</p>
                    </div>
                    <div className="tip-card">
                      <span className="tip-icon">🚨</span>
                      <h3>Watch for Scams</h3>
                      <p>Be careful with emails from people you don't know, especially ones asking for passwords</p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        ) : (
          <div className="loading-state">
            <span className="spinner"></span>
            <p>Loading threat intelligence...</p>
          </div>
        )}
      </div>
    </div>
  );
}
