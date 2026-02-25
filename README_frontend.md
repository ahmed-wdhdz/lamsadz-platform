# Frontend Documentation

React + Vite frontend for the Furniture Marketplace.

---

## 📁 Folder Structure

```
frontend/
├── /api              ← API service modules
│   ├── auth.js       → login(), register(), getMe()
│   ├── designs.js    → getDesigns(), getDesign(), createDesign()
│   ├── leads.js      → submitLead(), getWorkshopLeads()
│   ├── workshops.js  → getWorkshops(), saveWorkshop()
│   ├── admin.js      → getUsers(), getAdminLeads(), validatePayment()
│   └── index.js      → Central export
│
├── /pages            ← One file = one screen
├── /components       ← Reusable UI pieces
├── /styles           ← Warm Wood CSS theme
└── /context          ← React context (auth, language)
```

---

## 📄 Page → File Mapping

| Screen | File | API Used |
|--------|------|----------|
| Home | `pages/Home.jsx` | `getDesigns()` |
| Design Gallery | `pages/Designs.jsx` | `getDesigns()` |
| Design Details | `pages/DesignDetails.jsx` | `getDesign(id)`, `submitLead()` |
| Login | `pages/Login.jsx` | `login()` |
| Register | `pages/Register.jsx` | `register()` |
| Workshops List | `pages/WorkshopsList.jsx` | `getWorkshops()` |
| Workshop Dashboard | `pages/workshop/WorkshopHome.jsx` | `getDashboard()` |
| Workshop Designs | `pages/workshop/MyDesigns.jsx` | `getMyDesigns()` |
| Workshop Leads | `pages/workshop/Requests.jsx` | `getWorkshopLeads()` |
| Admin Dashboard | `pages/admin/Overview.jsx` | `getAdminDashboard()` |
| Admin Users | `pages/admin/Users.jsx` | `getUsers()` |
| Admin Workshops | `pages/admin/Workshops.jsx` | `getAdminWorkshops()` |

---

## 🎨 Styles (Warm Wood Theme)

Located in `/styles/`:

```css
/* variables.css - CSS Custom Properties */
:root {
  --color-primary: #8B5A2B;      /* Warm brown */
  --color-secondary: #D4A574;    /* Light wood */
  --color-background: #FDF8F3;   /* Cream */
  --color-text: #3D2914;         /* Dark brown */
  --color-accent: #C4956A;       /* Golden */
}
```

---

## 🔌 API Services

Each file in `/api/` handles one domain:

### auth.js
```javascript
login({ email, password })      // Returns { token, user }
register({ name, email, password, role })
getMe(token)                    // Returns current user
```

### designs.js
```javascript
getDesigns({ category, page })  // Public listing
getDesign(id)                   // Single design
createDesign(token, formData)   // Workshop creates
updateDesign(token, id, data)   // Workshop updates
deleteDesign(token, id)         // Soft delete
```

### leads.js
```javascript
submitLead(formData)            // Public submission
getWorkshopLeads(token)         // Workshop's leads
submitOffer(token, id, offer)   // Workshop responds
```

---

## 🔐 Authentication Flow

```
1. User logs in → receives JWT token
2. Token stored in localStorage
3. AuthContext provides user state
4. ProtectedRoute checks auth before rendering
5. API calls include: Authorization: Bearer <token>
```

---

## ⚙️ Where to Modify

| To Change... | Edit File |
|--------------|-----------|
| Add new page | Create in `/pages/`, add route in `App.jsx` |
| Add API call | Add function in `/api/`, export from `index.js` |
| Change colors | Edit `/styles/variables.css` |
| Add component | Create in `/components/` |
| Change auth logic | Edit `/context/AuthContext.jsx` |
