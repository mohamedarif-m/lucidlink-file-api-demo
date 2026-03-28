import React from 'react';

const FileList = ({ files, onDelete, loading }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️';
    if (type?.startsWith('video/')) return '🎥';
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('json')) return '📋';
    if (type?.includes('text')) return '📝';
    return '📁';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <h3>No files yet</h3>
          <p>Upload your first file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          📋 Files
          <span style={{ 
            marginLeft: '0.5rem', 
            fontSize: '0.875rem', 
            fontWeight: 'normal',
            color: '#6B7280'
          }}>
            ({files.length} {files.length === 1 ? 'file' : 'files'})
          </span>
        </h2>
      </div>
      
      <div className="file-list">
        {files.map((file) => (
          <div key={file.id} className="file-item">
            <div className="file-info">
              <div className="file-icon">{getFileIcon(file.type)}</div>
              <div className="file-details">
                <h4 className="file-name">{file.name}</h4>
                <div className="file-meta">
                  <span className="file-meta-item">
                    <strong>Size:</strong> {formatFileSize(file.size)}
                  </span>
                  {file.type && (
                    <span className="file-meta-item">
                      <strong>Type:</strong> {file.type}
                    </span>
                  )}
                  <span className="file-meta-item">
                    <strong>Uploaded:</strong> {formatDate(file.uploadedAt)}
                  </span>
                  {file.owner && (
                    <span className="file-meta-item">
                      <strong>Owner:</strong> {file.owner}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(file.id)}
              title="Delete file"
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;

// Made with Bob
