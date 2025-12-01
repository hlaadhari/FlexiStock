Titre :
FlexiStock (Next.js + Node + PostgreSQL, Docker)

Résumé court :
Génère une application complète de gestion de stock (PWA Next.js frontend + API Node.js/Express backend + PostgreSQL + Redis) avec workflows demandes/approbation, alertes seuils, scan mobile offline, RBAC et déploiement Docker.

Prompt détaillé :

Build a production-ready project named AppStock (aka Stock Dashboard Dashing) using the following stack and architecture. Produce the full repository with frontend, backend, docker-compose, docs and seed data.

Stack & targets

Frontend: Next.js (App Router 14/15+), React 18, TypeScript, TailwindCSS, Shadcn UI, PWA support, IndexedDB for offline, React Query (TanStack) and Zustand for light state.

Backend: Node.js + Express + TypeScript + Prisma (PostgreSQL).

Cache/Session: Redis.

DB: PostgreSQL.

Auth: JWT + refresh tokens, RBAC (Admin, Manager, User).

Containerization: Docker multi-stage builds + docker-compose.yml (frontend, backend, postgres, redis, nginx/traefik optional).

CI: GitHub Actions templates for test/build/push images.

Monitoring: basic Prometheus metrics + Grafana dashboard placeholders (optional).

Minimal, resource-optimized by default (target VM 2 vCPU / 4 GB RAM).

Project structure to generate
# architecture optimisée.md

Functional requirements

1. Auth & RBAC
Signup (seeded admin), login (JWT access + refresh), role-based route guards.
Sessions stored in Redis (refresh tokens), access token short-lived.

2. Items / Inventory
CRUD items with fields: id, ref, name, categoryId, subCategoryId, quantity, minStock, location, status.
Stock movements: IN/OUT records and StockAudit entries.
Stock low/critical detection: cron job runs (default 5 min) and marks alerts.

3. Categories
Category (family) and SubCategory with hierarchical relation; toggle active; used in selects.

4. Requests & Approvals
Request creation by user (items + qty + priority).
Appoval workflow: PENDING → APPROVED_LEVEL1 → APPROVED → EXECUTED/REJECTED.
Manager/Admin endpoints to approve/reject; approved requests decrement stock and create movements.

5. Mobile / Offline
Barcode scanner page (WebRTC) in PWA.
Offline queue (IndexedDB) to collect stock movements, sync endpoint to accept batch updates idempotently.

6. Alerts & Notifications
Alerts endpoint + dashboard widget for items under minStock.
NotificationService placeholder (in-app / webhook); email optional.

7. Barcode & Labels
API to generate barcode PNG and printable PDF/A4 labels (use bwip-js or similar).

8. API & Docs
RESTful endpoints for all entities.
Swagger/OpenAPI generated at /api-docs.
Health check endpoint /api/health.

9. Seeds & Fixtures
Provide seed.ts to create: 3 users (admin, manager, user), 3 categories, 6 items, 3 sample requests.

10. Security & Validation
Input validation (Zod or express-validator).
Rate limiting middleware.
CORS configuration respecting VITE_API_URL.

11. Docker & Deployment
Multi-stage Dockerfiles for frontend and backend (small images).
docker-compose.yml with services: frontend, backend, postgres, redis, nginx (optional).
.env.example with all required vars (DB, REDIS, JWT secrets).
Provide scripts/deploy.sh and Makefile targets: make build, make up, make down, make seed.

12. CI
GitHub Actions workflow: ci.yml to run lint, tests, build, and push images to registry (placeholders for secrets).

13. Monitoring & Logging
Expose basic Prometheus metrics route /metrics (optional).
Structured logs (Winston) and a log rotate strategy.

14. Docs
README with quick start (local with docker-compose), env vars, seed, and production notes.
docs/WORFLOWS.md describing request and alert workflows.

Non-functional constraints:
Keep images small (multi-stage).
Default memory footprint: backend ~350–400MB, frontend ~200MB, postgres 512MB, redis 128MB.
Prefer simplicity: avoid heavy queue systems unless requested (Bull optional).

Output expectations
Full repo skeleton with working example endpoints and a working docker-compose up that boots frontend + backend + postgres + redis and loads seed data.
Working login (seeded admin) and sample dashboard page showing alert widget.
Swagger at /api-docs and README usage.

Extras (if easy to include)
Add a basic GitHub Actions workflow file.
Provide nginx/traefik example for production with Let's Encrypt hints.
Add minimal unit tests examples for backend controllers.