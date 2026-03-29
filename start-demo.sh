#!/bin/bash

# LucidLink File Manager Demo - Complete Startup Script
# This script starts backend, frontend, and polling in one command

echo "🚀 Starting LucidLink File Manager Demo..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo ""
echo "${GREEN}✅ Dependencies ready${NC}"
echo ""

# Start Backend
echo "${BLUE}🔧 Starting Backend Server...${NC}"
node backend/server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo "   Logs: backend.log"
sleep 2

# Start Frontend
echo "${BLUE}🎨 Starting Frontend Dev Server...${NC}"
cd frontend && npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "   Frontend PID: $FRONTEND_PID"
echo "   Logs: frontend.log"
sleep 3

# Start Polling
echo "${BLUE}🤖 Starting Bob GitHub Poller...${NC}"
node .bob/poller.js > .bob/polling.log 2>&1 &
POLLER_PID=$!
echo "   Poller PID: $POLLER_PID"
echo "   Logs: .bob/polling.log"
sleep 2

echo ""
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo "${GREEN}✅ All services started successfully!${NC}"
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📊 Service Status:"
echo "   Backend:  http://localhost:3000 (PID: $BACKEND_PID)"
echo "   Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo "   Poller:   Running every 5 minutes (PID: $POLLER_PID)"
echo ""
echo "📝 View Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo "   Poller:   tail -f .bob/polling.log"
echo ""
echo "🌐 Open in Browser:"
echo "   ${BLUE}http://localhost:5173${NC}"
echo ""
echo "🛑 To stop all services: Press Ctrl+C"
echo ""
echo "${YELLOW}Waiting for services... (Press Ctrl+C to stop)${NC}"
echo ""

# Keep script running and show live polling updates
tail -f .bob/polling.log &
TAIL_PID=$!

# Wait for user to press Ctrl+C
wait

# Made with Bob
