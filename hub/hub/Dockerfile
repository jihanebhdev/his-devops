# ============================================================================
# HIS Hub - Multi-stage Docker Build
# Spring Boot Backend
# ============================================================================

# Stage 1: Build Stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

LABEL maintainer="HIS DevOps Team"
LABEL description="HIS Hub Backend - Spring Boot Application"

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime Stage
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="HIS DevOps Team"
LABEL version="1.0.0"

# Install system utilities
RUN apk add --no-cache \
    curl \
    tzdata \
    && ln -sf /usr/share/zoneinfo/UTC /etc/localtime

# Create app user (non-root)
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM options
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Application properties
ENV SPRING_PROFILES_ACTIVE=prod

# Entry point
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

