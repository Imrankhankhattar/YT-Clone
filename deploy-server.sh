#!/bin/bash

echo "🚀 Starting YouTube Clone API deployment..."

# Navigate to server directory
cd server

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Start the server
echo "🌐 Starting server..."
node index.js 