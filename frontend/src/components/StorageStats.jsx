import React from 'react';

const StorageStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-grid">
        <div className="stat-card">
          <div className="spinner" style={{ 
            width: '30px', 
            height: '30px', 
            borderWidth: '3px', 
            borderTopColor: 'white',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">📁</div>
        <div className="stat-value">{stats.totalFiles || 0}</div>
        <div className="stat-label">Total Files</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">💾</div>
        <div className="stat-value">{stats.totalMB || '0.00'} MB</div>
        <div className="stat-label">Storage Used</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">
          {stats.averageFileSize ? 
            (stats.averageFileSize / 1024 / 1024).toFixed(2) : '0.00'} MB
        </div>
        <div className="stat-label">Average Size</div>
      </div>
    </div>
  );
};

export default StorageStats;

// Made with Bob
