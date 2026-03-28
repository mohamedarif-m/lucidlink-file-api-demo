# Bob GitHub Polling Configuration Guide

Complete setup to enable Bob as an autonomous developer that automatically polls GitHub issues.

## 📋 What You've Already Done

✅ Added GitHub MCP server to `.bob/mcp.json`
✅ Created polling configuration in `.bob/config.json`

## 🔧 Configuration Files

### 1. `.bob/mcp.json` (GitHub Connection)
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### 2. `.bob/config.json` (Polling Behavior)
```json
{
  "github": {
    "polling": {
      "enabled": true,
      "interval": 300000,
      "repository": "YOUR_USERNAME/lucidlink-file-api-demo",
      "labels": ["bob", "ai-task", "enhancement"],
      "ignoreLabels": ["wontfix", "duplicate", "on-hold"],
      "autoAssign": true,
      "maxConcurrentTasks": 1
    },
    "workflow": {
      "autoCommit": true,
      "autoCreatePR": true,
      "branchPrefix": "bob/",
      "commitMessagePrefix": "[Bob]",
      "defaultBranch": "main"
    }
  }
}
```

## 🚀 Setup Steps

### Step 1: Get GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Token name: `Bob AI Developer`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `write:discussion` (optional, for discussions)
5. Click **"Generate token"**
6. **Copy the token immediately** (starts with `ghp_`)

### Step 2: Update Configuration Files

#### A. Update `.bob/mcp.json`
Replace `"ghp_your_token_here"` with your actual token:
```json
"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
```

#### B. Update `.bob/config.json`
Replace `"YOUR_USERNAME/lucidlink-file-api-demo"` with your actual repository:
```json
"repository": "yourusername/lucidlink-file-api-demo"
```

### Step 3: Push Code to GitHub

```bash
cd lucidlink-file-api-demo

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: LucidLink File Manager Demo with Bob config"

# Create main branch
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/lucidlink-file-api-demo.git

# Push
git push -u origin main
```

### Step 4: Create GitHub Issues

Create these issues in your GitHub repository:

#### Issue #1: Add File Size Validation
```markdown
**Title:** Add file size validation to prevent large uploads

**Labels:** bob, enhancement

**Description:**
Currently, the API accepts files of any size. We need to add validation to limit file uploads to a maximum of 100MB.

**Acceptance Criteria:**
- Add MAX_FILE_SIZE constant (100MB)
- Validate file size in upload endpoint
- Return 400 error with clear message for oversized files
- Add test coverage for validation

**Files to modify:**
- backend/routes/files.js
- backend/utils/validator.js
- tests/files.test.js
```

#### Issue #2: Implement File Type Filtering
```markdown
**Title:** Add file type filtering for uploads

**Labels:** bob, enhancement

**Description:**
Add ability to filter allowed file types for security and organization.

**Acceptance Criteria:**
- Support whitelist of allowed MIME types
- Validate file type on upload
- Return 400 error for disallowed types
- Add configuration for allowed types
- Add test coverage

**Files to modify:**
- backend/routes/files.js
- backend/utils/validator.js
- tests/files.test.js
```

#### Issue #3: Improve Error Handling
```markdown
**Title:** Enhance error handling and logging

**Labels:** bob, enhancement

**Description:**
Improve error handling throughout the application with better logging and user-friendly messages.

**Acceptance Criteria:**
- Add structured error logging
- Improve error messages
- Add error tracking
- Handle edge cases
- Add test coverage

**Files to modify:**
- backend/server.js
- backend/routes/files.js
- tests/files.test.js
```

### Step 5: Reload VS Code

**Important:** After updating the configuration files:

1. Open Command Palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type: **"Developer: Reload Window"**
3. Press Enter

Or simply restart VS Code.

### Step 6: Verify Configuration

After reload, open Bob chat and ask:
```
What MCP servers are available?
```

You should see:
- ✅ GitHub MCP server listed
- ✅ Connection status: Active

## 🔄 How Polling Works

### Automatic Workflow:

1. **Every 5 minutes** (300000ms), Bob checks your GitHub repository
2. **Looks for issues** with labels: `bob`, `ai-task`, or `enhancement`
3. **Ignores issues** with labels: `wontfix`, `duplicate`, `on-hold`
4. **For each matching issue**, Bob will:
   - Create a new branch: `bob/issue-{number}-{title}`
   - Analyze the issue requirements
   - Make necessary code changes
   - Run tests to verify changes
   - Commit with message: `[Bob] Fixes #{number}: {title}`
   - Create a pull request
   - Link PR to the original issue

### Configuration Options:

| Setting | Value | Description |
|---------|-------|-------------|
| `enabled` | `true` | Enable/disable polling |
| `interval` | `300000` | Poll every 5 minutes (in milliseconds) |
| `labels` | `["bob", "ai-task", "enhancement"]` | Issues with these labels will be picked up |
| `ignoreLabels` | `["wontfix", "duplicate", "on-hold"]` | Issues with these labels will be ignored |
| `autoAssign` | `true` | Auto-assign issues to Bob |
| `maxConcurrentTasks` | `1` | Work on 1 issue at a time |
| `autoCommit` | `true` | Automatically commit changes |
| `autoCreatePR` | `true` | Automatically create pull requests |
| `branchPrefix` | `"bob/"` | Prefix for created branches |

