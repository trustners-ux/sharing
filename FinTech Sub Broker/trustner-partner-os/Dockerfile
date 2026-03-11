# =============================================================================
# Trustner MIS - All-in-One Dockerfile (Frontend + Backend)
# Serves the React frontend at /mis/ and API at /api/
# =============================================================================

# ============================================================================
# STAGE 1: BUILD FRONTEND
# ============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

ENV VITE_API_URL=/api
RUN npm run build

# ============================================================================
# STAGE 2: BUILD BACKEND
# ============================================================================
FROM node:20-alpine AS backend-builder

WORKDIR /backend

RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm install

COPY backend/ .

RUN npm run prisma:generate
RUN npm run build

# ============================================================================
# STAGE 3: PRODUCTION
# ============================================================================
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init openssl

# Copy backend package files
COPY backend/package*.json ./

# Copy Prisma schema
COPY --from=backend-builder /backend/prisma ./prisma

# Install production deps + generate Prisma client
RUN npm install --only=production && \
    npx prisma generate && \
    npm cache clean --force

# Copy built backend
COPY --from=backend-builder /backend/dist ./dist

# Copy built frontend into frontend-dist (served by NestJS)
COPY --from=frontend-builder /frontend/dist ./frontend-dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
