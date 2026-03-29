/**
 * LucidLink API Integration Service
 * 
 * This service provides integration with LucidLink REST APIs
 * For demo purposes, it uses mock data but follows the real API structure
 */

// Mock data for demo purposes
const mockFilespaces = [
  {
    id: 'fs-prod-001',
    name: 'Production',
    domain: 'demo.lucidlink.com',
    status: 'active',
    storage: {
      total: 2500000000000, // 2.5 TB in bytes
      used: 1800000000000,  // 1.8 TB in bytes
      available: 700000000000
    },
    created: '2024-01-15T10:00:00Z',
    lastModified: '2024-03-28T15:30:00Z'
  },
  {
    id: 'fs-dev-002',
    name: 'Development',
    domain: 'demo.lucidlink.com',
    status: 'active',
    storage: {
      total: 1000000000000, // 1 TB
      used: 450000000000,   // 450 GB
      available: 550000000000
    },
    created: '2024-02-01T09:00:00Z',
    lastModified: '2024-03-27T12:15:00Z'
  },
  {
    id: 'fs-test-003',
    name: 'Testing',
    domain: 'demo.lucidlink.com',
    status: 'active',
    storage: {
      total: 500000000000,  // 500 GB
      used: 125000000000,   // 125 GB
      available: 375000000000
    },
    created: '2024-02-15T14:00:00Z',
    lastModified: '2024-03-26T18:45:00Z'
  }
];

const mockDomains = [
  {
    id: 'dom-001',
    name: 'demo.lucidlink.com',
    status: 'active',
    filespaceCount: 3,
    totalStorage: 4000000000000, // 4 TB
    created: '2024-01-01T00:00:00Z'
  }
];

/**
 * Format bytes to human-readable format
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get all filespaces
 */
const getFilespaces = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    success: true,
    data: mockFilespaces.map(fs => ({
      ...fs,
      storage: {
        ...fs.storage,
        totalFormatted: formatBytes(fs.storage.total),
        usedFormatted: formatBytes(fs.storage.used),
        availableFormatted: formatBytes(fs.storage.available),
        usedPercentage: Math.round((fs.storage.used / fs.storage.total) * 100)
      }
    })),
    count: mockFilespaces.length
  };
};

/**
 * Get filespace by ID
 */
const getFilespaceById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const filespace = mockFilespaces.find(fs => fs.id === id);
  
  if (!filespace) {
    return {
      success: false,
      error: 'Filespace not found'
    };
  }
  
  return {
    success: true,
    data: {
      ...filespace,
      storage: {
        ...filespace.storage,
        totalFormatted: formatBytes(filespace.storage.total),
        usedFormatted: formatBytes(filespace.storage.used),
        availableFormatted: formatBytes(filespace.storage.available),
        usedPercentage: Math.round((filespace.storage.used / filespace.storage.total) * 100)
      }
    }
  };
};

/**
 * Create new filespace
 */
const createFilespace = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newFilespace = {
    id: `fs-${Date.now()}`,
    name: data.name,
    domain: data.domain || 'demo.lucidlink.com',
    status: 'active',
    storage: {
      total: data.storageSize || 1000000000000, // Default 1 TB
      used: 0,
      available: data.storageSize || 1000000000000
    },
    created: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  mockFilespaces.push(newFilespace);
  
  return {
    success: true,
    data: {
      ...newFilespace,
      storage: {
        ...newFilespace.storage,
        totalFormatted: formatBytes(newFilespace.storage.total),
        usedFormatted: formatBytes(newFilespace.storage.used),
        availableFormatted: formatBytes(newFilespace.storage.available),
        usedPercentage: 0
      }
    },
    message: 'Filespace created successfully'
  };
};

/**
 * Delete filespace
 */
const deleteFilespace = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockFilespaces.findIndex(fs => fs.id === id);
  
  if (index === -1) {
    return {
      success: false,
      error: 'Filespace not found'
    };
  }
  
  mockFilespaces.splice(index, 1);
  
  return {
    success: true,
    message: 'Filespace deleted successfully'
  };
};

/**
 * Get all domains
 */
const getDomains = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    success: true,
    data: mockDomains.map(domain => ({
      ...domain,
      totalStorageFormatted: formatBytes(domain.totalStorage)
    })),
    count: mockDomains.length
  };
};

/**
 * Get connection status
 */
const getConnectionStatus = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    data: {
      connected: true,
      domain: 'demo.lucidlink.com',
      apiVersion: 'v1.0.0',
      lastSync: new Date().toISOString()
    }
  };
};

/**
 * Get storage statistics across all filespaces
 */
const getStorageStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const totalStorage = mockFilespaces.reduce((sum, fs) => sum + fs.storage.total, 0);
  const usedStorage = mockFilespaces.reduce((sum, fs) => sum + fs.storage.used, 0);
  const availableStorage = totalStorage - usedStorage;
  
  return {
    success: true,
    data: {
      totalFilespaces: mockFilespaces.length,
      totalStorage,
      usedStorage,
      availableStorage,
      totalStorageFormatted: formatBytes(totalStorage),
      usedStorageFormatted: formatBytes(usedStorage),
      availableStorageFormatted: formatBytes(availableStorage),
      usedPercentage: Math.round((usedStorage / totalStorage) * 100)
    }
  };
};

module.exports = {
  getFilespaces,
  getFilespaceById,
  createFilespace,
  deleteFilespace,
  getDomains,
  getConnectionStatus,
  getStorageStats,
  formatBytes
};

// Made with Bob