# Savora – Where every recipe tells a story

Savora is now a **100% frontend** React experience you can run locally with zero Docker, MongoDB, or backend services. The entire application is powered by a browser-based mock API that persists data in `localStorage`, so you still get authentication, favourites, reviews, and admin tooling without leaving the comfort of the client.

## ✨ Frontend Highlights

- React 18 + Vite, modern HTML5 + vanilla CSS3 gradients (no component libraries)
- Local mock API with persistent data, seeded with curated recipes and users
- Auth, bookmarks, reviews, and admin dashboards simulated entirely in-browser
- Intelligent recipe filters (search, cuisine, diet, category, sorting) with pagination
- Hero carousel, featured collections, quick picks, community guides, and contributors spotlight
- External inspiration feed backed by bundled Figma-style “imported” recipes
- Fully responsive layouts built with CSS Grid/Flexbox and glassmorphism accents

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
├── README.md
└── package.json
```

See in-code comments for deeper explanations of each module. The legacy Express backend has been removed from the toolchain; only the `client/` app is required to run Savora.

## 🚀 Getting Started (frontend only)

### 1. Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A modern browser (Chrome, Edge, Firefox, or Safari)

### 2. Install dependencies

```bash
npm install --prefix client
```

### 3. Run the development server

```bash
npm run dev
```

Visit **http://localhost:5173** to explore Savora. All data is persisted in your browser’s `localStorage`, so it survives page refreshes without any external services.

### 4. Build the production bundle

```bash
npm run build
npm run preview
```

The preview server also runs at `http://localhost:5173`.

## 🧪 Mock Accounts & Data

The mock API seeds Savora with realistic content and example users. You can log in with these credentials or create new accounts via **Register**:

| Role  | Email               | Password  |
|-------|--------------------|-----------|
| Admin | `ayesha@savora.dev` | `tastebud` |
| User  | `mateo@savora.dev`  | `savora123` |

All passwords are stored locally and never leave your browser. Sign out to switch between accounts, or register your own profile for testing.

### Resetting the mock database

Everything is stored under the key `savora_mock_db_v2`. To reset the app back to its initial state, open your browser devtools and run:

```js
localStorage.removeItem("savora_mock_db_v2");
```

Refreshing the page will reseed the demo data.

## 🔗 External Integrations

- External recipes are now bundled with the frontend mock data—no network calls required—while staying faithful to the original Figma handoff.

## 🧪 Testing & Quality

- Frontend form validation covers empty fields, email format, password length
- Reusable toast notifications provide immediate feedback
- Local mock API mirrors server responses so you can still exercise flows end-to-end

Add your own Jest or Cypress suites on top of this scaffold as needed.

## 📄 License

This project is provided for academic use in the FLEXI mini project. Feel free to adapt it with attribution.
