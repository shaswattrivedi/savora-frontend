# Savora – Where every recipe tells a story

Savora is a full-stack, responsive recipe sharing platform built with the mandated MERN syllabus stack:

- **Frontend:** React, modern HTML5, CSS3 (no UI frameworks, pure gradients)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB via Mongoose
- **Auth:** JWT with HTTP-only tokens and bcrypt password hashing

The application lets passionate cooks create, share, and discover recipes across world cuisines while maintaining a clean, food-inspired aesthetic.

## ✨ Feature Highlights

- Secure JWT authentication with profile management
- Create, edit, delete, and browse recipes with cuisine & diet filters
- Interactive search with pagination-ready results
- Bookmark (favorites) system and community-powered ratings + reviews
- Trending carousel, featured collections, and top contributors board
- Live recipe search sourcing data from TheMealDB via the backend proxy
- Admin tooling to moderate recipes and manage user accounts
- About & Contact pages with contact form validation
- Toast notifications, modals, and accessible color-contrast adherence
- Responsive CSS Grid/Flexbox layouts for phones, tablets, and desktops

## 🎨 Design System Cheat Sheet

| Element | Choice |
| --- | --- |
| **Primary Gradient** | `linear-gradient(135deg, #ff6f61, #ffb347)` |
| **Secondary Gradient** | `linear-gradient(135deg, #6a82fb, #fc5c7d)` |
| **Accent Gradient** | `linear-gradient(135deg, #2af598, #009efd)` |
| **Surface Colors** | `#fff7f0`, `#fefefe`, `#f7fafc` |
| **Typography** | Headings: `"Poppins", sans-serif` · Body: `"Lora", serif` |
| **Shadows** | `0 18px 35px rgba(255, 111, 97, 0.15)` |
| **Border Radius** | 18px on cards, 30px on hero panels |

The fonts are loaded via Google Fonts in the root HTML template.

## 🗂️ Project Structure

```
savora/
├── client/          # React SPA (frontend)
│   ├── public/
│   └── src/
├── server/          # Express API (backend)
├── README.md
└── package.json
```

See in-code comments for deeper explanations of each module.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB URI (Atlas or local), copied into `.env`

### 2. Install Dependencies

```bash
npm install --prefix server
npm install --prefix client
```

### 3. Environment Setup

Copy the template and fill in your secrets:

```bash
cp server/.env.example server/.env
```

Update `MONGO_URI`, `JWT_SECRET`, and optional seed data.

### Optional: seed curated homepage content

Populate the database with editorial recipes and homepage imagery:

```bash
npm run seed:home
```

### 4. Run the App (two terminals)

```bash
npm run server
```

```bash
npm run client
```

The frontend will launch on `http://localhost:5173` (Vite dev server), and the API on `http://localhost:5000`.

### 5. Production Builds

```bash
npm run client:build
npm run server:start
```

## 🔗 External Integrations

- The backend exposes `/api/external/recipes?search=<query>` and `/api/external/recipes/:id` which proxy and normalize data from [TheMealDB public API](https://www.themealdb.com/api.php), keeping API keys out of the browser while reusing Savora's design system on the frontend.

## 🧪 Testing & Quality

- API request/response validation ensures consistent error handling
- Frontend form validation covers empty fields, email format, password length
- Reusable toast notifications provide immediate feedback

Add your own Jest or Cypress suites on top of this scaffold as needed.

## 📄 License

This project is provided for academic use in the FLEXI mini project. Feel free to adapt it with attribution.
