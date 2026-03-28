# GitHub Issues for Demo

Copy and paste these issues into your GitHub repository before the demo.

---

## Issue #1: Add File Size Validation

**Title:** Add file size validation to upload endpoint

**Description:**
```markdown
## Overview
Implement validation to prevent files larger than 100MB from being uploaded to the API.

## Requirements
- [ ] Add file size validation in the upload endpoint
- [ ] Return clear error message when file exceeds 100MB limit
- [ ] Use the existing validator utility
- [ ] Add unit tests for size validation
- [ ] Update API documentation in README

## Acceptance Criteria
- Files under 100MB upload successfully
- Files over 100MB are rejected with 400 status
- Error message clearly states the size limit
- All tests pass
- Documentation is updated

## Technical Notes
- Use the `validateFileSize` function from `backend/utils/validator.js`
- Update the `uploadFile` method in `backend/routes/files.js`
- Add test cases in `tests/files.test.js`

## Priority
High - Security and resource management concern
```

**Labels:** `enhancement`, `good first issue`, `priority: high`

---

## Issue #2: Implement File Metadata Endpoint

**Title:** Add GET /api/files/:id/metadata endpoint

**Description:**
```markdown
## Overview
Create a new endpoint that returns detailed metadata for a specific file without returning the full file content.

## Requirements
- [ ] Create new route `GET /api/files/:id/metadata`
- [ ] Return file size, type, upload date, and owner information
- [ ] Add error handling for missing files (404)
- [ ] Write integration tests for the new endpoint
- [ ] Update README with new endpoint documentation
- [ ] Add usage examples

## Response Format
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "name": "document.pdf",
    "size": 1048576,
    "sizeFormatted": "1.00 MB",
    "type": "application/pdf",
    "uploadedAt": "2024-03-28T10:30:00Z",
    "owner": "user@example.com",
    "checksum": "abc123..."
  }
}
```

## Acceptance Criteria
- Endpoint returns correct metadata for existing files
- Returns 404 for non-existent files
- Response includes all required fields
- Tests cover success and error cases
- Documentation is complete with examples

## Technical Notes
- Add new method in `backend/services/fileService.js`
- Create route in `backend/routes/files.js`
- Consider adding file checksum for integrity verification
- Format file size in human-readable format (MB, GB)

## Priority
Medium - Useful for client applications
```

**Labels:** `feature`, `api`, `priority: medium`

---

## Issue #3: Add Rate Limiting

**Title:** Implement rate limiting for API endpoints

**Description:**
```markdown
## Overview
Add rate limiting to prevent API abuse and ensure fair usage across all clients.

## Requirements
- [ ] Implement rate limiting middleware
- [ ] Limit to 100 requests per minute per IP address
- [ ] Return 429 (Too Many Requests) status when limit exceeded
- [ ] Add rate limit information in response headers
- [ ] Document rate limits in README
- [ ] Add tests for rate limiting behavior
- [ ] Make rate limits configurable via environment variables

