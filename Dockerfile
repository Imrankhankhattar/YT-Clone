# Use Node.js 14 with Debian Bullseye
FROM node:14-bullseye

# Install wget to download ffmpeg
RUN apt-get update && \
    apt-get install -y wget && \
    wget -O /tmp/ffmpeg-release-amd64-static.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz && \
    tar -C /usr/local/bin -xJf /tmp/ffmpeg-release-amd64-static.tar.xz --strip-components=1 --wildcards '*/ffmpeg' && \
    rm /tmp/ffmpeg-release-amd64-static.tar.xz && \
    chmod +x /usr/local/bin/ffmpeg && \
    apt-get remove -y wget && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire application
COPY . .

# Install server dependencies
RUN cd server && npm install

# Expose the port your app uses
EXPOSE 5000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application using our startup script
CMD ["npm", "start"]