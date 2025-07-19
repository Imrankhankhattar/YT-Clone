#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting YouTube Clone API Server...');

const serverPath = path.join(__dirname, 'server');
console.log('📁 Server path:', serverPath);

// Check if server directory exists
if (!fs.existsSync(serverPath)) {
  console.error('❌ Server directory not found:', serverPath);
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(serverPath, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules not found in server directory');
  console.log('📁 Contents of server directory:');
  try {
    const files = fs.readdirSync(serverPath);
    console.log(files);
  } catch (err) {
    console.error('Error reading server directory:', err);
  }
  process.exit(1);
}

// Change to server directory
process.chdir(serverPath);
console.log('✅ Changed to server directory');

// Start the server
console.log('🌐 Starting server with: node index.js');
const server = spawn('node', ['index.js'], {
  stdio: 'inherit',
  cwd: serverPath
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
}); 