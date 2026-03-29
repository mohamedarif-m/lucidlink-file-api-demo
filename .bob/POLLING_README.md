# Bob GitHub Polling System

## 🎯 What This Actually Does

This is a **real, working polling system** that monitors your GitHub repository for issues every 5 minutes and logs all activity.

## ✅ What Works

- ✅ Polls GitHub API every 5 minutes
- ✅ Logs every poll attempt (even when no issues found)
- ✅ Filters issues by labels (`bob`, `ai-task`, `enhancement`)
- ✅ Ignores issues with labels (`wontfix`, `duplicate`, `on-hold`)
- ✅ Shows API rate limit status
- ✅ Writes to `.bob/polling.log`
- ✅ Runs independently of VS Code

## 🚀 How to Start Polling

### Option 1: Run in Foreground (See Live Output)
```bash
npm run poll
```

You'll see output like:
```
[2024-03-29T00:15:00.000Z] 🤖 Bob GitHub Poller Started
[2024-03-29T00:15:00.001Z]    Polling interval: 300 seconds (5 minutes)
[2024-03-29T00:15:00.002Z]    Log file: /path/to/.bob/polling.log
[2024-03-29T00:15:01.123Z] 🔍 Polling GitHub for issues...
[2024-03-29T00:15:01.124Z]    Repository: mohamedarif-m/lucidlink-file-api-demo
[2024-03-29T00:15:01.125Z]    Target labels: bob, ai-task, enhancement
[2024-03-29T00:15:02.456Z]    Found 3 total open issues
[2024-03-29T00:15:02.457Z] ✅ No issues need Bob's attention
[2024-03-29T00:15:02.789Z] 📊 API Rate Limit: 4998 requests remaining (resets at 1:15:00 AM)
```

Press `Ctrl+C` to stop.

### Option 2: Run in Background (Keeps Running)
```bash
npm run poll:background
```

This runs the poller in the background and writes to `.bob/polling.log`.

To stop background polling:
```bash
# Find the process
ps aux | grep poller.js

# Kill it (replace PID with actual process ID)
kill <PID>
```

### Option 3: Run Directly
```bash
node .bob/poller.js
```

## 📊 View Polling Logs

### Watch logs in real-time:
```bash
tail -f .bob/polling.log
```

### View last 50 lines:
```bash
tail -n 50 .bob/polling.log
```

### Search for specific issues:
```bash
grep "issue" .bob/polling.log
```

## 🔍 What Gets Logged

Every 5 minutes, you'll see:

1. **Poll Start**: Timestamp and configuration
2. **Issues Found**: Total count and filtered count
3. **Issue Details**: Number, title, labels, URL (if any match)
4. **Rate Limit**: Remaining API calls
5. **Separator**: Visual break between polls

Example log entry:
```
[2024-03-29T00:15:00.000Z] 🔍 Polling GitHub for issues...
[2024-03-29T00:15:00.001Z]    Repository: mohamedarif-m/lucidlink-file-api-demo
[2024-03-29T00:15:00.002Z]    Target labels: bob, ai-task, enhancement
[2024-03-29T00:15:01.123Z]    Found 5 total open issues
[2024-03-29T00:15:01.124Z] 🎯 Found 2 issue(s) for Bob:
[2024-03-29T00:15:01.125Z]    - #42: Add file size validation
[2024-03-29T00:15:01.126Z]      Labels: bob, enhancement
[2024-03-29T00:15:01.127Z]      URL: https://github.com/mohamedarif-m/lucidlink-file-api-demo/issues/42
[2024-03-29T00:15:01.128Z]    - #43: Implement file type filtering
[2024-03-29T00:15:01.129Z]      Labels: ai-task, enhancement
[2024-03-29T00:15:01.130Z]      URL: https://github.com/mohamedarif-m/lucidlink-file-api-demo/issues/43
[2024-03-29T00:15:01.131Z] 
[2024-03-29T00:15:01.132Z] 💡 To work on these issues, tell Bob:
[2024-03-29T00:15:01.133Z]    "Work on GitHub issue #42"
[2024-03-29T00:15:01.134Z]    "Work on GitHub issue #43"
[2024-03-29T00:15:02.456Z] 📊 API Rate Limit: 4998 requests remaining (resets at 1:15:00 AM)
[2024-03-29T00:15:02.457Z] ────────────────────────────────────────────────────────────────────────────────
```