## Response Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Error Response
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 45
}
```

## Acceptance Criteria
- Rate limiting works correctly per IP
- Headers are included in all responses
- 429 status returned when limit exceeded
- Rate limits are configurable
- Tests verify limiting behavior
- Documentation includes rate limit details

## Technical Notes
- Consider using `express-rate-limit` package
- Store rate limit data in memory (Redis for production)
- Apply to all `/api/*` routes
- Whitelist health check endpoint
- Add environment variables: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`

## Priority
High - Security and stability concern
```

**Labels:** `security`, `enhancement`, `priority: high`

---

## Issue #4: Add File Compression Support (For Live Demo)

**Title:** Add file compression support

**Description:**
```markdown
## Overview
Implement automatic file compression to reduce storage requirements and improve transfer speeds.

## Requirements
- [ ] Add compression utility using gzip
- [ ] Compress files automatically on upload
- [ ] Decompress files on retrieval
- [ ] Store both compressed and original size
- [ ] Add compression ratio to metadata
- [ ] Write comprehensive tests
- [ ] Update documentation

## Implementation Details
- Use Node.js `zlib` module for compression
- Add `compressed` flag to file metadata
- Store compression ratio for statistics
- Make compression optional via config

## Acceptance Criteria
- Files are compressed on upload
- Decompression is transparent to clients
- Metadata includes compression info
- Tests cover compression/decompression
- Documentation explains compression feature
- Performance benchmarks included

## Technical Notes
- Add `backend/utils/compression.js`
- Update `fileService.js` to use compression
- Add `compressionRatio` field to file objects
- Consider compression threshold (don't compress small files)

## Priority
Medium - Performance optimization
```

**Labels:** `feature`, `performance`, `priority: medium`

---

## Issue #5: Implement File Search

**Title:** Add file search functionality

**Description:**
```markdown
## Overview
Allow users to search for files by name, type, or date range.

## Requirements
- [ ] Add search endpoint `GET /api/files/search`
- [ ] Support search by filename (partial match)
- [ ] Support filter by file type
- [ ] Support filter by date range
- [ ] Return paginated results
- [ ] Add sorting options
- [ ] Write comprehensive tests
- [ ] Document search API

## Query Parameters
```
?q=document          # Search term
&type=application/pdf # File type filter
&from=2024-01-01     # Date range start
&to=2024-12-31       # Date range end
&sort=name           # Sort field
&order=asc           # Sort order
&page=1              # Page number
&limit=20            # Results per page
```

## Response Format
```json
{
  "success": true,
  "data": {
    "files": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

## Acceptance Criteria
- Search works with partial filename matches
- Filters work correctly
- Pagination works as expected
- Sorting works for all fields
- Tests cover all search scenarios
- Documentation includes examples

## Technical Notes
- Add search method in `fileService.js`
- Implement case-insensitive search
- Consider adding fuzzy search later
- Optimize for large file lists

## Priority
Low - Nice to have feature
```

**Labels:** `feature`, `enhancement`, `priority: low`

---

## Issue #6: Add File Versioning

**Title:** Implement file versioning system

**Description:**
```markdown
## Overview
Add support for maintaining multiple versions of the same file.

## Requirements
- [ ] Store file version history
- [ ] Add version number to file metadata
- [ ] Create endpoint to list file versions
- [ ] Create endpoint to retrieve specific version
- [ ] Add endpoint to restore previous version
- [ ] Implement version cleanup (keep last N versions)
- [ ] Write comprehensive tests
- [ ] Update documentation

## New Endpoints
- `GET /api/files/:id/versions` - List all versions
- `GET /api/files/:id/versions/:version` - Get specific version
- `POST /api/files/:id/restore/:version` - Restore version

## Acceptance Criteria
- New uploads create new versions
- Version history is maintained
- Old versions can be retrieved
- Versions can be restored
- Cleanup works correctly
- Tests cover all scenarios
- Documentation is complete

## Technical Notes
- Add `version` field to file objects
- Store version history array
- Consider storage implications
- Make version limit configurable

## Priority
Low - Advanced feature
```

**Labels:** `feature`, `enhancement`, `priority: low`

---

## How to Use These Issues

### Before Demo:
1. Create Issues #1, #2, and #3 in your GitHub repository
2. Add appropriate labels
3. Keep Issue #4 ready to paste during live demo

### During Demo:
1. Show existing issues (#1, #2, #3)
2. Create Issue #4 live during presentation
3. Watch Bob detect and work on Issue #4
4. Show Bob's commits and PR

### After Demo:
- Issues #5 and #6 can be used for extended demos
- Or as examples of Bob handling complex features
- Good for Q&A about Bob's capabilities

---

## Tips for Creating Issues

**Good Issue Characteristics:**
- Clear, specific requirements
- Acceptance criteria defined
- Technical notes included
- Appropriate priority/labels
- Realistic scope (completable in 5-10 minutes for demo)

**For Live Demo:**
- Choose Issue #4 (compression) - good complexity
- Shows multi-file changes
- Requires new utility creation
- Includes tests and documentation
- Demonstrates Bob's full capabilities

**Avoid:**
- Vague requirements
- Too large scope
- Missing acceptance criteria
- Unclear technical direction