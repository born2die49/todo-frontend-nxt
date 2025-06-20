# ===== Build Stage =====
# Use a Node.js image to build our app
FROM node:22.13.1-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js application for production
# This creates an optimized build in the .next folder
RUN npm run build

# ===== Production Stage =====
# Start from a fresh, lightweight Node.js image
FROM node:22.13.1-alpine

WORKDIR /app

# Copy only the necessary files from the 'builder' stage
# We don't need the source code or dev dependencies anymore!
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# The command to start the optimized production server
CMD ["npm", "start"]