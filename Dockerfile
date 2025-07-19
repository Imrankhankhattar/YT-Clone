# Stage 1: Get ffmpeg from trusted base
FROM jrottenberg/ffmpeg:4.4-ubuntu1804 as ffmpeg

# Stage 2: Main node backend using Node 14
FROM node:14

# Copy only ffmpeg binary (skip ffprobe)
COPY --from=ffmpeg /usr/bin/ffmpeg /usr/bin/ffmpeg

# Setup working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy rest of app
COPY . .

# Expose port your app runs on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]

