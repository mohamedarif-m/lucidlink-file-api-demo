const request = require('supertest');
const app = require('../backend/server');
const fileService = require('../backend/services/fileService');

describe('File API Endpoints', () => {
  // Clear files before each test
  beforeEach(() => {
    fileService.clearAll();
  });

  describe('GET /health', () => {
    test('should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/files', () => {
    test('should return empty array initially', async () => {
      const response = await request(app).get('/api/files');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return list of files', async () => {
      // Add test files
      await fileService.uploadFile({ name: 'test1.txt', size: 1024 });
      await fileService.uploadFile({ name: 'test2.txt', size: 2048 });

      const response = await request(app).get('/api/files');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('POST /api/files/upload', () => {
    test('should upload file successfully', async () => {
      const fileData = {
        name: 'test.txt',
        size: 1024,
        type: 'text/plain'
      };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('test.txt');
      expect(response.body.data.size).toBe(1024);
      expect(response.body.data.id).toBeDefined();
    });

    test('should reject upload without name', async () => {
      const fileData = { size: 1024 };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('name');
    });

    test('should reject upload without size', async () => {
      const fileData = { name: 'test.txt' };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('size');
    });

    test('should reject file exceeding 200MB size limit', async () => {
      const fileData = {
        name: 'large-file.mp4',
        size: 201 * 1024 * 1024, // 201MB
        type: 'video/mp4'
      };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('200MB');
    });

    test('should accept file at exactly 200MB', async () => {
      const fileData = {
        name: 'max-size-file.mp4',
        size: 200 * 1024 * 1024, // Exactly 200MB
        type: 'video/mp4'
      };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.size).toBe(200 * 1024 * 1024);
    });

    test('should reject file with zero size', async () => {
      const fileData = {
        name: 'empty-file.txt',
        size: 0,
        type: 'text/plain'
      };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('greater than 0');
    });

    test('should reject file with negative size', async () => {
      const fileData = {
        name: 'invalid-file.txt',
        size: -1024,
        type: 'text/plain'
      };

      const response = await request(app)
        .post('/api/files/upload')
        .send(fileData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('greater than 0');
    });
  });

  describe('GET /api/files/:id', () => {
    test('should get file by id', async () => {
      const file = await fileService.uploadFile({
        name: 'test.txt',
        size: 1024
      });

      const response = await request(app).get(`/api/files/${file.id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(file.id);
    });

    test('should return 404 for non-existent file', async () => {
      const response = await request(app).get('/api/files/999999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/files/:id', () => {
    test('should delete file successfully', async () => {
      const file = await fileService.uploadFile({
        name: 'test.txt',
        size: 1024
      });

      const response = await request(app).delete(`/api/files/${file.id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify file is deleted
      const files = await fileService.listFiles();
      expect(files.length).toBe(0);
    });

    test('should return 404 when deleting non-existent file', async () => {
      const response = await request(app).delete('/api/files/999999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/files/stats/storage', () => {
    test('should return storage statistics', async () => {
      await fileService.uploadFile({ name: 'test1.txt', size: 1024 });
      await fileService.uploadFile({ name: 'test2.txt', size: 2048 });

      const response = await request(app).get('/api/files/stats/storage');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalFiles).toBe(2);
      expect(response.body.data.totalBytes).toBe(3072);
      expect(response.body.data.averageFileSize).toBe(1536);
    });

    test('should return zero stats when no files', async () => {
      const response = await request(app).get('/api/files/stats/storage');
      expect(response.status).toBe(200);
      expect(response.body.data.totalFiles).toBe(0);
      expect(response.body.data.totalBytes).toBe(0);
    });
  });
});

// Made with Bob
