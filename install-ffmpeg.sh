#!/bin/bash

echo "🎬 Installing FFmpeg..."

# Check if we're on a system with apt-get
if command -v apt-get &> /dev/null; then
    echo "📦 Using apt-get to install FFmpeg..."
    apt-get update
    apt-get install -y ffmpeg
elif command -v yum &> /dev/null; then
    echo "📦 Using yum to install FFmpeg..."
    yum install -y ffmpeg
elif command -v brew &> /dev/null; then
    echo "📦 Using Homebrew to install FFmpeg..."
    brew install ffmpeg
else
    echo "⚠️  No package manager found, trying manual installation..."
    # Download and install FFmpeg manually
    wget -O /tmp/ffmpeg-release-amd64-static.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
    tar -C /usr/local/bin -xJf /tmp/ffmpeg-release-amd64-static.tar.xz --strip-components=1 --wildcards '*/ffmpeg'
    rm /tmp/ffmpeg-release-amd64-static.tar.xz
    chmod +x /usr/local/bin/ffmpeg
fi

# Verify installation
echo "🔍 Verifying FFmpeg installation..."
if command -v ffmpeg &> /dev/null; then
    ffmpeg -version
    echo "✅ FFmpeg installed successfully!"
else
    echo "❌ FFmpeg installation failed!"
    exit 1
fi 