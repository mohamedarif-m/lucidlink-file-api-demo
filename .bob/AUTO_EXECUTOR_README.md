# Bob Auto-Executor with BobShell Integration

## Overview

The Bob Auto-Executor is an automated system that monitors GitHub Pull Requests created by Bob and automatically:
- ✅ Checks out PR branches
- ✅ Runs tests
- ✅ Comments on PRs with results
- ✅ Auto-merges (optional)
- ✅ Integrates with BobShell for notifications

## Features

### 🔄 Automatic PR Processing
- Polls GitHub every 5 minutes for open PRs
- Identifies PRs created by Bob (title starts with `[Bob]` or branch starts with `bob/`)
- Automatically checks out the PR branch locally
- Pulls latest changes

### 🧪 Test Execution
- Runs `npm test` automatically
- Reports test results in PR comments
- Prevents merge if tests fail

### 🔀 Auto-Merge (Optional)
- Can automatically merge PRs when tests pass
- Uses squash merge strategy
- Cleans up local branches after merge
- Configurable via `config.json`

### 📊 Logging & Notifications
- Comprehensive logging to `.bob/auto-executor.log`
- Comments on PRs with execution status
- Real-time console output

## Installation

### 1. Configuration

The auto-executor uses the existing `.bob/config.json`:

```json
{
  "github": {
    "autoExecutor": {
      "enabled": true,
      "interval": 300000,
      "checkoutPRs": true,
      "runTests": true,
      "autoMerge": false,
      "notifyOnSuccess": true,
      "notifyOnFailure": true
    }
  }
}
```

### 2. Make Script Executable

```bash
chmod +x .bob/auto-executor.js
```

## Usage

### Start Auto-Executor

```bash
# Run in foreground
node .bob/auto-executor.js

# Run in background
node .bob/auto-executor.js > .bob/auto-executor.log 2>&1 &

# Or use the convenience script
npm run auto-executor
```

### Watch Logs

```bash
# Real-time log monitoring
tail -f .bob/auto-executor.log

# Or use the watch script
./watch-auto-executor.sh
```

### Stop Auto-Executor

```bash
# If running in foreground
Ctrl+C

# If running in background
pkill -f "node .bob/auto-executor.js"
```

## How It Works

### 1. PR Detection
```
🔍 Checking for Bob PRs...
   Found 3 total open PRs
   🎯 Found 1 Bob PR(s) to process
```

### 2. Branch Checkout
```
🔄 Processing PR #6: [Bob] Add LucidLink API Integration Screen
   Branch: bob/issue-5-lucidlink-integration
   🔧 Fetching latest changes...
   🔧 Checking out branch...
   🔧 Pulling latest changes...
```

### 3. Test Execution
```
   🧪 Running tests...
   🔧 Running test suite...
   ✅ All tests passed!
```

### 4. Auto-Merge (if enabled)
```
   🔀 Auto-merging PR...
   ✅ PR #6 merged successfully!
   🔧 Switching back to main branch...
   🔧 Cleaning up local branch...
```

## Configuration Options

### Auto-Merge Settings

**Disabled (Default - Manual Review):**
```json
{
  "autoExecutor": {
    "autoMerge": false
  }
}
```
- PRs are checked out and tested
- Results are commented on PR
- Manual merge required

**Enabled (Fully Automated):**
```json
{
  "autoExecutor": {
    "autoMerge": true
  }
}
```
- PRs are automatically merged if tests pass
- Branch is cleaned up after merge
- Main branch is updated

### Test Settings

**Run Tests (Default):**
```json
{
  "autoExecutor": {
    "runTests": true
  }
}
```

**Skip Tests:**
```json
{
  "autoExecutor": {
    "runTests": false
  }
}
```

## Integration with BobShell

The auto-executor integrates seamlessly with BobShell:

### 1. Automatic Notifications
When a PR is processed, Bob can be notified via BobShell:
```bash
# Bob receives notification
"PR #6 has been checked out and tests passed!"
```

