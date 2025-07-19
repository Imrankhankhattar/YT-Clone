FROM node:14

# Install ffmpeg via apt-get
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*

# Set app working directory
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# App port (adjust if needed)
EXPOSE 5000

# Start command
CMD ["npm", "start"]
