#!/usr/bin/env node

/**
 * Bob Auto-Executor with BobShell Integration
 * 
 * This script automatically:
 * 1. Polls GitHub for open PRs created by Bob
 * 2. Checks out the PR branch
 * 3. Runs tests
 * 4. Auto-merges if tests pass
 * 5. Notifies via bobshell
 * 
 * Usage: node .bob/auto-executor.js
 */

const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

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

// Configuration
const GITHUB_TOKEN = mcpConfig.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const REPOSITORY = config.github.polling.repository;
const POLL_INTERVAL = config.github.polling.interval;
const LOG_FILE = path.join(__dirname, 'auto-executor.log');
const AUTO_MERGE = config.github.workflow.autoMerge || false;
const RUN_TESTS = config.github.workflow.runTests !== false;

/**
 * Log message to console and file
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

/**
 * Make GitHub API request
 */
function githubRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'User-Agent': 'Bob-Auto-Executor',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : {});
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Execute shell command
 */
async function runCommand(command, description) {
  log(`   🔧 ${description}...`);
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) log(`      ✓ ${stdout.trim()}`);
    if (stderr) log(`      ⚠ ${stderr.trim()}`);
    return { success: true, stdout, stderr };
  } catch (error) {
    log(`      ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Check if PR is created by Bob
 */
function isBobPR(pr) {
  return pr.title.startsWith('[Bob]') || 
         pr.head.ref.startsWith('bob/') ||
         pr.user.login === 'mohamedarif-m'; // Adjust to your username
}

/**
 * Process a single PR
 */
async function processPR(pr) {
  log(`\n🔄 Processing PR #${pr.number}: ${pr.title}`);
  log(`   Branch: ${pr.head.ref}`);
  log(`   Status: ${pr.state}`);
  
  try {
    // Step 1: Fetch latest changes
    await runCommand('git fetch origin', 'Fetching latest changes');
    
    // Step 2: Checkout PR branch
    const checkoutResult = await runCommand(
      `git checkout ${pr.head.ref}`,
      `Checking out branch ${pr.head.ref}`
    );
    
    if (!checkoutResult.success) {
      // Try to create local branch from remote
      await runCommand(
        `git checkout -b ${pr.head.ref} origin/${pr.head.ref}`,
        `Creating local branch from remote`
      );
    }
    
    // Step 3: Pull latest changes
    await runCommand('git pull origin ' + pr.head.ref, 'Pulling latest changes');
    
    // Step 4: Install dependencies if needed
    if (fs.existsSync('package.json')) {
      await runCommand('npm install', 'Installing dependencies');
    }
    
    // Step 5: Run tests if enabled
    let testsPass = true;
    if (RUN_TESTS) {
      log(`   🧪 Running tests...`);
      const testResult = await runCommand('npm test', 'Running test suite');
      testsPass = testResult.success;
      
      if (testsPass) {
        log(`   ✅ All tests passed!`);
      } else {
        log(`   ❌ Tests failed!`);
        
        // Comment on PR about test failure
        await githubRequest(
          `/repos/${REPOSITORY}/issues/${pr.number}/comments`,
          'POST',
          {
            body: `❌ **Auto-Executor Report**\n\nTests failed for this PR. Please review and fix the issues.\n\n\`\`\`\n${testResult.error}\n\`\`\``
          }
        );
        
        return { success: false, reason: 'Tests failed' };
      }
    }
    
    // Step 6: Auto-merge if enabled and tests pass
    if (AUTO_MERGE && testsPass) {
      log(`   🔀 Auto-merging PR...`);
      
      try {
        // Merge PR via GitHub API
        await githubRequest(
          `/repos/${REPOSITORY}/pulls/${pr.number}/merge`,
          'PUT',
          {
            commit_title: `Merge PR #${pr.number}: ${pr.title}`,
            commit_message: 'Auto-merged by Bob Auto-Executor',
            merge_method: 'squash'
          }
        );
        
        log(`   ✅ PR #${pr.number} merged successfully!`);
        
        // Switch back to main branch
        await runCommand('git checkout main', 'Switching back to main branch');
        await runCommand('git pull origin main', 'Updating main branch');
        
        // Delete local branch
        await runCommand(`git branch -D ${pr.head.ref}`, 'Cleaning up local branch');
        
        return { success: true, merged: true };
        
      } catch (error) {
        log(`   ❌ Failed to merge PR: ${error.message}`);
        return { success: false, reason: 'Merge failed', error: error.message };
      }
    } else {
      log(`   ℹ️  Auto-merge disabled or tests not run. PR ready for manual review.`);
      
      // Comment on PR about successful execution
      await githubRequest(
        `/repos/${REPOSITORY}/issues/${pr.number}/comments`,
        'POST',
        {
          body: `✅ **Auto-Executor Report**\n\nBranch checked out and tests passed successfully!\n\n${AUTO_MERGE ? '' : '⚠️ Auto-merge is disabled. Please merge manually.'}`
        }
      );
      
      return { success: true, merged: false };
    }
    
  } catch (error) {
    log(`   ❌ Error processing PR: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

/**
 * Poll for PRs and process them
 */
async function pollAndExecute() {
  try {
    log('\n🔍 Checking for Bob PRs...');
    
    // Fetch open PRs
    const prs = await githubRequest(`/repos/${REPOSITORY}/pulls?state=open&per_page=100`);
    
    log(`   Found ${prs.length} total open PRs`);
    
    // Filter Bob's PRs
    const bobPRs = prs.filter(isBobPR);
    
    if (bobPRs.length === 0) {
      log('   ✅ No Bob PRs to process');
    } else {
      log(`   🎯 Found ${bobPRs.length} Bob PR(s) to process`);
      
      // Process each PR
      for (const pr of bobPRs) {
        const result = await processPR(pr);
        
        if (result.success && result.merged) {
          log(`   ✅ PR #${pr.number} processed and merged`);
        } else if (result.success) {
          log(`   ✅ PR #${pr.number} processed successfully`);
        } else {
          log(`   ❌ PR #${pr.number} processing failed: ${result.reason}`);
        }
      }
    }
    
    log('─'.repeat(80));
    
  } catch (error) {
    log(`❌ Error in poll cycle: ${error.message}`);
    log('─'.repeat(80));
  }
}

/**
 * Start auto-executor
 */
async function start() {
  log('🤖 Bob Auto-Executor Started');
  log(`   Repository: ${REPOSITORY}`);
  log(`   Polling interval: ${POLL_INTERVAL / 1000} seconds`);
  log(`   Auto-merge: ${AUTO_MERGE ? 'Enabled' : 'Disabled'}`);
  log(`   Run tests: ${RUN_TESTS ? 'Enabled' : 'Disabled'}`);
  log(`   Log file: ${LOG_FILE}`);
  log('═'.repeat(80));
  
  // Initial poll
  await pollAndExecute();
  
  // Set up interval
  setInterval(async () => {
    await pollAndExecute();
  }, POLL_INTERVAL);
  
  log('\n✅ Auto-executor active. Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n🛑 Bob Auto-Executor Stopped');
  log('═'.repeat(80));
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Bob Auto-Executor Stopped');
  log('═'.repeat(80));
  process.exit(0);
});

// Start the auto-executor
start().catch(error => {
  log(`❌ Fatal error: ${error.message}`);
  process.exit(1);
});

// Made with Bob