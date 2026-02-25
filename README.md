# 🪑 Furniture Marketplace

A startup-grade platform connecting furniture workshops with customers in Algeria.

---

## 📁 Project Structure

```
furniture-market/
├── /frontend          ← React + Vite frontend
│   ├── /api           ← API service modules
│   ├── /pages         ← Page components
│   ├── /components    ← Reusable UI components
│   └── /styles        ← CSS with Warm Wood theme
│
├── /backend           ← Express.js backend
│   ├── /config        ← Database, env, uploads config
│   ├── /controllers   ← Business logic
│   ├── /middleware    ← Auth, role guards
│   ├── /routes        ← API endpoints
│   └── /prisma        ← Database schema
│
└── /server            ← Legacy backend (being replaced)
```

---

## 🚀 Quick Start

### Frontend
```bash
cd furniture-market
npm install
npm run dev
```

### Backend
```bash
cd furniture-market/backend
npm install
cp .env.example .env  # Edit with your values
npx prisma migrate dev
npm start
```

---

## 🔄 Data Flow: UI → API → Database

```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐     ┌──────────┐
│   Browser   │ ──▶ │  frontend/  │ ──▶ │   backend/    │ ──▶ │ Database │
│   (User)    │     │  api/*.js   │     │  routes/*.js  │     │ (Prisma) │
└─────────────┘     └─────────────┘     └───────────────┘     └──────────┘
```

**Example: User submits a request**
1. User fills form in `LeadForm.jsx`
2. Form calls `frontend/api/leads.js` → `submitLead(data)`
3. API sends `POST /api/leads` to backend
4. `backend/routes/leads.js` passes to `leadController.submitLead`
5. Controller saves to database via Prisma
6. Response returns: `{ success: true, leadId: 123 }`

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [README_frontend.md](./README_frontend.md) | Frontend structure, pages, API modules |
| [README_backend.md](./README_backend.md) | Backend routes, controllers, middleware |

---

## 🗃️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (CLIENT, WORKSHOP, ADMIN) |
| `workshops` | Workshop business profiles |
| `products` | Furniture designs/items |
| `leads` | Customer requests |
| `lead_deliveries` | Which workshop received which lead |
| `workshop_payments` | Subscription payments |

---

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3000
```

---

## 📝 Key Decisions

1. **Flat folder structure** - Find any file in 3 seconds
2. **Controllers ≠ Routes** - Separation of concerns
3. **Arabic error messages** - For Algerian users
4. **Soft delete** - Never truly delete, just archive
5. **JWT auth** - Stateless, scalable

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, CSS Variables |
| Backend | Express.js, Node.js |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (JSON Web Tokens) |
