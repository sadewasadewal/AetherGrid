# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source and configuration
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN npm run build && npm prune --production

# ==========================================
# Stage 2: Minimal Production Runner
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production \
    PORT=4000

# Install dumb-init for proper PID 1 signal handling
RUN apk add --no-cache dumb-init wget

# Copy production artifacts from builder
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# Run as non-root user
USER node

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/index.js"]
