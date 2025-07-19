#!/bin/bash

echo "🔧 Starting build process..."

# Install FFmpeg
echo "🎬 Installing FFmpeg..."
apt-get update
apt-get install -y wget
wget -O /tmp/ffmpeg-release-amd64-static.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar -C /usr/local/bin -xJf /tmp/ffmpeg-release-amd64-static.tar.xz --strip-components=1 --wildcards '*/ffmpeg'
rm /tmp/ffmpeg-release-amd64-static.tar.xz
chmod +x /usr/local/bin/ffmpeg
apt-get remove -y wget
rm -rf /var/lib/apt/lists/*

# Verify FFmpeg installation
echo "🔍 Verifying FFmpeg installation..."
ffmpeg -version

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
