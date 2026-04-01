import React, { useState } from 'react';

const UploadForm = ({ onUpload, uploading }) => {
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    type: 'application/octet-stream',
    owner: 'Demo User',
  });

  const fileTypes = [
    { value: 'image/jpeg', label: 'JPEG Image' },
    { value: 'image/png', label: 'PNG Image' },
    { value: 'image/gif', label: 'GIF Image' },
    { value: 'application/pdf', label: 'PDF Document' },
    { value: 'text/plain', label: 'Text File' },
    { value: 'application/json', label: 'JSON File' },
    { value: 'video/mp4', label: 'MP4 Video' },
    { value: 'application/octet-stream', label: 'Other' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert size to bytes (input is in MB, whole numbers)
    const sizeInBytes = parseInt(formData.size) * 1024 * 1024;
    
    onUpload({
      ...formData,
      size: sizeInBytes,
    });

    // Reset form
    setFormData({
      name: '',
      size: '',
      type: 'application/octet-stream',
      owner: 'Demo User',
    });
  };

  // Auto-generate file size and type based on filename
  const generateFileSizeAndType = (filename) => {
    if (!filename) return { size: '', type: 'application/octet-stream' };
    
    const extension = filename.split('.').pop().toLowerCase();
    
    // Typical file sizes by extension (in MB)
    const typicalSizes = {
      // Images
      'jpg': 3, 'jpeg': 3, 'png': 3, 'gif': 2, 'webp': 2, 'svg': 1,
      // Documents
      'pdf': 5, 'doc': 2, 'docx': 2, 'xls': 2, 'xlsx': 2, 'ppt': 8, 'pptx': 8, 'txt': 1,
      // Videos
      'mp4': 50, 'avi': 80, 'mov': 60, 'mkv': 70, 'webm': 40,
      // Audio
      'mp3': 4, 'wav': 10, 'flac': 25,
      // Archives
      'zip': 15, 'rar': 15, '7z': 12, 'tar': 20,
      // Code/Data
      'json': 1, 'xml': 1, 'csv': 1, 'js': 1, 'py': 1, 'java': 1,
    };
    
    // MIME types by extension
    const mimeTypes = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
      'pdf': 'application/pdf', 'txt': 'text/plain', 'json': 'application/json',
      'mp4': 'video/mp4',
    };
    
    const size = typicalSizes[extension] || 2;
    const type = mimeTypes[extension] || 'application/octet-stream';
    
    // Return whole number for size
    return { size: Math.round(size).toString(), type };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If filename changes, auto-generate size and type
    if (name === 'name') {
      const { size, type } = generateFileSizeAndType(value);
      setFormData(prev => ({
        ...prev,
        name: value,
        size: size,
        type: type,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isValid = formData.name && formData.size && parseInt(formData.size) > 0;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📁 Upload File</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="name">File Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., document.pdf"
              required
            />
            <small className="input-hint">
              💡 Size and type will auto-fill based on extension
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="size">File Size (MB) *</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Auto-generated"
              step="1"
              min="1"
              max="300"
              required
            />
            <small className="input-hint">
              Enter file size in MB (1-300 MB allowed)
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="type">File Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {fileTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="owner">Owner</label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="e.g., John Doe"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid || uploading}
        >
          {uploading ? (
            <>
              <span className="spinner" style={{ 
                width: '16px', 
                height: '16px', 
                borderWidth: '2px',
                borderTopColor: 'white'
              }}></span>
              Uploading...
            </>
          ) : (
            <>
              ⬆️ Upload File
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;

// Made with Bob
