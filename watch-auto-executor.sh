#!/bin/bash

# Watch Auto-Executor Log
# This script provides real-time monitoring of the Bob Auto-Executor

echo "🤖 Bob Auto-Executor Log Monitor"
echo "=================================="
echo ""
echo "Watching: .bob/auto-executor.log"
echo "Press Ctrl+C to stop"
echo ""

# Check if log file exists
if [ ! -f .bob/auto-executor.log ]; then
    echo "⚠️  Log file not found. Starting auto-executor will create it."
    echo ""
    echo "To start auto-executor, run:"
    echo "  node .bob/auto-executor.js &"
    echo ""
    exit 1
fi

# Display last 20 lines and follow
tail -n 20 -f .bob/auto-executor.log

# Made with Bob