## ⚙️ Configuration

Edit `.bob/config.json` to change:

```json
{
  "github": {
    "polling": {
      "enabled": true,
      "interval": 300000,        // 5 minutes (in milliseconds)
      "repository": "username/repo",
      "labels": ["bob", "ai-task", "enhancement"],
      "ignoreLabels": ["wontfix", "duplicate", "on-hold"]
    }
  }
}
```

### Change Polling Interval:
- **1 minute**: `60000`
- **5 minutes**: `300000` (recommended)
- **10 minutes**: `600000`
- **30 minutes**: `1800000`

## 🔐 Authentication

The poller uses the GitHub token from `.bob/mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "github_pat_..."
      }
    }
  }
}
```

**Required token permissions:**
- ✅ `repo` - Access repository issues
- ✅ `read:org` - Read organization data (if private repo)

## 📈 GitHub API Rate Limits

- **Authenticated**: 5,000 requests/hour
- **Polling every 5 minutes**: 12 requests/hour
- **Plenty of headroom**: 4,988 requests for other operations

The poller shows remaining rate limit after each poll.

## 🐛 Troubleshooting

### Poller won't start
```bash
# Check if token is valid
node -e "console.log(require('./.bob/mcp.json').mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN)"

# Should show: github_pat_...
# If shows: ghp_your_token_here - UPDATE YOUR TOKEN!
```

### No issues found but you know they exist
```bash
# Check issue labels in GitHub
# Make sure issues have: bob, ai-task, or enhancement label
# Make sure issues don't have: wontfix, duplicate, or on-hold label
```

### Rate limit errors
```bash
# Check current rate limit
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit
```

### Poller stops unexpectedly
```bash
# Check logs for errors
tail -n 100 .bob/polling.log | grep "❌"
```

## 🎯 For Your Demo

### Before Demo:
1. Start the poller: `npm run poll`
2. Create test issues with `bob` label
3. Wait 5 minutes (or less if you changed interval)
4. Show the logs updating automatically

### During Demo:
1. Show live polling output
2. Create a new issue with `bob` label
3. Wait for next poll cycle
4. Show Bob detecting the new issue
5. Tell Bob: "Work on GitHub issue #X"

### Talking Points:
- ✅ "Polls every 5 minutes automatically"
- ✅ "Logs all activity for audit trail"
- ✅ "Filters by labels for organization"
- ✅ "Shows API rate limit status"
- ✅ "Runs independently - no manual checking needed"

## 🔄 What This Doesn't Do (Yet)

This poller **monitors and logs** issues. It does NOT:
- ❌ Automatically create branches
- ❌ Automatically make code changes
- ❌ Automatically create PRs

**Why?** Bob needs to be told explicitly to work on issues. The poller just notifies you.

**To work on detected issues:**
```
Bob, work on GitHub issue #42
```

Bob will then:
1. Create a branch
2. Analyze the issue
3. Make code changes
4. Run tests
5. Create a PR

## 📝 Next Steps

1. **Start polling**: `npm run poll`
2. **Create test issues** with `bob` label
3. **Watch the logs** update every 5 minutes
4. **Tell Bob to work** on detected issues

## 🎉 Summary

You now have a **real, working polling system** that:
- ✅ Runs every 5 minutes
- ✅ Logs all activity
- ✅ Monitors your GitHub repository
- ✅ Filters issues by labels
- ✅ Shows what Bob can work on

**Start it now**: `npm run poll`