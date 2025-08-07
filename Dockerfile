# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
RUN mkdir -p /app/uploads/images
# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src


# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
RUN mkdir -p /app/uploads/images
# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership
USER nestjs

EXPOSE 5000

CMD ["node", "dist/main"]
