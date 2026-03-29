#!/bin/bash

# Watch Bob Polling Logs in Real-Time
# This script shows live polling updates as they happen

echo "👀 Watching Bob Polling Logs..."
echo "Press Ctrl+C to stop watching"
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""

# Check if polling log exists
if [ ! -f ".bob/polling.log" ]; then
    echo "❌ Polling log not found at .bob/polling.log"
    echo ""
    echo "Start polling first with:"
    echo "  npm run poll"
    echo "  or"
    echo "  ./start-demo.sh"
    exit 1
fi

# Show last 20 lines first
echo "📜 Recent polling activity:"
echo ""
tail -n 20 .bob/polling.log
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo "🔴 LIVE - Watching for new polls (updates every 5 minutes)..."
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""

# Watch for new entries
tail -f .bob/polling.log

# Made with Bob
