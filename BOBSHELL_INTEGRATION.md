# BobShell Integration Guide

## Overview

This guide explains how to use BobShell to automatically pull and execute Pull Requests in your project. The Bob Auto-Executor provides seamless integration with BobShell for automated PR management.

## What is BobShell?

BobShell is Bob's command-line interface that allows you to interact with Bob AI Developer through natural language commands. When integrated with the Auto-Executor, it enables fully automated PR workflows.

## Features

### 🤖 Automated PR Execution
- **Auto-Detection**: Automatically finds PRs created by Bob
- **Auto-Checkout**: Checks out PR branches locally
- **Auto-Test**: Runs test suite automatically
- **Auto-Merge**: Optionally merges PRs when tests pass
- **Auto-Notify**: Comments on PRs with execution results

### 🔄 Continuous Integration
- Polls GitHub every 5 minutes
- Processes multiple PRs in sequence
- Maintains clean git history
- Cleans up branches after merge

## Quick Start

### 1. Start Auto-Executor

```bash
# Option 1: Run in foreground (see output)
npm run auto-executor

# Option 2: Run in background
npm run auto-executor:background

# Option 3: Direct execution
node .bob/auto-executor.js &
```

### 2. Monitor Activity

```bash
# Watch logs in real-time
npm run watch-executor

# Or manually
tail -f .bob/auto-executor.log
```

### 3. Create a Test PR

```bash
# Bob creates a PR (example)
git checkout -b bob/test-feature
echo "test" > test.txt
git add test.txt
git commit -m "[Bob] Test feature"
git push origin bob/test-feature

# Create PR via GitHub or API
# Auto-executor will detect it within 5 minutes
```

## BobShell Commands

### Check Status

```bash
# Ask Bob about auto-executor status
"Is auto-executor running?"
"Show me the auto-executor status"
"What PRs are being processed?"
```

### Manual Execution

```bash
# Tell Bob to execute a specific PR
"Execute PR #6"
"Run tests for PR #6"
"Check out and test PR #6"
```

### View Results

```bash
# Ask Bob for execution results
"Show me PR execution results"
"Did PR #6 pass tests?"
"What's the status of recent PRs?"
```

### Control Auto-Executor

```bash
# Start/stop auto-executor
"Start auto-executor"
"Stop auto-executor"
"Restart auto-executor"
```

## Configuration

### Enable/Disable Auto-Merge

Edit `.bob/config.json`:

```json
{
  "github": {
    "autoExecutor": {
      "autoMerge": false  // Change to true for auto-merge
    }
  }
}
```

**Recommended Settings:**

- **Development**: `autoMerge: false` (manual review)
- **Production**: `autoMerge: false` (always review)
- **Testing**: `autoMerge: true` (for testing only)

### Adjust Polling Interval

```json
{
  "github": {
    "autoExecutor": {
      "interval": 300000  // 5 minutes (in milliseconds)
    }
  }
}
```

**Common Intervals:**
- 1 minute: `60000`
- 5 minutes: `300000` (default)
- 10 minutes: `600000`
- 30 minutes: `1800000`

## Workflow Examples

### Example 1: Feature Development

**Scenario**: Bob implements a new feature

```
1. User: "Add dark mode feature"
2. Bob: Creates Issue #8
3. Bob: Implements feature in branch bob/issue-8-dark-mode
4. Bob: Creates PR #9
5. Auto-Executor: Detects PR within 5 minutes
6. Auto-Executor: Checks out branch
7. Auto-Executor: Runs tests
8. Auto-Executor: Comments "✅ Tests passed!"
9. User: Reviews and merges (or auto-merge if enabled)
```

### Example 2: Bug Fix

**Scenario**: Bob fixes a bug

```
1. User: "Fix login validation bug"
2. Bob: Creates branch bob/fix-login-validation
3. Bob: Fixes bug and creates PR #10
4. Auto-Executor: Processes PR
5. Auto-Executor: Tests pass ✅
6. Auto-Executor: Auto-merges (if enabled)
7. Auto-Executor: Cleans up branch
8. User: Notified of successful merge
```

### Example 3: Multiple PRs

**Scenario**: Bob creates multiple PRs

```
1. Bob: Creates PR #11 (Feature A)
2. Bob: Creates PR #12 (Feature B)
3. Auto-Executor: Processes PR #11 first
4. Auto-Executor: Then processes PR #12
5. Both PRs tested and ready for review
```

## Integration with Existing Tools

### GitHub Actions

