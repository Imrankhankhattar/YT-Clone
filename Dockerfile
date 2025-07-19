# Use an official Node.js base image
FROM node:18

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of your app
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
