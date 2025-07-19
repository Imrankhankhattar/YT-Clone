# Stage 1: FFmpeg binaries
FROM jrottenberg/ffmpeg:4.4-ubuntu1804 as ffmpeg

# Stage 2: Node.js 14 backend with ffmpeg support
FROM node:14

# Copy FFmpeg binaries from Stage 1
COPY --from=ffmpeg /usr/bin/ffmpeg /usr/bin/ffmpeg
COPY --from=ffmpeg /usr/bin/ffprobe /usr/bin/ffprobe

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port your Express app uses
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
