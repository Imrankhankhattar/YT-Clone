#!/bin/bash

echo "🔧 Starting build process..."

# Navigate to server directory
cd server

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
    echo "📁 Contents of server directory:"
    ls -la
    echo "📁 Contents of node_modules:"
    ls -la node_modules | head -10
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🏗️ Build completed successfully!"
