# Backend Documentation

Express.js API server for the Furniture Marketplace.

---

## 📁 Folder Structure

```
backend/
├── /config
│   ├── database.js   → Prisma client initialization
│   ├── env.js        → Environment variable validation
│   └── multer.js     → File upload configuration
│
├── /middleware
│   ├── auth.js       → JWT verification
│   └── roleGuard.js  → Role-based access (ADMIN, WORKSHOP, CLIENT)
│
├── /controllers
│   ├── authController.js      → login, register, getMe
│   ├── workshopController.js  → CRUD, dashboard
│   ├── designController.js    → products CRUD
│   ├── leadController.js      → leads, offers
│   └── adminController.js     → admin operations
│
├── /routes
│   ├── auth.js       → /api/auth/*
│   ├── designs.js    → /api/designs/*, /api/workshop/products/*
│   ├── leads.js      → /api/leads/*, /api/workshop/leads/*
│   ├── workshops.js  → /api/workshops/*
│   ├── admin.js      → /api/admin/*
│   └── index.js      → Route aggregator
│
├── /prisma
│   └── schema.prisma → Database schema
│
├── .env.example      → Environment template
└── index.js          → Server entry point
```

---

## 🛤️ API Routes

### Public Routes (No Auth)
| Method | Route | Controller | Description |
|--------|-------|------------|-------------|
| POST | `/api/auth/register` | authController.register | Create account |
| POST | `/api/auth/login` | authController.login | Login |
| GET | `/api/designs` | designController.getDesigns | List designs |
| GET | `/api/designs/:id` | designController.getDesign | Design detail |
| GET | `/api/workshops` | workshopController.getWorkshops | List workshops |
| POST | `/api/leads` | leadController.submitLead | Submit request |

### Workshop Routes (Requires WORKSHOP role)
| Method | Route | Controller | Description |
|--------|-------|------------|-------------|
| GET | `/api/workshops/me` | workshopController.getMyWorkshop | Own profile |
| POST | `/api/workshops` | workshopController.saveWorkshop | Create/update |
| GET | `/api/workshop/home` | workshopController.getDashboard | Stats |
| GET | `/api/workshop/products` | designController.getMyDesigns | Own products |
| POST | `/api/workshop/products` | designController.createDesign | Add product |
| PUT | `/api/workshop/products/:id` | designController.updateDesign | Edit product |
| DELETE | `/api/workshop/products/:id` | designController.deleteDesign | Archive |
| GET | `/api/workshop/leads` | leadController.getWorkshopLeads | Received leads |

### Admin Routes (Requires ADMIN role)
| Method | Route | Controller | Description |
|--------|-------|------------|-------------|
| GET | `/api/admin/overview` | adminController.getOverview | Dashboard |
| GET | `/api/admin/users` | adminController.getUsers | All users |
| PUT | `/api/admin/users/:id/block` | adminController.toggleUserBlock | Block user |
| GET | `/api/admin/workshops` | adminController.getWorkshops | All workshops |
| PUT | `/api/admin/workshops/:id/status` | adminController.updateWorkshopStatus | Approve/reject |
| GET | `/api/admin/leads` | adminController.getLeads | All leads |
| POST | `/api/admin/leads/:id/distribute` | adminController.distributeLead | Send to workshops |

---

## 🔐 Authentication

```javascript
// Middleware usage in routes:
router.get('/protected', authenticate, handler);
router.get('/admin-only', authenticate, requireAdmin, handler);
router.get('/workshop-only', authenticate, requireWorkshop, handler);
```

**Token format:** `Authorization: Bearer <jwt-token>`

---

## 🗃️ Database Schema

| Model | Key Fields | Relations |
|-------|------------|-----------|
| User | email, password, role | → Workshop |
| Workshop | name, location, status | → User, Products, LeadDeliveries |
| Product | title, price, images | → Workshop, Leads |
| Lead | clientPhone, description | → LeadDeliveries |
| LeadDelivery | workshopId, viewStatus | → Lead, Workshop, Offers |
| Offer | price, leadTimeDays | → LeadDelivery |

---

## ⚙️ Where to Modify

| To Change... | Edit File |
|--------------|-----------|
| Add new route | Create in `/routes/`, register in `/routes/index.js` |
| Add business logic | Add function in `/controllers/` |
| Add middleware | Create in `/middleware/` |
| Change DB schema | Edit `/prisma/schema.prisma`, run `npx prisma migrate dev` |
| Add env variable | Add to `.env.example` and `/config/env.js` |

---

## 🚀 Running

```bash
# Development
npm run dev

# Production
npm start

# Database
npx prisma migrate dev    # Apply migrations
npx prisma studio         # Visual DB editor
```
