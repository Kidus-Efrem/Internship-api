# Use official Node.js 18 Alpine image (lightweight)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (required before building)
RUN npx prisma generate

# Build the TypeScript code into JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# On startup: push DB schema, seed the admin user, then start the production server
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm run start:prod"]