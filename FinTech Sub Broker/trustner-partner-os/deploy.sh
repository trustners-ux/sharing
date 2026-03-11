#!/bin/bash
# ============================================================================
# TRUSTNER MIS PORTAL - Deployment Script
# Deploys to www.trustner4u.com/mis
# ============================================================================

set -e

echo "============================================"
echo "  Trustner MIS Portal - Deployment"
echo "  URL: www.trustner4u.com/mis"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Copy .env.example to .env and configure it first."
    exit 1
fi

# Step 1: Build and start containers
echo -e "${YELLOW}Step 1: Building Docker containers...${NC}"
docker compose build --no-cache
echo -e "${GREEN}✓ Containers built${NC}"

# Step 2: Start services
echo -e "${YELLOW}Step 2: Starting services...${NC}"
docker compose up -d
echo -e "${GREEN}✓ Services started${NC}"

# Step 3: Wait for PostgreSQL to be ready
echo -e "${YELLOW}Step 3: Waiting for PostgreSQL...${NC}"
sleep 10
until docker compose exec postgres pg_isready -U trustner_admin > /dev/null 2>&1; do
    echo "  Waiting for database..."
    sleep 3
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Step 4: Run database migrations
echo -e "${YELLOW}Step 4: Running database migrations...${NC}"
docker compose exec backend npx prisma migrate deploy
echo -e "${GREEN}✓ Migrations complete${NC}"

# Step 5: Generate Prisma client
echo -e "${YELLOW}Step 5: Generating Prisma client...${NC}"
docker compose exec backend npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

# Step 6: Seed database with initial users
echo -e "${YELLOW}Step 6: Seeding initial users...${NC}"
docker compose exec backend npx ts-node src/seed.ts
echo -e "${GREEN}✓ Users seeded${NC}"

# Step 7: Health check
echo -e "${YELLOW}Step 7: Running health checks...${NC}"
sleep 5

# Check backend health
if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API is healthy${NC}"
else
    echo -e "${RED}✗ Backend API health check failed${NC}"
fi

# Check frontend
if curl -sf http://localhost/mis/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is serving at /mis${NC}"
else
    echo -e "${YELLOW}! Frontend may still be starting...${NC}"
fi

echo ""
echo "============================================"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo "============================================"
echo ""
echo "  MIS Portal URL: https://www.trustner4u.com/mis"
echo "  API Health:     https://www.trustner4u.com/health"
echo ""
echo "  Login Credentials (must change on first login):"
echo "  ------------------------------------------------"
echo "  1. ram@trustner.in          / Trustner@2026  (Super Admin)"
echo "  2. ajanta.saikia@trustner.in / Trustner@2026  (Principal Officer)"
echo "  3. trustnermis@gmail.com     / Trustner@2026  (MIS Manager)"
echo "  4. rinjima.das@trustner.in   / Trustner@2026  (MIS Checker)"
echo ""
echo "  ⚠️  IMPORTANT: Change the JWT_SECRET and passwords in .env"
echo "  ⚠️  Set up SSL/TLS certificates for HTTPS"
echo ""
echo "  Useful commands:"
echo "    docker compose logs -f         # View logs"
echo "    docker compose ps              # Check status"
echo "    docker compose restart backend # Restart API"
echo "    docker compose down            # Stop all"
echo ""
