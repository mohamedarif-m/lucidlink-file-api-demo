# 🚀 One-Command Demo Startup

## Quick Start

Start everything with a single command:

```bash
./start-demo.sh
```

Or using npm:

```bash
npm run demo
```

## What It Does

This script automatically starts:
1. ✅ **Backend Server** (http://localhost:3000)
2. ✅ **Frontend Dev Server** (http://localhost:5173)
3. ✅ **Bob GitHub Poller** (checks every 5 minutes)

## Output

You'll see:
```
🚀 Starting LucidLink File Manager Demo...

✅ Dependencies ready

🔧 Starting Backend Server...
   Backend PID: 12345
   Logs: backend.log

🎨 Starting Frontend Dev Server...
   Frontend PID: 12346
   Logs: frontend.log

🤖 Starting Bob GitHub Poller...
   Poller PID: 12347
   Logs: .bob/polling.log

═══════════════════════════════════════════════════════════
✅ All services started successfully!
═══════════════════════════════════════════════════════════

📊 Service Status:
   Backend:  http://localhost:3000 (PID: 12345)
   Frontend: http://localhost:5173 (PID: 12346)
   Poller:   Running every 5 minutes (PID: 12347)

📝 View Logs:
   Backend:  tail -f backend.log
   Frontend: tail -f frontend.log
   Poller:   tail -f .bob/polling.log

🌐 Open in Browser:
   http://localhost:5173

🛑 To stop all services: Press Ctrl+C
```

## Live Polling Updates

The script shows live polling updates in the terminal:
```
[2026-03-29T00:20:23.088Z] 🔍 Polling GitHub for issues...
[2026-03-29T00:20:23.588Z] 🎯 Found 1 issue(s) for Bob:
[2026-03-29T00:20:23.588Z]    - #1: Add file size validation
```

## Stop Everything

Press `Ctrl+C` in the terminal - it will automatically stop all services.

## View Individual Logs

While the demo is running, open new terminals to view logs:

```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log

# Polling logs
tail -f .bob/polling.log
```

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Kill processes on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill processes on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Script Won't Run

Make sure it's executable:
```bash
chmod +x start-demo.sh
```

### Dependencies Missing

The script auto-installs dependencies, but you can manually install:
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install
```

## For Your Demo

### Before Demo:
1. Run: `./start-demo.sh`
2. Wait 10 seconds for all services to start
3. Open browser: http://localhost:5173
4. Verify polling is working in terminal

### During Demo:
1. Show the frontend interface
2. Upload/download files
3. Show live polling updates in terminal
4. Create a GitHub issue with `bob` label
5. Wait for next poll (or show existing detected issue)
6. Tell Bob: "Work on GitHub issue #1"

### After Demo:
1. Press `Ctrl+C` to stop everything
2. All services shut down cleanly

## Perfect for Presentations

✅ One command to start everything
✅ Clean, colored output
✅ Shows all service URLs
✅ Live polling updates visible
✅ Easy to stop (Ctrl+C)
✅ Automatic cleanup

**Just run `./start-demo.sh` and you're ready to present!**