Auto-Executor works alongside GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test
```

**Benefits:**
- GitHub Actions: Runs on every push
- Auto-Executor: Runs locally, faster feedback
- Both: Provide redundant testing

### VS Code Integration

Use VS Code tasks to control auto-executor:

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Auto-Executor",
      "type": "shell",
      "command": "npm run auto-executor:background"
    },
    {
      "label": "Watch Auto-Executor",
      "type": "shell",
      "command": "npm run watch-executor"
    }
  ]
}
```

## Advanced Usage

### Custom Test Commands

Modify `package.json` to customize test execution:

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:integration": "npm run test && npm run test:e2e",
    "test:quick": "jest --bail --findRelatedTests"
  }
}
```

### Conditional Auto-Merge

Auto-merge only for specific PR types:

```javascript
// In .bob/auto-executor.js, modify isBobPR function:
function isBobPR(pr) {
  const title = pr.title.toLowerCase();
  
  // Auto-merge only for docs and minor fixes
  if (title.includes('[docs]') || title.includes('[minor]')) {
    return true;
  }
  
  // Manual review for features
  return false;
}
```

### Notifications

Add Slack/Discord notifications:

```javascript
// In .bob/auto-executor.js, add after successful merge:
async function notifySlack(message) {
  // Your Slack webhook integration
  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({ text: message })
  });
}
```

## Troubleshooting

### Auto-Executor Not Detecting PRs

**Check:**
1. PR title starts with `[Bob]`
2. Branch name starts with `bob/`
3. PR is in "open" state
4. Polling interval has elapsed

**Solution:**
```bash
# Check logs
tail -f .bob/auto-executor.log

# Manually trigger
node .bob/auto-executor.js
```

### Tests Failing

**Check:**
1. Tests pass locally: `npm test`
2. Dependencies installed: `npm install`
3. Correct Node.js version

**Solution:**
```bash
# Run tests manually
npm test

# Check test output in logs
grep "test" .bob/auto-executor.log
```

### Branch Conflicts

**Check:**
1. Branch is up to date with main
2. No merge conflicts

**Solution:**
```bash
# Update branch
git checkout bob/your-branch
git pull origin main
git push origin bob/your-branch
```

## Best Practices

### 1. Start Conservative
- Begin with `autoMerge: false`
- Review PRs manually first
- Enable auto-merge after confidence builds

### 2. Monitor Regularly
- Check logs daily
- Review PR comments
- Watch for patterns in failures

### 3. Keep Tests Fast
- Auto-executor runs tests frequently
- Optimize test suite for speed
- Use test parallelization

### 4. Use Branch Protection
- Require reviews on main branch
- Require status checks to pass
- Prevent force pushes

### 5. Document Workflows
- Document your PR process
- Train team on auto-executor
- Share best practices

## Security Considerations

### GitHub Token
- Store token securely in `.bob/mcp.json`
- Never commit tokens to git
- Use tokens with minimal required permissions

### Auto-Merge Safety
- Only enable for trusted code
- Require passing tests
- Use branch protection rules
- Review merge history regularly

### Access Control
- Limit who can create Bob PRs
- Use GitHub teams for permissions
- Monitor auto-executor logs

## Performance Tips

### 1. Optimize Polling
```json
{
  "autoExecutor": {
    "interval": 300000  // Balance between responsiveness and API limits
  }
}
```

### 2. Parallel Processing
For multiple repositories:
```bash
# Terminal 1
cd /path/to/repo1 && npm run auto-executor:background

# Terminal 2
cd /path/to/repo2 && npm run auto-executor:background
```

### 3. Resource Management
```bash
# Check running processes
ps aux | grep auto-executor

# Stop all auto-executors
pkill -f "node .bob/auto-executor.js"
```

## Next Steps

1. ✅ **Start Auto-Executor**: `npm run auto-executor:background`
2. ✅ **Create Test PR**: Test the workflow
3. ✅ **Monitor Logs**: `npm run watch-executor`
4. ✅ **Review Results**: Check PR comments
5. ✅ **Adjust Settings**: Fine-tune configuration
6. ✅ **Enable Auto-Merge**: When ready (optional)

## Support

For help with BobShell integration:

1. **Check Documentation**: `.bob/AUTO_EXECUTOR_README.md`
2. **Review Logs**: `.bob/auto-executor.log`
3. **Test Manually**: `node .bob/auto-executor.js`
4. **Ask Bob**: Use BobShell commands

## Summary

The Bob Auto-Executor with BobShell integration provides:

- ✅ Automated PR detection and processing
- ✅ Automatic test execution
- ✅ Optional auto-merge capability
- ✅ Comprehensive logging and notifications
- ✅ Seamless integration with existing workflows
- ✅ Natural language control via BobShell

**Result**: Faster development cycles, reduced manual work, and more time for creative problem-solving!

---

**Made with ❤️ by Bob AI Developer**