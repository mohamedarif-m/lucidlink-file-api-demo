#!/usr/bin/env node

/**
 * Bob GitHub Issue Poller
 * 
 * This script polls GitHub for issues labeled with 'bob', 'ai-task', or 'enhancement'
 * and logs the results every 5 minutes, even when no issues are found.
 * 
 * Usage: node .bob/poller.js
 * Or run in background: node .bob/poller.js > .bob/polling.log 2>&1 &
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, 'config.json');
const mcpPath = path.join(__dirname, 'mcp.json');

let config, mcpConfig;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
} catch (error) {
  console.error('❌ Error loading configuration:', error.message);
  process.exit(1);
}

// Extract configuration
const GITHUB_TOKEN = mcpConfig.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const REPOSITORY = config.github.polling.repository;
const POLL_INTERVAL = config.github.polling.interval;
const TARGET_LABELS = config.github.polling.labels;
const IGNORE_LABELS = config.github.polling.ignoreLabels;
const LOG_FILE = path.join(__dirname, 'polling.log');

// Validate configuration
if (!GITHUB_TOKEN || GITHUB_TOKEN === 'ghp_your_token_here') {
  console.error('❌ GitHub token not configured in .bob/mcp.json');
  process.exit(1);
}

if (!REPOSITORY || REPOSITORY.includes('YOUR_USERNAME')) {
  console.error('❌ Repository not configured in .bob/config.json');
  process.exit(1);
}

/**
 * Log message to console and file
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

/**
 * Make GitHub API request
 */
function githubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Bob-Poller',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Check if issue has target labels and not ignore labels
 */
function shouldProcessIssue(issue) {
  const issueLabels = issue.labels.map(label => label.name);
  
  // Check if has any ignore labels
  const hasIgnoreLabel = IGNORE_LABELS.some(label => issueLabels.includes(label));
  if (hasIgnoreLabel) {
    return false;
  }
  
  // Check if has any target labels
  const hasTargetLabel = TARGET_LABELS.some(label => issueLabels.includes(label));
  return hasTargetLabel;
}

/**
 * Poll GitHub for issues
 */
async function pollGitHub() {
  try {
    log('🔍 Polling GitHub for issues...');
    log(`   Repository: ${REPOSITORY}`);
    log(`   Target labels: ${TARGET_LABELS.join(', ')}`);
    
    // Fetch open issues
    const issues = await githubRequest(`/repos/${REPOSITORY}/issues?state=open&per_page=100`);
    
    log(`   Found ${issues.length} total open issues`);
    
    // Filter issues
    const bobIssues = issues.filter(shouldProcessIssue);
    
    if (bobIssues.length === 0) {
      log('✅ No issues need Bob\'s attention');
    } else {
      log(`🎯 Found ${bobIssues.length} issue(s) for Bob:`);
      
      bobIssues.forEach(issue => {
        const labels = issue.labels.map(l => l.name).join(', ');
        log(`   - #${issue.number}: ${issue.title}`);
        log(`     Labels: ${labels}`);
        log(`     URL: ${issue.html_url}`);
      });
      
      log('');
      log('💡 To work on these issues, tell Bob:');
      bobIssues.forEach(issue => {
        log(`   "Work on GitHub issue #${issue.number}"`);
      });
    }
    
    // Check rate limit
    const rateLimit = await githubRequest('/rate_limit');
    const remaining = rateLimit.rate.remaining;
    const resetTime = new Date(rateLimit.rate.reset * 1000).toLocaleTimeString();
    
    log(`📊 API Rate Limit: ${remaining} requests remaining (resets at ${resetTime})`);
    log('─'.repeat(80));
    
  } catch (error) {
    log(`❌ Error polling GitHub: ${error.message}`);
    log('─'.repeat(80));
  }
}

/**
 * Start polling
 */
async function startPolling() {
  log('🤖 Bob GitHub Poller Started');
  log(`   Polling interval: ${POLL_INTERVAL / 1000} seconds (${POLL_INTERVAL / 60000} minutes)`);
  log(`   Log file: ${LOG_FILE}`);
  log('═'.repeat(80));
  
  // Initial poll
  await pollGitHub();
  
  // Set up interval
  setInterval(async () => {
    await pollGitHub();
  }, POLL_INTERVAL);
  
  log('');
  log('✅ Polling active. Press Ctrl+C to stop.');
  log('');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('');
  log('🛑 Bob GitHub Poller Stopped');
  log('═'.repeat(80));
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('');
  log('🛑 Bob GitHub Poller Stopped');
  log('═'.repeat(80));
  process.exit(0);
});

// Start the poller
startPolling().catch(error => {
  log(`❌ Fatal error: ${error.message}`);
  process.exit(1);
});

// Made with Bob
