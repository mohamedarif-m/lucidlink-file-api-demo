import React, { useState, useEffect } from 'react';
import { fileAPI } from './api/client';
import UploadForm from './components/UploadForm';
import FileList from './components/FileList';
import StorageStats from './components/StorageStats';

function App() {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  // Load files and stats on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [filesResponse, statsResponse] = await Promise.all([
        fileAPI.getFiles(),
        fileAPI.getStorageStats(),
      ]);
      
      setFiles(filesResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (error) {
      showMessage('Error loading data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileData) => {
    try {
      setUploading(true);
      const response = await fileAPI.uploadFile(fileData);
      
      if (response.success) {
        showMessage('✓ File uploaded successfully!', 'success');
        await loadData();
      }
    } catch (error) {
      showMessage('✗ Upload failed: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fileAPI.deleteFile(fileId);
      
      if (response.success) {
        showMessage('✓ File deleted successfully!', 'success');
        await loadData();
      }
    } catch (error) {
      showMessage('✗ Delete failed: ' + error.message, 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div>
              <a href="/" className="logo">
                <img
                  src="/lucidlink-logo.png"
                  alt="LucidLink Logo"
                  style={{ height: '60px', width: 'auto' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="logo-icon">🔷</span>
                  <span>LucidLink</span>
                </span>
              </a>
              <p className="tagline">File Management System - Demo</p>
            </div>
          </div>
          <div className="header-actions">
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#6B7280',
              fontWeight: 500 
            }}>
              Built by Bob AI Developer
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Message Alert */}
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Storage Statistics */}
        <StorageStats stats={stats} loading={loading} />

        {/* Upload Form */}
        <UploadForm onUpload={handleUpload} uploading={uploading} />

        {/* File List */}
        <FileList 
          files={files} 
          onDelete={handleDelete} 
          loading={loading}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2024 LucidLink File Manager Demo</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">API Reference</a>
            <a href="#" className="footer-link">GitHub</a>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
            Powered by React + Vite | Backend: Express.js | AI: Bob Developer
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