### 2. Manual Trigger
You can manually trigger PR execution via BobShell:
```bash
# Tell Bob to execute a specific PR
"Execute PR #6"
```

### 3. Status Queries
Check auto-executor status:
```bash
# Ask Bob
"What's the status of auto-executor?"
"Show me recent PR executions"
```

## Workflow Example

### Scenario: New Feature PR

1. **Bob creates Issue #7**: "Add user authentication"
2. **Bob implements feature**: Creates branch `bob/issue-7-auth`
3. **Bob creates PR #8**: "[Bob] Add User Authentication"
4. **Auto-Executor detects PR** (within 5 minutes)
5. **Auto-Executor checks out branch**
6. **Auto-Executor runs tests**
7. **Tests pass** ✅
8. **Auto-Executor comments on PR**: "✅ Tests passed!"
9. **Manual review** (if autoMerge: false)
10. **Merge PR** (manual or automatic)

## Logs

### Log Files

- **Auto-Executor Log**: `.bob/auto-executor.log`
- **Polling Log**: `.bob/polling.log`

### Log Format

```
[2026-03-29T01:54:30.123Z] 🔍 Checking for Bob PRs...
[2026-03-29T01:54:30.456Z]    Found 1 Bob PR(s) to process
[2026-03-29T01:54:31.789Z] 🔄 Processing PR #6: [Bob] Add Feature
[2026-03-29T01:54:32.012Z]    🔧 Fetching latest changes...
[2026-03-29T01:54:33.345Z]    ✅ All tests passed!
```

## Troubleshooting

### Issue: Auto-Executor Not Starting

**Check:**
1. GitHub token is configured in `.bob/mcp.json`
2. Repository is configured in `.bob/config.json`
3. Node.js is installed

**Solution:**
```bash
node .bob/auto-executor.js
# Check for error messages
```

### Issue: Tests Failing

**Check:**
1. Dependencies are installed: `npm install`
2. Test command is correct in `package.json`
3. Tests pass locally: `npm test`

### Issue: PR Not Detected

**Check:**
1. PR title starts with `[Bob]` or branch starts with `bob/`
2. PR is in "open" state
3. Polling interval has elapsed (5 minutes)

**Solution:**
```bash
# Check logs
tail -f .bob/auto-executor.log

# Manually trigger
node .bob/auto-executor.js
```

## Safety Features

### 🛡️ Built-in Safeguards

1. **Test Requirement**: PRs won't merge if tests fail
2. **Manual Override**: Auto-merge can be disabled
3. **Branch Protection**: Main branch is never directly modified
4. **Error Handling**: Failures are logged and reported
5. **Rate Limiting**: Respects GitHub API rate limits

## Advanced Usage

### Custom Test Command

Edit `package.json`:
```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:integration": "npm run test && npm run test:e2e"
  }
}
```

### Multiple Repositories

Run separate auto-executors for different repos:
```bash
# Repo 1
cd /path/to/repo1
node .bob/auto-executor.js &

# Repo 2
cd /path/to/repo2
node .bob/auto-executor.js &
```

### Scheduled Execution

Use cron for scheduled execution:
```bash
# Run every 5 minutes
*/5 * * * * cd /path/to/repo && node .bob/auto-executor.js
```

## Best Practices

1. **Start with autoMerge: false** - Review PRs manually first
2. **Monitor logs regularly** - Check for issues
3. **Keep tests fast** - Auto-executor runs them frequently
4. **Use branch protection** - Require reviews on main branch
5. **Test the auto-executor** - Create test PRs to verify behavior

## Next Steps

1. ✅ Start the auto-executor
2. ✅ Create a test PR
3. ✅ Monitor the logs
4. ✅ Review PR comments
5. ✅ Enable auto-merge (optional)

## Support

For issues or questions:
1. Check logs: `.bob/auto-executor.log`
2. Review configuration: `.bob/config.json`
3. Test manually: `node .bob/auto-executor.js`

---

**Made with ❤️ by Bob AI Developer**