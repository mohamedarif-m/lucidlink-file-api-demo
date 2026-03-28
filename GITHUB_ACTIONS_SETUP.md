# GitHub Actions - Bob Issue Notifier Setup Guide

This guide explains how to set up and use the automated Bob Issue Notifier that monitors your repository 24/7.

## 🎯 What It Does

The Bob Notifier GitHub Action:
- ✅ Runs every 5 minutes automatically
- ✅ Checks for issues labeled `bob`, `ai-task`, or `enhancement`
- ✅ Comments on new issues to notify you
- ✅ Creates a summary of issues needing attention
- ✅ Runs 24/7 without your computer being on
- ✅ Free on GitHub (included in free tier)

## 📋 How It Works

### Automatic Monitoring:
```
Every 5 minutes:
1. GitHub Actions checks your repository
2. Finds open issues with Bob labels
3. Comments on new issues: "🤖 Bob Notifier - Ready for Bob"
4. Creates summary in Actions tab
5. You get GitHub notification
6. Tell Bob to work on the issue
```

### Triggers:
- **Schedule**: Every 5 minutes (cron: `*/5 * * * *`)
- **New Issues**: When issue is created or labeled
- **Manual**: You can trigger it manually

## 🚀 Setup Instructions

### Step 1: Workflow is Already Created ✅

The workflow file is at: `.github/workflows/bob-notifier.yml`

### Step 2: Push to GitHub

```bash
cd lucidlink-file-api-demo
git add .github/workflows/bob-notifier.yml
git commit -m "Add Bob Issue Notifier GitHub Action"
git push origin main
```

### Step 3: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. If prompted, click **"I understand my workflows, go ahead and enable them"**
4. You should see **"Bob Issue Notifier"** workflow

### Step 4: Test It

#### Option A: Create a Test Issue
1. Go to **Issues** → **New Issue**
2. Title: "Test Bob Notification"
3. Add label: `bob`
4. Create issue
5. Within 5 minutes, you'll see a comment from `github-actions[bot]`

#### Option B: Manual Trigger
1. Go to **Actions** tab
2. Click **"Bob Issue Notifier"**
3. Click **"Run workflow"** → **"Run workflow"**
4. Watch it run in real-time

## 📊 What You'll See

### In Issue Comments:

When the action detects a new Bob issue, it adds this comment:

```
🤖 Bob Notifier

This issue has been detected by Bob's automated monitoring system.

Status: Ready for Bob to work on
Labels: bob, enhancement
Detected: 2024-03-28 23:54:00 UTC

---

To assign this to Bob:
1. Open VS Code with Bob
2. Tell Bob: `Work on GitHub issue #1`
3. Bob will create a branch, make changes, and open a PR

Or wait for automatic polling (if configured)

---
This is an automated notification. Bob will work on this issue based on your configuration.
```

### In Actions Tab:

Each run creates a summary showing:
- Total open issues
- Issues ready for Bob
- List of issues with links
- Next check time

### In Notifications:

You'll receive GitHub notifications when:
- New issues are labeled for Bob
- Action comments on issues
- (Configure in GitHub Settings → Notifications)

## 🎬 For Your LucidLink Demo

### Demo Flow:

**1. Show the Automation:**
- Open **Actions** tab
- Show the workflow running every 5 minutes
- Show the summary of monitored issues

**2. Create Issue Live:**
- Create new issue with `bob` label
- Show it appears in next workflow run (within 5 min)
- Show the automated comment

**3. Assign to Bob:**
- Tell Bob: "Work on GitHub issue #X"
- Show Bob creating branch, coding, testing
- Show PR being created

**4. Talking Points:**
- "Bob monitors our repository 24/7"
- "Automatically detects issues that need AI assistance"
- "Notifies the team immediately"
- "Works even when we're offline"
- "Free on GitHub - no infrastructure costs"

## 🔧 Configuration

### Change Check Frequency:

Edit `.github/workflows/bob-notifier.yml`:

```yaml
schedule:
  - cron: '*/5 * * * *'  # Every 5 minutes
  # - cron: '*/10 * * * *'  # Every 10 minutes
  # - cron: '0 * * * *'     # Every hour
  # - cron: '0 9 * * 1-5'   # 9 AM weekdays only
