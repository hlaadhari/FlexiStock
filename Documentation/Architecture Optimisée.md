AppStock_DMSP/
├── docker-compose.yml
├── .env.example
├── Makefile
├── README.md
│
├── frontend/                              # 🎨 NEXT.JS 15 + REACT 18
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .eslintrc.json
│   │
│   ├── public/
│   │   ├── manifest.json                  # PWA
│   │   ├── sw.js                          # Service Worker
│   │   ├── icons/
│   │   └── offline.html
│   │
│   ├── src/
│   │   │
│   │   ├── app/                           # 📁 APP ROUTER (Next.js 15)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                   # Landing/Redirect
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── (auth)/                    # Route group - Auth
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx             # Layout sans sidebar
│   │   │   │
│   │   │   ├── (dashboard)/               # Route group - App
│   │   │   │   ├── layout.tsx             # Layout avec sidebar
│   │   │   │   │
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx           # KPIs + Alertes + Mouvements
│   │   │   │   │
│   │   │   │   ├── items/
│   │   │   │   │   ├── page.tsx           # Liste items
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.tsx       # Détails
│   │   │   │   │   │   └── edit/page.tsx  # Édition
│   │   │   │   │   └── new/page.tsx       # Création
│   │   │   │   │
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx           # Famille + Sous-famille
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   │
│   │   │   │   ├── stock/
│   │   │   │   │   ├── entries/           # Entrées
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── new/page.tsx
│   │   │   │   │   ├── exits/             # Sorties
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── new/page.tsx
│   │   │   │   │   ├── inventory/         # Inventaires
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── alerts/            # Alertes seuil min
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── requests/              # Demandes pièce
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   └── new/page.tsx
│   │   │   │   │
│   │   │   │   ├── approvals/             # Validation hiérarchique
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   │
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   └── scan/                  # Barcode Scan (WebRTC)
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── api/                       # API Routes (optionnel)
│   │   │       ├── auth/[...nextauth]/
│   │   │       │   └── route.ts
│   │   │       └── sync/
│   │   │           └── route.ts           # Offline sync endpoint
│   │   │
│   │   ├── components/                    # 🧩 COMPOSANTS (Shadcn UI)
│   │   │   │
│   │   │   ├── ui/                        # Shadcn components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   └── toast.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── AlertsWidget.tsx
│   │   │   │   ├── RecentMovements.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   │
│   │   │   ├── items/
│   │   │   │   ├── ItemCard.tsx
│   │   │   │   ├── ItemTable.tsx
│   │   │   │   ├── ItemForm.tsx
│   │   │   │   └── StockBadge.tsx
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── CategoryTree.tsx
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   └── SubCategorySelect.tsx
│   │   │   │
│   │   │   ├── stock/
│   │   │   │   ├── MovementForm.tsx
│   │   │   │   ├── MovementTable.tsx
│   │   │   │   ├── InventoryForm.tsx
│   │   │   │   └── AlertList.tsx
│   │   │   │
│   │   │   ├── requests/
│   │   │   │   ├── RequestForm.tsx
│   │   │   │   ├── RequestCard.tsx
│   │   │   │   ├── RequestTimeline.tsx      # Workflow visuel
│   │   │   │   └── StatusBadge.tsx
│   │   │   │
│   │   │   ├── approvals/
│   │   │   │   ├── ApprovalPanel.tsx
│   │   │   │   ├── ApprovalHistory.tsx
│   │   │   │   └── ValidationForm.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── UserTable.tsx
│   │   │   │   ├── UserForm.tsx
│   │   │   │   └── RoleBadge.tsx
│   │   │   │
│   │   │   ├── scan/
│   │   │   │   ├── BarcodeScanner.tsx       # WebRTC
│   │   │   │   ├── ScanResult.tsx
│   │   │   │   └── CameraPermission.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── NotificationToast.tsx
│   │   │       ├── SearchBar.tsx
│   │   │       └── OfflineIndicator.tsx
│   │   │
│   │   ├── hooks/                         # 🪝 CUSTOM HOOKS
│   │   │   ├── useAuth.ts
│   │   │   ├── useItems.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useStock.ts
│   │   │   ├── useRequests.ts
│   │   │   ├── useApprovals.ts
│   │   │   ├── useUsers.ts
│   │   │   ├── useBarcode.ts
│   │   │   ├── useOfflineSync.ts           # IndexedDB sync
│   │   │   ├── useNotifications.ts
│   │   │   └── usePermissions.ts           # RBAC helper
│   │   │
│   │   ├── lib/                           # 🔧 UTILS & SERVICES
│   │   │   │
│   │   │   ├── api/                       # API Client (Axios)
│   │   │   │   ├── client.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── items.ts
│   │   │   │   ├── categories.ts
│   │   │   │   ├── stock.ts
│   │   │   │   ├── requests.ts
│   │   │   │   ├── approvals.ts
│   │   │   │   └── users.ts
│   │   │   │
│   │   │   ├── store/                     # 🗄️ ZUSTAND STORES
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── itemStore.ts
│   │   │   │   ├── stockStore.ts
│   │   │   │   ├── requestStore.ts
│   │   │   │   ├── notificationStore.ts
│   │   │   │   └── offlineStore.ts        # Queue offline actions
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── offlineService.ts      # IndexedDB manager
│   │   │   │   ├── syncService.ts         # Diff & sync
│   │   │   │   ├── notificationService.ts
│   │   │   │   └── barcodeService.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── permissions.ts         # RBAC helpers
│   │   │   │
│   │   │   └── types/                     # 📝 TYPESCRIPT TYPES
│   │   │       ├── auth.ts
│   │   │       ├── item.ts
│   │   │       ├── category.ts
│   │   │       ├── stock.ts
│   │   │       ├── request.ts
│   │   │       ├── approval.ts
│   │   │       ├── user.ts
│   │   │       └── api.ts
│   │   │
│   │   └── middleware.ts                  # Next.js middleware (auth)
│   │
│   └── components.json                    # Shadcn config
│
├── backend/                               # 🔌 NODE.JS + EXPRESS + PRISMA
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── package.json
│   ├── tsconfig.json
│   │
│   ├── src/
│   │   ├── index.ts                       # Entry point
│   │   ├── app.ts                         # Express app
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── jwt.ts
│   │   │   ├── cors.ts
│   │   │   └── multer.ts                  # Upload config
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts                    # JWT validation
│   │   │   ├── rbac.ts                    # Role-based access
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── logger.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── items.routes.ts
│   │   │   ├── categories.routes.ts
│   │   │   ├── stock.routes.ts
│   │   │   ├── requests.routes.ts
│   │   │   ├── approvals.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── barcode.routes.ts
│   │   │   ├── sync.routes.ts             # Offline sync
│   │   │   └── reports.routes.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── AuthController.ts          # Login + JWT + refresh
│   │   │   ├── ItemController.ts          # CRUD items
│   │   │   ├── CategoryController.ts      # Famille + sous-famille
│   │   │   ├── StockController.ts         # Entrées/Sorties/Inventaires
│   │   │   ├── RequestController.ts       # Demandes pièce
│   │   │   ├── ApprovalController.ts      # Validation multi-niveaux
│   │   │   ├── UserController.ts          # CRUD users
│   │   │   ├── BarcodeController.ts       # Génération PDF/PNG
│   │   │   ├── SyncController.ts          # Offline sync
│   │   │   └── ReportController.ts        # PDF/Excel exports
│   │   │
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   ├── ItemService.ts
│   │   │   ├── CategoryService.ts
│   │   │   ├── StockService.ts
│   │   │   ├── RequestService.ts          # Workflow requests
│   │   │   ├── ApprovalService.ts         # Validation logic
│   │   │   ├── UserService.ts
│   │   │   ├── BarcodeService.ts
│   │   │   ├── SyncService.ts             # Diff & merge
│   │   │   ├── NotificationService.ts
│   │   │   ├── AlertService.ts            # Stock alerts
│   │   │   └── ReportService.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── ItemRepository.ts
│   │   │   ├── CategoryRepository.ts
│   │   │   ├── StockRepository.ts
│   │   │   ├── RequestRepository.ts
│   │   │   ├── ApprovalRepository.ts
│   │   │   └── UserRepository.ts
│   │   │
│   │   ├── validators/                    # Zod schemas
│   │   │   ├── item.validator.ts
│   │   │   ├── category.validator.ts
│   │   │   ├── stock.validator.ts
│   │   │   ├── request.validator.ts
│   │   │   └── user.validator.ts
│   │   │
│   │   ├── jobs/                          # 🔄 BACKGROUND JOBS
│   │   │   ├── stockAlertJob.ts           # Cron 5 min - alertes
│   │   │   ├── reportJob.ts
│   │   │   └── cleanupJob.ts
│   │   │
│   │   └── utils/
│   │       ├── logger.ts                  # Winston
│   │       ├── cache.ts                   # Redis helpers
│   │       ├── crypto.ts                  # Bcrypt
│   │       └── helpers.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma                  # DB Schema
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   └── tests/
│       ├── unit/
│       └── integration/
│
├── nginx/                                 # 🌐 REVERSE PROXY
│   ├── Dockerfile
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.conf
│       └── ssl.conf
│
├── monitoring/                            # 📊 MONITORING (optionnel)
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       └── dashboards/
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── backup-db.sh
│   ├── restore-db.sh
│   └── migrate.sh
│
└── docs/
    ├── API.md
    ├── ARCHITECTURE.md
    ├── WORKFLOWS.md
    ├── DEPLOYMENT.md
    └── RBAC.md
