import { useState, useEffect } from 'react';
import './LucidLinkDashboard.css';

const LucidLinkDashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [filespaces, setFilespaces] = useState([]);
  const [domains, setDomains] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFilespace, setNewFilespace] = useState({ name: '', storageSize: 1000000000000 });

  const API_BASE = 'http://localhost:3000/api/lucidlink';

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusRes, filespacesRes, domainsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/status`),
        fetch(`${API_BASE}/filespaces`),
        fetch(`${API_BASE}/domains`),
        fetch(`${API_BASE}/stats`)
      ]);

      const statusData = await statusRes.json();
      const filespacesData = await filespacesRes.json();
      const domainsData = await domainsRes.json();
      const statsData = await statsRes.json();

      setConnectionStatus(statusData.data);
      setFilespaces(filespacesData.data);
      setDomains(domainsData.data);
      setStats(statsData.data);
    } catch (err) {
      setError('Failed to load LucidLink data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFilespace = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/filespaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFilespace)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewFilespace({ name: '', storageSize: 1000000000000 });
        fetchData();
      }
    } catch (err) {
      alert('Failed to create filespace: ' + err.message);
    }
  };

  const handleDeleteFilespace = async (id, name) => {
    if (!confirm(`Are you sure you want to delete filespace "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/filespaces/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete filespace: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="lucidlink-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading LucidLink data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lucidlink-dashboard">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lucidlink-dashboard">
      <header className="dashboard-header">
        <h1>🔗 LucidLink Integration</h1>
        <button className="refresh-btn" onClick={fetchData}>
          🔄 Refresh
        </button>
      </header>

      {/* Connection Status */}
      <section className="connection-status">
        <div className="status-card">
          <div className="status-indicator">
            <span className={`status-dot ${connectionStatus?.connected ? 'connected' : 'disconnected'}`}></span>
            <span className="status-text">
              {connectionStatus?.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="status-details">
            <p><strong>Domain:</strong> {connectionStatus?.domain}</p>
            <p><strong>API Version:</strong> {connectionStatus?.apiVersion}</p>
            <p><strong>Last Sync:</strong> {new Date(connectionStatus?.lastSync).toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Storage Statistics */}
      {stats && (
        <section className="storage-stats">
          <h2>📊 Storage Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalFilespaces}</div>
              <div className="stat-label">Total Filespaces</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalStorageFormatted}</div>
              <div className="stat-label">Total Storage</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.usedStorageFormatted}</div>
              <div className="stat-label">Used Storage</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.usedPercentage}%</div>
              <div className="stat-label">Usage</div>
            </div>
          </div>
          <div className="storage-bar">
            <div 
              className="storage-bar-fill" 
              style={{ width: `${stats.usedPercentage}%` }}
            ></div>
          </div>
        </section>
      )}

      {/* Domains */}
      {domains && domains.length > 0 && (
        <section className="domains-section">
          <h2>🌐 Domains</h2>
          <div className="domains-list">
            {domains.map(domain => (
              <div key={domain.id} className="domain-card">
                <h3>{domain.name}</h3>
                <p><strong>Status:</strong> <span className="status-badge">{domain.status}</span></p>
                <p><strong>Filespaces:</strong> {domain.filespaceCount}</p>
                <p><strong>Total Storage:</strong> {domain.totalStorageFormatted}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filespaces */}
      <section className="filespaces-section">
        <div className="section-header">
          <h2>📁 Filespaces</h2>
          <button 
            className="create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Filespace
          </button>
        </div>

        <div className="filespaces-grid">
          {filespaces.map(filespace => (
            <div key={filespace.id} className="filespace-card">
              <div className="filespace-header">
                <h3>{filespace.name}</h3>
                <span className={`status-badge ${filespace.status}`}>
                  {filespace.status}
                </span>
              </div>
              
              <div className="filespace-details">
                <p><strong>ID:</strong> {filespace.id}</p>
                <p><strong>Domain:</strong> {filespace.domain}</p>
                <p><strong>Created:</strong> {new Date(filespace.created).toLocaleDateString()}</p>
              </div>

              <div className="storage-info">
                <div className="storage-row">
                  <span>Total:</span>
                  <span>{filespace.storage.totalFormatted}</span>
                </div>
                <div className="storage-row">
                  <span>Used:</span>
                  <span>{filespace.storage.usedFormatted}</span>
                </div>
                <div className="storage-row">
                  <span>Available:</span>
                  <span>{filespace.storage.availableFormatted}</span>
                </div>
                <div className="storage-progress">
                  <div 
                    className="storage-progress-bar"
                    style={{ width: `${filespace.storage.usedPercentage}%` }}
                  ></div>
                </div>
                <div className="storage-percentage">
                  {filespace.storage.usedPercentage}% used
                </div>
              </div>

              <div className="filespace-actions">
                <button className="btn-view">View</button>
                <button className="btn-edit">Edit</button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteFilespace(filespace.id, filespace.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create Filespace Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Filespace</h2>
            <form onSubmit={handleCreateFilespace}>
              <div className="form-group">
                <label>Filespace Name:</label>
                <input
                  type="text"
                  value={newFilespace.name}
                  onChange={(e) => setNewFilespace({ ...newFilespace, name: e.target.value })}
                  required
                  placeholder="Enter filespace name"
                />
              </div>
              <div className="form-group">
                <label>Storage Size:</label>
                <select
                  value={newFilespace.storageSize}
                  onChange={(e) => setNewFilespace({ ...newFilespace, storageSize: parseInt(e.target.value) })}
                >
                  <option value={500000000000}>500 GB</option>
                  <option value={1000000000000}>1 TB</option>
                  <option value={2000000000000}>2 TB</option>
                  <option value={5000000000000}>5 TB</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LucidLinkDashboard;

// Made with Bob
