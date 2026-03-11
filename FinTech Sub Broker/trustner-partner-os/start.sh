#!/bin/sh
set -e

echo "=== Starting Trustner MIS ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Step 1: Push database schema
echo "--- Step 1: Syncing database schema ---"
npx prisma db push --skip-generate --accept-data-loss 2>&1 || echo "Warning: prisma db push failed, continuing..."

# Step 2: Run seed (non-blocking - if it fails, continue)
echo "--- Step 2: Running database seed ---"
node dist/seed.js 2>&1 || echo "Warning: seed failed or already seeded, continuing..."

# Step 3: Start the application
echo "--- Step 3: Starting NestJS application ---"
exec node dist/main.js
