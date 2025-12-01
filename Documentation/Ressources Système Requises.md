# 📊 Ressources Système - AppStock_DMSP
**Stack: Next.js 15 + Node.js + Express + Prisma + PostgreSQL + Redis**

---

## 🎯 Configuration MINIMALE (Dev/Test)

### Serveur Unique
```yaml
CPU:      2 vCPU
RAM:      4 GB
Disque:   30 GB SSD
OS:       Ubuntu 22.04 LTS
Network:  100 Mbps
```

### Docker Compose - Limites par conteneur
```yaml
services:
  frontend:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
      reservations:
        cpus: '0.25'
        memory: 256M

  backend:
    resources:
      limits:
        cpus: '0.75'
        memory: 768M
      reservations:
        cpus: '0.5'
        memory: 512M

  postgres:
    resources:
      limits:
        cpus: '0.5'
        memory: 1G
      reservations:
        cpus: '0.25'
        memory: 512M

  redis:
    resources:
      limits:
        cpus: '0.25'
        memory: 256M
      reservations:
        cpus: '0.1'
        memory: 128M

  nginx:
    resources:
      limits:
        cpus: '0.25'
        memory: 256M
```

### Capacité Minimale
- **Utilisateurs simultanés:** 10-20
- **Articles en stock:** 1 000-5 000
- **Demandes/jour:** 50-100
- **Transactions/sec:** 20-50 TPS

**💰 Coût VPS:** ~10-15€/mois (Hetzner CX21, Scaleway DEV1-M)

---

## 🚀 Configuration RECOMMANDÉE (Production PME)

### Serveur Production
```yaml
CPU:      4 vCPU
RAM:      8 GB
Disque:   80 GB SSD NVMe
OS:       Ubuntu 22.04 LTS
Network:  200 Mbps
Backup:   20 GB
```

### Docker Compose - Configuration Optimale
```yaml
version: '3.8'

services:
  # Next.js Frontend (SSR + Static)
  frontend:
    image: appstock/frontend:latest
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 2G
        reservations:
          cpus: '0.75'
          memory: 1G
    environment:
      NODE_ENV: production
      NODE_OPTIONS: --max-old-space-size=1536
      NEXT_TELEMETRY_DISABLED: 1
    volumes:
      - ./uploads:/app/uploads:ro

  # Node.js Backend (Express + Prisma)
  backend:
    image: appstock/backend:latest
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1.5G
    environment:
      NODE_ENV: production
      NODE_OPTIONS: --max-old-space-size=1536
      DATABASE_POOL_MIN: 2
      DATABASE_POOL_MAX: 10
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  # PostgreSQL 16
  postgres:
    image: postgres:16-alpine
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 3G
        reservations:
          cpus: '0.5'
          memory: 2G
    environment:
      POSTGRES_DB: appstock
      POSTGRES_USER: appstock
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      # Optimisations PostgreSQL
      POSTGRES_SHARED_BUFFERS: 768MB
      POSTGRES_EFFECTIVE_CACHE_SIZE: 2GB
      POSTGRES_MAINTENANCE_WORK_MEM: 256MB
      POSTGRES_WORK_MEM: 16MB
      POSTGRES_MAX_CONNECTIONS: 100
      POSTGRES_RANDOM_PAGE_COST: 1.1  # Pour SSD
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    command: >
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

  # Redis 7 (Sessions + Cache)
  redis:
    image: redis:7-alpine
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
      --maxmemory 384mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
      --save 60 10000
      --appendonly yes
    volumes:
      - redis_data:/data

  # Nginx (Reverse Proxy + SSL)
  nginx:
    image: nginx:alpine
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

volumes:
  postgres_data:
  redis_data:
```

### Répartition Ressources
| Service    | CPU   | RAM     | Disque | Utilisation |
|------------|-------|---------|--------|-------------|
| Frontend   | 1.5   | 2 GB    | 5 GB   | Next.js SSR + cache statique |
| Backend    | 1.5   | 2 GB    | 10 GB  | API + Prisma + Jobs |
| PostgreSQL | 1     | 3 GB    | 40 GB  | Base de données + indexes |
| Redis      | 0.5   | 512 MB  | 5 GB   | Sessions + cache API |
| Nginx      | 0.5   | 512 MB  | 5 GB   | Reverse proxy + SSL |
| **TOTAL**  | **5** | **8 GB**| **65 GB** | |

### Capacité Production
- **Utilisateurs simultanés:** 100-200
- **Articles en stock:** 10 000-100 000
- **Demandes/jour:** 1 000-2 000
- **Transactions/sec:** 200-500 TPS
- **Scans barcode/jour:** 500-1 000
- **Mouvements stock/jour:** 1 000-3 000

**💰 Coût VPS:** ~25-40€/mois (Hetzner CPX31, OVH B2-15)

---

## 💼 Configuration ENTREPRISE (Haute disponibilité)

### Architecture Distribuée
```yaml
Load Balancer:      1x (2 vCPU, 2 GB)     - Traefik/HAProxy
Frontend:           2x (2 vCPU, 2 GB)     - Réplication + failover
Backend:            3x (2 vCPU, 4 GB)     - Pool workers
PostgreSQL Master:  1x (4 vCPU, 8 GB)     - Primary
PostgreSQL Replica: 1x (4 vCPU, 8 GB)     - Read replica
Redis:              2x (2 vCPU, 2 GB)     - Master + Sentinel
Worker Queue:       1x (2 vCPU, 2 GB)     - BullMQ jobs
Monitoring:         1x (2 vCPU, 4 GB)     - Prometheus + Grafana

TOTAL: 20 vCPU, 38 GB RAM, 300 GB SSD
```

