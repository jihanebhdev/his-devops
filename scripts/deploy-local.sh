#!/bin/bash
# ============================================================================
# HIS - Local Deployment Script
# Deploy entire stack locally with Docker Compose
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   HIS - Local Deployment Script      ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
log_info "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed"
    exit 1
fi

log_success "Prerequisites check passed"

# Check if .env exists
if [ ! -f .env ]; then
    log_warning ".env file not found, creating from env.example..."
    cp env.example .env
    log_info "Please update .env file with your configuration"
fi

# Stop existing containers
log_info "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Pull latest images (if using pre-built images)
log_info "Pulling latest images..."
docker-compose pull || log_warning "Could not pull images, will build locally"

# Build images
log_info "Building images..."
docker-compose build --no-cache

# Start services
log_info "Starting services..."
docker-compose up -d

# Wait for services to be healthy
log_info "Waiting for services to be healthy..."
sleep 10

# Check MySQL
log_info "Checking MySQL..."
for i in {1..30}; do
    if docker-compose exec -T mysql mysqladmin ping -h localhost -u root -proot &> /dev/null; then
        log_success "MySQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "MySQL failed to start"
        docker-compose logs mysql
        exit 1
    fi
    sleep 2
done

# Check Hub
log_info "Checking Hub backend..."
for i in {1..60}; do
    if curl -s http://localhost:8080/actuator/health &> /dev/null; then
        log_success "Hub backend is ready"
        break
    fi
    if [ $i -eq 60 ]; then
        log_error "Hub backend failed to start"
        docker-compose logs hub
        exit 1
    fi
    sleep 2
done

# Check Front
log_info "Checking Front application..."
for i in {1..30}; do
    if curl -s http://localhost:3000/health &> /dev/null; then
        log_success "Front application is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Front application failed to start"
        docker-compose logs front
        exit 1
    fi
    sleep 2
done

# Display status
echo ""
log_success "All services are up and running!"
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Application URLs              ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Frontend:${NC}    http://localhost:3000"
echo -e "  ${BLUE}Backend:${NC}     http://localhost:8080"
echo -e "  ${BLUE}API Docs:${NC}    http://localhost:8080/swagger-ui.html"
echo -e "  ${BLUE}Grafana:${NC}     http://localhost:3001 (admin/admin)"
echo -e "  ${BLUE}Prometheus:${NC}  http://localhost:9090"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  ${BLUE}View logs:${NC}        docker-compose logs -f"
echo -e "  ${BLUE}Stop services:${NC}    docker-compose down"
echo -e "  ${BLUE}Restart service:${NC}  docker-compose restart [service]"
echo ""

# Optional: Open browser
read -p "Do you want to open the frontend in your browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    elif command -v open &> /dev/null; then
        open http://localhost:3000
    else
        log_info "Please open http://localhost:3000 in your browser"
    fi
fi

