#!/bin/bash

# Start the Flask backend
echo "Starting Flask backend..."
cd "$(dirname "$0")"
python3 -m pip install -r requirements.txt
python3 app.py &
FLASK_PID=$!

# Wait a moment for Flask to start
sleep 3

# Start the React frontend
echo "Starting React frontend..."
cd converter
npm run dev &
REACT_PID=$!

echo "Flask backend running on http://localhost:5001"
echo "React frontend running on http://localhost:5173"
echo "Flask PID: $FLASK_PID"
echo "React PID: $REACT_PID"

# Wait for user input to stop
read -p "Press Enter to stop both servers..."

# Kill both processes
kill $FLASK_PID
kill $REACT_PID

echo "Both servers stopped."