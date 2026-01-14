#!/bin/bash

# Database Restore Script for Healthcare Information System
# Usage: ./restore-db.sh [backup_file] [environment]

set -e

# Configuration
BACKUP_FILE=$1
ENVIRONMENT=${2:-development}
NAMESPACE="his-system"
POD_NAME="mysql-0"
DB_NAME="his_db"
DB_USER="root"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not provided${NC}"
    echo "Usage: ./restore-db.sh [backup_file] [environment]"
    echo "Example: ./restore-db.sh backups/his_db_20250101_120000.sql.gz production"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Database Restore Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Backup File: ${YELLOW}${BACKUP_FILE}${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo ""

# Warning
echo -e "${RED}WARNING: This will overwrite the existing database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Decompress if needed
TEMP_FILE="${BACKUP_FILE}"
if [[ $BACKUP_FILE == *.gz ]]; then
    echo -e "${YELLOW}Decompressing backup...${NC}"
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c ${BACKUP_FILE} > ${TEMP_FILE}
fi

if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "staging" ]; then
    # Kubernetes restore
    echo -e "${YELLOW}Restoring to Kubernetes pod...${NC}"
    
    # Drop existing database
    kubectl exec -n ${NAMESPACE} ${POD_NAME} -- mysql -u ${DB_USER} -p${DB_PASSWORD} -e "DROP DATABASE IF EXISTS ${DB_NAME};"
    
    # Create new database
    kubectl exec -n ${NAMESPACE} ${POD_NAME} -- mysql -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE ${DB_NAME};"
    
    # Restore backup
    cat ${TEMP_FILE} | kubectl exec -i -n ${NAMESPACE} ${POD_NAME} -- mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}
    
else
    # Local Docker restore
    echo -e "${YELLOW}Restoring to local Docker container...${NC}"
    
    # Drop existing database
    docker exec his-mysql mysql -u ${DB_USER} -p${DB_PASSWORD} -e "DROP DATABASE IF EXISTS ${DB_NAME};"
    
    # Create new database
    docker exec his-mysql mysql -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE ${DB_NAME};"
    
    # Restore backup
    cat ${TEMP_FILE} | docker exec -i his-mysql mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}
fi

# Clean up temp file if it was decompressed
if [[ $BACKUP_FILE == *.gz ]]; then
    rm ${TEMP_FILE}
fi

echo -e "${GREEN}✓ Database restored successfully${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Restore completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