### Capacité Entreprise
- **Utilisateurs simultanés:** 500-1 000
- **Articles en stock:** 100 000+
- **Demandes/jour:** 5 000-10 000
- **Transactions/sec:** 1 000-2 000 TPS
- **Uptime SLA:** 99.9%

**💰 Coût Infrastructure:** ~150-250€/mois

---

## 📱 Ressources Clients (PWA Mobile)

### Smartphone Minimum
```yaml
OS:          Android 8+ / iOS 12+
RAM:         2 GB
Stockage:    200 MB libre
  - App PWA:     10 MB
  - Cache:       50 MB
  - IndexedDB:   100 MB (offline)
  - Images:      40 MB
Réseau:      3G min (4G recommandé)
Caméra:      Requise (scan barcode)
```

### Consommation Data Estimée
- **Installation PWA:** 8-12 MB
- **Usage normal/jour:** 5-10 MB
- **Mode offline:** 0 MB (sync différée)
- **Scan barcode:** 0.5 MB/scan (upload image)
- **Total/mois:** 100-300 MB

---

## 🔧 Optimisations Performances

### 1. PostgreSQL Tuning (8 GB RAM)
```sql
-- postgresql.conf optimisé
shared_buffers = 768MB              # 25% RAM
effective_cache_size = 2GB          # 50% RAM
maintenance_work_mem = 256MB
work_mem = 16MB
max_connections = 100

# SSD optimizations
random_page_cost = 1.1
effective_io_concurrency = 200

# Write performance
wal_buffers = 16MB
checkpoint_completion_target = 0.9
min_wal_size = 1GB
max_wal_size = 4GB
```

### 2. Redis Optimizations
```conf
maxmemory 384mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
appendonly yes
tcp-backlog 511
```

### 3. Next.js Production Build
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p 3000"
  }
}
```

**Optimisations automatiques:**
- Image optimization (WebP)
- Code splitting automatique
- Static Generation (SSG)
- Incremental Static Regeneration (ISR)
- Tree shaking
- Minification CSS/JS

### 4. Node.js Backend Optimizations
```javascript
// PM2 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'appstock-backend',
    script: 'dist/index.js',
    instances: 2,  // Cluster mode
    exec_mode: 'cluster',
    max_memory_restart: '1500M',
    env_production: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=1536'
    }
  }]
}
```

---

## 📊 Monitoring Ressources (Recommandé)

### Prometheus + Grafana
```yaml
monitoring:
  prometheus:
    resources:
      cpus: '0.5'
      memory: 1G
    
  grafana:
    resources:
      cpus: '0.5'
      memory: 1G
```

### Métriques clés à monitorer
- CPU usage par conteneur
- Mémoire RAM utilisée/disponible
- Disk I/O (IOPS)
- PostgreSQL connections actives
- Redis hit rate
- API response time (p50, p95, p99)
- Requests per second (RPS)
- Error rate 5xx
- Stock alerts actives
- Offline sync queue size

---

## 💾 Stratégie Backup

### PostgreSQL
```bash
# Backup quotidien (2h du matin)
0 2 * * * docker exec postgres pg_dump -U appstock appstock | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Rétention: 14 jours
find /backups -name "db_*.sql.gz" -mtime +14 -delete
```

**Espace backup:** ~5-10 GB (14 jours)

### Uploads & Barcodes
```bash
# rsync quotidien
0 3 * * * rsync -av /var/www/uploads /backups/uploads
```

**Espace upload:** ~2-5 GB

---

## 🚀 Scaling Recommendations

### Quand scaler ?

| Métrique | Seuil | Action |
|----------|-------|--------|
| CPU > 70% | 5 min | +1 vCPU |
| RAM > 85% | 5 min | +2 GB RAM |
| Disk > 80% | - | +20 GB |
| API latency > 500ms | p95 | +1 backend instance |
| DB connections > 80 | - | Optimiser queries |
| Redis memory > 90% | - | +256 MB ou purge cache |

### Horizontal Scaling
```yaml
# docker-compose.override.yml
services:
  backend:
    deploy:
      replicas: 3  # 3 instances backend
      
  frontend:
    deploy:
      replicas: 2  # 2 instances frontend
```

---

## 📋 Résumé par Scénario

### 🏢 Petit Bureau (5-20 users)
- **VPS:** 2 vCPU, 4 GB RAM, 30 GB SSD
- **Coût:** ~12€/mois
- **Provider:** Hetzner CX21, Contabo VPS S

### 🏭 PME (50-200 users)
- **VPS:** 4 vCPU, 8 GB RAM, 80 GB SSD
- **Coût:** ~30€/mois
- **Provider:** Hetzner CPX31, OVH B2-15

### 🏢 Entreprise (500+ users)
- **Cluster:** 20 vCPU, 38 GB RAM, 300 GB SSD
- **Coût:** ~200€/mois
- **Provider:** OVH, Scaleway, AWS/GCP (managed)

---

## ✅ Checklist Déploiement

- [ ] VM/VPS avec Ubuntu 22.04
- [ ] Docker + Docker Compose installés
- [ ] Firewall UFW configuré (80, 443, 22)
- [ ] SSL Let's Encrypt (Certbot)
- [ ] Backup automatique configuré
- [ ] Monitoring Grafana/Netdata
- [ ] Logs centralisés (Winston)
- [ ] Node-cron pour stock alerts (5 min)
- [ ] PM2 ou systemd pour process management
- [ ] Reverse proxy Nginx/Traefik
- [ ] Redis persistence activée
- [ ] PostgreSQL tuning appliqué
