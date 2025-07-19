FROM node:18-slim  # Or node:14-bullseye (newer Debian base)

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set app working directory
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose app port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
