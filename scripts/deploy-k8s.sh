#!/bin/bash
# ============================================================================
# HIS - Kubernetes Deployment Script
# Deploy to Kubernetes cluster
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default values
ENVIRONMENT="${1:-dev}"
NAMESPACE="his-${ENVIRONMENT}"
GITHUB_USERNAME="${GITHUB_USERNAME:-}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

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
echo "║   HIS - Kubernetes Deployment        ║"
echo "║   Environment: ${ENVIRONMENT^^}                   ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|test|demo)$ ]]; then
    log_error "Invalid environment. Use: dev, test, or demo"
    exit 1
fi

# Check prerequisites
log_info "Checking prerequisites..."

if ! command -v kubectl &> /dev/null; then
    log_error "kubectl is not installed"
    exit 1
fi

if ! kubectl cluster-info &> /dev/null; then
    log_error "Cannot connect to Kubernetes cluster"
    exit 1
fi

log_success "Prerequisites check passed"

# Create namespace
log_info "Creating namespace ${NAMESPACE}..."
kubectl apply -f k8s/base/namespace.yaml

# Create image pull secret
if [ -n "$GITHUB_USERNAME" ] && [ -n "$GITHUB_TOKEN" ]; then
    log_info "Creating image pull secret..."
    kubectl create secret docker-registry ghcr-secret \
        --docker-server=ghcr.io \
        --docker-username="$GITHUB_USERNAME" \
        --docker-password="$GITHUB_TOKEN" \
        --namespace="$NAMESPACE" \
        --dry-run=client -o yaml | kubectl apply -f -
    log_success "Image pull secret created"
else
    log_warning "GITHUB_USERNAME or GITHUB_TOKEN not set, skipping secret creation"
fi

# Apply Kustomize configuration
log_info "Applying Kubernetes manifests..."
kubectl apply -k "k8s/overlays/${ENVIRONMENT}"

# Wait for deployments
log_info "Waiting for deployments to be ready..."

DEPLOYMENTS=$(kubectl get deployments -n "$NAMESPACE" -o jsonpath='{.items[*].metadata.name}')

for deployment in $DEPLOYMENTS; do
    log_info "Waiting for deployment/${deployment}..."
    if kubectl wait --for=condition=available --timeout=300s \
        deployment/"$deployment" -n "$NAMESPACE"; then
        log_success "Deployment ${deployment} is ready"
    else
        log_error "Deployment ${deployment} failed to become ready"
        kubectl describe deployment/"$deployment" -n "$NAMESPACE"
        kubectl logs -l app="${deployment#*-}" -n "$NAMESPACE" --tail=50
        exit 1
    fi
done

# Display status
echo ""
log_success "Deployment completed successfully!"
echo ""

# Get ingress URL
INGRESS_HOST=$(kubectl get ingress -n "$NAMESPACE" -o jsonpath='{.items[0].spec.rules[0].host}' 2>/dev/null || echo "N/A")

echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deployment Summary            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Namespace:${NC}     $NAMESPACE"
echo -e "  ${BLUE}Environment:${NC}   $ENVIRONMENT"
echo -e "  ${BLUE}Ingress Host:${NC}  $INGRESS_HOST"
echo ""

# Display pods
echo -e "${BLUE}Pods:${NC}"
kubectl get pods -n "$NAMESPACE"
echo ""

# Display services
echo -e "${BLUE}Services:${NC}"
kubectl get svc -n "$NAMESPACE"
echo ""

# Display ingress
echo -e "${BLUE}Ingress:${NC}"
kubectl get ingress -n "$NAMESPACE"
echo ""

echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  ${BLUE}View pods:${NC}           kubectl get pods -n $NAMESPACE"
echo -e "  ${BLUE}View logs:${NC}           kubectl logs -f deployment/[NAME] -n $NAMESPACE"
echo -e "  ${BLUE}Port forward Hub:${NC}    kubectl port-forward svc/${ENVIRONMENT}-hub 8080:8080 -n $NAMESPACE"
echo -e "  ${BLUE}Port forward Front:${NC}  kubectl port-forward svc/${ENVIRONMENT}-front 3000:80 -n $NAMESPACE"
echo -e "  ${BLUE}Delete deployment:${NC}   kubectl delete -k k8s/overlays/${ENVIRONMENT}"
echo ""

