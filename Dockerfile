FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Copy package.json and lock files
COPY package.json bun.lock ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json

# Install dependencies
RUN bun install

# Copy client and server directories
COPY client/ ./client/
COPY server/ ./server/

# Build apps
RUN bun run build

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["bun", "run", "--cwd", "server", "start"]
