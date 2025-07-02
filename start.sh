#!/bin/bash

echo "🚀 Starting Toy Blocks application..."

# Stop processes on ports 3000 and 3002
echo "🛑 Stopping existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true

# Wait for ports to be released
sleep 2

# Start local server
echo "🔧 Starting local server on port 3002..."
npm run server &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check server
if curl -s http://localhost:3002/health > /dev/null; then
    echo "✅ Local server started successfully"
else
    echo "❌ Failed to start local server"
    exit 1
fi

# Start React app
echo "⚛️  Starting React app on port 3000..."
npm start &
REACT_PID=$!

# Wait for React to start
sleep 10

# Check React app
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ React app started successfully"
else
    echo "❌ Failed to start React app"
    exit 1
fi

echo ""
echo "🎉 Application started successfully!"
echo "📱 React app: http://localhost:3000"
echo "🔧 API server: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop"

# Wait for termination signal
trap "echo '🛑 Stopping application...'; kill $SERVER_PID $REACT_PID 2>/dev/null; exit" INT

# Wait for processes
wait 