#!/bin/bash

# Healthcare Information System - Deployment Script
# Usage: ./deploy.sh [environment] [version]
# Example: ./deploy.sh production v1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
VERSION=${2:-latest}
NAMESPACE="his-system"
REGISTRY="ghcr.io/your-org"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HIS Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Version: ${YELLOW}${VERSION}${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command_exists kubectl; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}Error: docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Build Docker images
echo -e "${YELLOW}Building Docker images...${NC}"

# Build frontend
echo "Building frontend..."
cd "${PROJECT_ROOT}/front"
docker build -t ${REGISTRY}/his-frontend:${VERSION} .
docker tag ${REGISTRY}/his-frontend:${VERSION} ${REGISTRY}/his-frontend:latest

# Build hub (backend)
echo "Building hub (backend)..."
cd "${PROJECT_ROOT}/hub"
docker build -t ${REGISTRY}/his-hub:${VERSION} .
docker tag ${REGISTRY}/his-hub:${VERSION} ${REGISTRY}/his-hub:latest

cd "${PROJECT_ROOT}"

echo -e "${GREEN}✓ Docker images built successfully${NC}"
echo ""

# Push images to registry
if [ "$ENVIRONMENT" != "development" ]; then
    echo -e "${YELLOW}Pushing images to registry...${NC}"
    docker push ${REGISTRY}/his-frontend:${VERSION}
    docker push ${REGISTRY}/his-frontend:latest
    docker push ${REGISTRY}/his-hub:${VERSION}
    docker push ${REGISTRY}/his-hub:latest
    echo -e "${GREEN}✓ Images pushed successfully${NC}"
    echo ""
fi

# Deploy to Kubernetes
if [ "$ENVIRONMENT" != "development" ]; then
    echo -e "${YELLOW}Deploying to Kubernetes...${NC}"
    
    # Create namespace if it doesn't exist
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply configurations
    kubectl apply -f infrastructure/kubernetes/namespace.yaml
    kubectl apply -f infrastructure/kubernetes/configmap.yaml
    kubectl apply -f infrastructure/kubernetes/secrets.yaml
    
    # Deploy services
    kubectl apply -f infrastructure/kubernetes/postgres/
    kubectl apply -f infrastructure/kubernetes/redis/
    kubectl apply -f infrastructure/kubernetes/hub/
    kubectl apply -f infrastructure/kubernetes/frontend/
    
    # Wait for rollout
    echo "Waiting for deployments to be ready..."
    kubectl rollout status deployment/his-frontend -n ${NAMESPACE} --timeout=5m
    kubectl rollout status deployment/his-hub -n ${NAMESPACE} --timeout=5m
    
    echo -e "${GREEN}✓ Deployment completed successfully${NC}"
    echo ""
    
    # Show deployment status
    echo -e "${YELLOW}Deployment Status:${NC}"
    kubectl get pods -n ${NAMESPACE}
    echo ""
    kubectl get services -n ${NAMESPACE}
    
else
    # Local development with docker-compose
    echo -e "${YELLOW}Starting local development environment...${NC}"
    cd "${PROJECT_ROOT}/front"
    docker-compose up -d
    echo -e "${GREEN}✓ Local environment started${NC}"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Hub (Backend): http://localhost:8080"
    echo "MySQL: localhost:3306"
    echo "Redis: localhost:6379"
    echo "RabbitMQ: http://localhost:15672 (admin/admin)"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

