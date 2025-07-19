#!/bin/bash

echo "Starting deployment process..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Build client
echo "Building client..."
cd client
npm run build
cd ..

echo "Deployment setup complete!" 