#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting YouTube Clone API Server...');

// Change to server directory
process.chdir(path.join(__dirname, 'server'));

// Start the server
const server = spawn('node', ['index.js'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, 'server')
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
}); 