```

### Change Monitored Labels:

Edit the `--label` parameter:

```yaml
gh issue list \
  --label "bob,ai-task,enhancement"  # Current
  # --label "bob"                     # Only 'bob' label
  # --label "urgent,critical"         # Different labels
```

### Add Slack/Email Notifications:

Add a notification step:

```yaml
- name: Send Slack notification
  if: steps.check_issues.outputs.issue_count > 0
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "🤖 ${{ steps.check_issues.outputs.issue_count }} issues need Bob's attention!"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 📈 Monitoring

### View Workflow Runs:
1. Go to **Actions** tab
2. Click **"Bob Issue Notifier"**
3. See all runs with timestamps and results

### View Summaries:
1. Click any workflow run
2. Scroll to **"Summary"** section
3. See detailed report of issues

### Check Logs:
1. Click any workflow run
2. Click **"notify-bob-issues"** job
3. Expand steps to see detailed logs

## 🐛 Troubleshooting

### Workflow Not Running?

**Check:**
1. Actions are enabled (Settings → Actions → Allow all actions)
2. Workflow file is in `.github/workflows/` directory
3. File has `.yml` or `.yaml` extension
4. YAML syntax is valid

**Fix:**
```bash
# Re-push the workflow
git add .github/workflows/bob-notifier.yml
git commit -m "Fix workflow"
git push origin main
```

### No Comments on Issues?

**Check:**
1. Issue has correct label (`bob`, `ai-task`, or `enhancement`)
2. Issue is open (not closed)
3. Workflow has run (check Actions tab)
4. GitHub token has permissions

**Fix:**
- Wait for next scheduled run (5 minutes)
- Or manually trigger workflow

### Workflow Failing?

**Common Issues:**
1. **Permission denied**: Go to Settings → Actions → Workflow permissions → Select "Read and write permissions"
2. **Rate limit**: Reduce frequency (change cron to `*/10 * * * *`)
3. **Invalid YAML**: Check syntax at https://www.yamllint.com/

## 💡 Advanced Features

### Add Issue Assignment:

```yaml
- name: Auto-assign to Bob
  run: |
    gh issue edit $ISSUE_NUMBER --add-assignee "bob-ai-user"
```

### Add Project Board Integration:

```yaml
- name: Add to project board
  run: |
    gh issue edit $ISSUE_NUMBER --add-project "Bob's Work Queue"
```

### Add Priority Labels:

```yaml
- name: Prioritize issues
  run: |
    # Add 'urgent' label to issues with 'critical' keyword
    if echo "$ISSUE_TITLE" | grep -i "critical"; then
      gh issue edit $ISSUE_NUMBER --add-label "urgent"
    fi
```

## 📊 Usage Statistics

### Free Tier Limits:
- **Public repos**: Unlimited minutes
- **Private repos**: 2,000 minutes/month
- **This workflow**: ~1 minute per run
- **Runs per month**: ~8,640 (every 5 min)
- **Cost**: Free for public repos!

### Optimization:
If you hit limits, increase interval:
- Every 10 minutes: 4,320 runs/month
- Every 15 minutes: 2,880 runs/month
- Every 30 minutes: 1,440 runs/month

## 🎯 Next Steps

1. ✅ Push workflow to GitHub
2. ✅ Enable Actions
3. ✅ Create test issue with `bob` label
4. ✅ Wait 5 minutes
5. ✅ See automated comment
6. ✅ Tell Bob to work on it
7. ✅ Show LucidLink the magic!

## 🚀 You're All Set!

The Bob Issue Notifier is now monitoring your repository 24/7, ready to alert you whenever there's work for Bob to do!

**Create an issue with the `bob` label and watch the automation in action! 🤖**