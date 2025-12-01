# FlexiStock - Stock Management Application

A complete stock management system built with Next.js 15, Node.js/Express, PostgreSQL, and Redis.

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd FlexiStock_App
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@flexistock.com | password123 | ADMIN |
| manager@flexistock.com | password123 | MANAGER |
| user@flexistock.com | password123 | USER |

## Features

### Implemented
- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (ADMIN, MANAGER, USER)
- ✅ Item management (CRUD operations)
- ✅ Category management with hierarchy
- ✅ Stock movements (IN/OUT/AUDIT) with transaction support
- ✅ Low stock alerts
- ✅ Responsive UI with Tailwind CSS

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

#### Items
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get item details
- `GET /api/items/low-stock` - Get low stock items
- `POST /api/items` - Create item (ADMIN/MANAGER)
- `PUT /api/items/:id` - Update item (ADMIN/MANAGER)
- `DELETE /api/items/:id` - Delete item (ADMIN)

#### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (ADMIN/MANAGER)
- `PUT /api/categories/:id` - Update category (ADMIN/MANAGER)
- `DELETE /api/categories/:id` - Delete category (ADMIN)

#### Stock Movements
- `GET /api/stock/movements` - List all movements
- `POST /api/stock/movements` - Create movement (ADMIN/MANAGER)
- `GET /api/stock/movements/item/:itemId` - Get item movements

## Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build

# Database operations
docker-compose exec backend npx prisma db push
docker-compose exec backend npm run seed
```

## Development

### Backend (Node.js + Express + Prisma)
- Hot reload with ts-node-dev
- Located in `backend/src/`
- Database schema in `backend/prisma/schema.prisma`

### Frontend (Next.js 15)
- Hot reload enabled
- Located in `frontend/src/app/`
- API client in `frontend/src/lib/api/`

## Database Schema

- **User** - Authentication and roles
- **Category** - Hierarchical categories
- **Item** - Stock items with quantity tracking
- **StockMovement** - Movement history (IN/OUT/AUDIT)
- **Request** - Stock requests (schema ready, endpoints pending)
- **Approval** - Multi-level approvals (schema ready, endpoints pending)

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Deployment**: Docker

## Troubleshooting

### Backend not starting
```bash
docker-compose logs backend
docker-compose restart backend
```

### Database connection issues
```bash
docker-compose restart postgres
docker-compose exec backend npx prisma db push
```

### Port conflicts
Edit `docker-compose.yml` to change port mappings if needed.

## License

MIT