## 🎯 For Your LucidLink Demo

### Demo Scenario 1: Automatic Polling (Impressive!)

**Setup:**
1. Create Issues #1, #2, #3 with `bob` label
2. Wait 5 minutes or trigger manually
3. Show Bob working autonomously

**Talking Points:**
- "Bob monitors our repository 24/7"
- "Automatically picks up labeled issues"
- "Works while the team sleeps"
- "Creates PRs ready for review"

### Demo Scenario 2: Manual Assignment (More Control)

**Setup:**
1. Create Issue #4 without `bob` label
2. Manually tell Bob: "Work on GitHub issue #4"
3. Show real-time progress

**Talking Points:**
- "Full control over what Bob works on"
- "Can assign specific issues"
- "Watch Bob work in real-time"
- "Perfect for complex tasks"

### Recommended Demo Flow:

1. **Show automatic polling** (Issues #1, #2 already done)
2. **Show manual assignment** (Issue #4 live)
3. **Show PR review** (Bob's code quality)
4. **Show test coverage** (Bob writes tests)

## 🔍 Monitoring Bob's Activity

### Check Bob's Status:
```
Bob, what are you currently working on?
```

### View Recent Activity:
```
Bob, show me your recent GitHub activity
```

### Check Polling Status:
```
Bob, are you polling GitHub issues?
```

## 🐛 Troubleshooting

### Bob Doesn't Poll Automatically

**Check:**
1. ✅ Token is valid and has correct permissions
2. ✅ Repository name is correct in config.json
3. ✅ VS Code has been reloaded
4. ✅ Issues have correct labels
5. ✅ Polling interval hasn't expired yet (wait 5 min)

**Solution:**
```bash
# Verify token works
curl -H "Authorization: token ghp_your_token" https://api.github.com/user

# Check repository access
curl -H "Authorization: token ghp_your_token" \
  https://api.github.com/repos/yourusername/lucidlink-file-api-demo
```

### Bob Can't Create PRs

**Check:**
1. ✅ Token has `repo` scope
2. ✅ Repository exists and is accessible
3. ✅ Branch protection rules allow Bob's commits

### Polling Interval Too Long/Short

**Adjust in `.bob/config.json`:**
```json
"interval": 60000   // 1 minute (faster, more API calls)
"interval": 300000  // 5 minutes (recommended)
"interval": 600000  // 10 minutes (slower, fewer API calls)
```

## 📊 GitHub API Rate Limits

**With authentication:**
- 5,000 requests per hour
- Polling every 5 minutes = 12 requests/hour
- Plenty of headroom for Bob's operations

**Monitor usage:**
```bash
curl -H "Authorization: token ghp_your_token" \
  https://api.github.com/rate_limit
```

## 🔒 Security Best Practices

### Token Security:
- ✅ Never commit `.bob/mcp.json` with token to GitHub
- ✅ Add to `.gitignore`:
  ```
  .bob/mcp.json
  .bob/config.json
  ```
- ✅ Use environment variables in production
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use fine-grained tokens when possible

### Repository Security:
- ✅ Enable branch protection on `main`
- ✅ Require PR reviews before merging
- ✅ Enable status checks
- ✅ Use CODEOWNERS file

## 📝 Next Steps

### For Demo:
1. ✅ Update token in `.bob/mcp.json`
2. ✅ Update repository in `.bob/config.json`
3. ✅ Push code to GitHub
4. ✅ Create labeled issues
5. ✅ Reload VS Code
6. ✅ Wait 5 minutes or trigger manually
7. ✅ Watch Bob work!

### For Production:
1. Set up proper CI/CD pipeline
2. Configure branch protection rules
3. Set up code review process
4. Monitor Bob's activity
5. Adjust polling interval based on team needs

## 🎉 You're Ready!

Bob is now configured to:
- ✅ Poll GitHub every 5 minutes
- ✅ Pick up labeled issues automatically
- ✅ Create branches and PRs
- ✅ Work as an autonomous team member

**Show LucidLink how Bob can reduce their development backlog! 🚀**

---

## Quick Reference

### Configuration Files:
- `.bob/mcp.json` - GitHub connection
- `.bob/config.json` - Polling behavior

### Key Commands:
- Reload: `Cmd+Shift+P` → "Developer: Reload Window"
- Check status: "Bob, what are you working on?"
- Manual trigger: "Bob, work on GitHub issue #X"

### Important URLs:
- Token: https://github.com/settings/tokens
- Repository: https://github.com/yourusername/lucidlink-file-api-demo
- Issues: https://github.com/yourusername/lucidlink-file-api-demo/issues