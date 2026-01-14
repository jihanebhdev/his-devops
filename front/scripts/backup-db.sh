#!/bin/bash

# Database Backup Script for Healthcare Information System
# Usage: ./backup-db.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
NAMESPACE="his-system"
POD_NAME="mysql-0"
DB_NAME="his_db"
DB_USER="root"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Database Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Timestamp: ${YELLOW}${TIMESTAMP}${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Backup filename
BACKUP_FILE="${BACKUP_DIR}/his_db_${ENVIRONMENT}_${TIMESTAMP}.sql"

if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "staging" ]; then
    # Kubernetes backup
    echo -e "${YELLOW}Creating backup from Kubernetes pod...${NC}"
    
    kubectl exec -n ${NAMESPACE} ${POD_NAME} -- mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_FILE}
    
else
    # Local Docker backup
    echo -e "${YELLOW}Creating backup from local Docker container...${NC}"
    
    docker exec his-mysql mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_FILE}
fi

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip ${BACKUP_FILE}
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get file size
FILE_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)

echo -e "${GREEN}✓ Backup created successfully${NC}"
echo -e "File: ${YELLOW}${BACKUP_FILE}${NC}"
echo -e "Size: ${YELLOW}${FILE_SIZE}${NC}"
echo ""

# Upload to cloud storage (optional - uncomment if using AWS S3)
# echo -e "${YELLOW}Uploading to S3...${NC}"
# aws s3 cp ${BACKUP_FILE} s3://your-bucket/database-backups/
# echo -e "${GREEN}✓ Backup uploaded to S3${NC}"

# Clean old backups (keep last 7 days)
echo -e "${YELLOW}Cleaning old backups...${NC}"
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete
echo -e "${GREEN}✓ Old backups cleaned${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

