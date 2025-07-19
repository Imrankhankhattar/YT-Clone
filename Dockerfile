# Use official Node.js image
FROM node:14

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create app directory
WORKDIR /app

# Copy server files
COPY . .

# Install server dependencies
RUN npm install

# Expose your app's port (adjust if yours is different)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]

