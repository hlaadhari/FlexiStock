# ============================================================================
# docker-compose.yml - Configuration Production Optimisée
# Stack: Next.js 15 + Node.js + Express + Prisma + PostgreSQL + Redis
# ============================================================================

version: '3.8'

services:
  # ==========================================================================
  # FRONTEND - Next.js 15 (React 18 + Shadcn UI)
  # ==========================================================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        - NODE_ENV=production
    image: flexiStock/frontend:latest
    container_name: flexiStock_frontend
    restart: unless-stopped
    
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 2G
        reservations:
          cpus: '0.75'
          memory: 1G
    
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:4000/api
      - NEXT_TELEMETRY_DISABLED=1
      - PORT=3000
    
    expose:
      - "3000"
    
    networks:
      - flexiStock-network
    
    depends_on:
      - backend
    
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ==========================================================================
  # BACKEND - Node.js + Express + Prisma
  # ==========================================================================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
      args:
        - NODE_ENV=production
    image: flexiStock/backend:latest
    container_name: flexiStock_backend
    restart: unless-stopped
    
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1.5G
    
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=1536
      - PORT=4000
      
      # Database
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public&connect_timeout=10&pool_timeout=10
      - DATABASE_POOL_MIN=2
      - DATABASE_POOL_MAX=10
      
      # Redis
      - REDIS_URL=redis://redis:6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      
      # JWT
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRE=${JWT_EXPIRE:-7d}
      - JWT_REFRESH_EXPIRE=${JWT_REFRESH_EXPIRE:-30d}
      
      # Upload
      - UPLOAD_DIR=/app/uploads
      - MAX_FILE_SIZE=10485760
      
      # Cron
      - STOCK_ALERT_CRON=${STOCK_ALERT_CRON:-*/5 * * * *}
      
      # Logs
      - LOG_LEVEL=${LOG_LEVEL:-info}
    
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    
    expose:
      - "4000"
    
    networks:
      - FlexiStock-network
    
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # ==========================================================================
  # POSTGRES 16 - Database avec optimisations
  # ==========================================================================
  postgres:
    image: postgres:16-alpine
    container_name: flexiStock_postgres
    restart: unless-stopped
    
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 3G
        reservations:
          cpus: '0.5'
          memory: 2G
    
    environment:
      - POSTGRES_DB=${DB_NAME:-FlexiStock}
      - POSTGRES_USER=${DB_USER:-FlexiStock}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF8 --locale=en_US.UTF-8
      - PGDATA=/var/lib/postgresql/data/pgdata
    
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
      - ./database/init:/docker-entrypoint-initdb.d:ro
    
    command: >
      postgres
      -c shared_buffers=768MB
      -c effective_cache_size=2GB
      -c maintenance_work_mem=256MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=16MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
      -c max_connections=100
      -c log_statement=none
      -c log_duration=off
      -c log_min_duration_statement=1000
    
    ports:
      - "127.0.0.1:5432:5432"  # Localhost uniquement
    
    networks:
      - flexiStock-network
    
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-FlexiStock} -d ${DB_NAME:-FlexiStock}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ==========================================================================
  # REDIS 7 - Cache & Sessions
  # ==========================================================================
  redis:
    image: redis:7-alpine
    container_name: flexiStock_redis
    restart: unless-stopped
    
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 384mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
      --save 60 10000
      --appendonly yes
      --appendfilename "appendonly.aof"
      --tcp-backlog 511
      --timeout 300
      --tcp-keepalive 60
    
    volumes:
      - redis_data:/data
    
    ports:
      - "127.0.0.1:6379:6379"  # Localhost uniquement
    
    networks:
      - flexiStock-network
    
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 10s

  # ==========================================================================
  # NGINX - Reverse Proxy + SSL Termination
  # ==========================================================================
  nginx:
    image: nginx:alpine
    container_name: flexiStock_nginx
    restart: unless-stopped
    
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    
    ports:
      - "80:80"
      - "443:443"
    
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./uploads:/var/www/uploads:ro
      - nginx_cache:/var/cache/nginx
      - nginx_logs:/var/log/nginx
    
    networks:
      - flexiStock-network
    
    depends_on:
      - frontend
      - backend
    
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ==========================================================================
  # OPTIONAL: Adminer - DB Admin (Dev/Debug uniquement)
  # ==========================================================================
  adminer:
    image: adminer:latest
    container_name: flexiStock_adminer
    restart: unless-stopped
    profiles:
      - debug
    
    environment:
      - ADMINER_DEFAULT_SERVER=postgres
      - ADMINER_DESIGN=pepa-linha
    
    ports:
      - "127.0.0.1:8080:8080"
    
    networks:
      - flexiStock-network
    
    depends_on:
      - postgres

# ==============================================================================
# VOLUMES PERSISTANTS
# ==============================================================================
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  nginx_cache:
    driver: local
  nginx_logs:
    driver: local

# ==============================================================================
# NETWORK
# ==============================================================================
networks:
  flexiStock-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.25.0.0/16
