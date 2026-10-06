# SwiftShip — Courier Company Website + Parcel Tracking CMS

A full MERN-stack courier & logistics platform: a customer-facing website (service browsing, shipment booking, real-time tracking, account/history) and an admin CMS (dashboard, shipment CRUD, tracking updates, service management, content/banner management, user management).

Built with **MongoDB, Express.js, React.js (Vite), Node.js**, JWT authentication, and Tailwind CSS, matching the SwiftShip brand palette and UI/UX references.

---

## 1. Project Structure

```
swiftship/
├── server/            # Express + MongoDB REST API
│   ├── config/        # DB connection
│   ├── controllers/   # Route handlers
│   ├── middleware/    # auth, error handling, upload
│   ├── models/        # Mongoose schemas (User, Shipment, TrackingUpdate, Service, Gallery)
│   ├── routes/        # Express routers
│   ├── utils/         # token/tracking-number helpers + seed script
│   └── server.js
├── client/            # React (Vite) + Tailwind frontend
│   └── src/
│       ├── api/           # axios instance
│       ├── context/       # Auth context
│       ├── components/    # Navbar, Footer, reusable UI, admin layout/widgets
│       ├── pages/          # customer pages
│       └── pages/admin/    # admin CMS pages
└── package.json       # root convenience scripts
```

## 2. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string
- npm

## 3. Setup

```bash
# 1. Install dependencies for both server and client
npm run install:all

# 2. Configure environment variables
cp server/.env.example server/.env
# edit server/.env if needed (Mongo URI, JWT secret, etc.)

# 3. Seed the database with demo data (admin + customer accounts, services, shipments)
npm run seed

# 4. Run both server (port 5000) and client (port 5173) together
npm run dev
```

Then open **http://localhost:5173** in your browser.

<!-- ### Demo accounts (created by the seed script)

| Role     | Email                  | Password     |
|----------|-------------------------|--------------|
| Admin    | admin@swiftship.com     | Admin@123    |
| Customer | varun@example.com       | Customer@123 | -->

<!-- Admin portal: **http://localhost:5173/admin/login** -->

## 4. Running server & client separately

```bash
# Terminal 1
npm run server   # nodemon server on http://localhost:5000

# Terminal 2
npm run client   # Vite dev server on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` requests to `http://localhost:5000`, so no CORS configuration is needed in development.

## 5. Building for production

```bash
npm run build          # builds the client into client/dist
cd server && npm start # run the API in production mode
```

Serve `client/dist` via any static host (Netlify, Vercel, Nginx, or Express's own `express.static`) and point it at your deployed API URL.

## 6. Features

**Customer website**
- Homepage with services, tracking search, highlights, testimonials
- Services listing + service detail pages
- Multi-step shipment request form (details → sender/receiver → review → confirmation)
- Public shipment tracking by tracking number, with full status timeline
- Registration, login, shipment history and shipment detail pages

**Admin portal / CMS**
- Dashboard with live stats, 7-day shipment trend chart, status distribution donut chart, recent shipments and quick actions
- Shipment CRUD with search, status filter and pagination
- Tracking update tool (adds a tracking event and syncs the shipment's current status)
- Service management (add/edit/delete/activate-deactivate)
- Content & Gallery manager for banners/images (file upload)
- User management (view, activate/deactivate)

**Security**
- Passwords hashed with bcrypt
- JWT-based authentication, role-based authorization (`customer` / `admin`) on all protected routes
- Backend validation on required fields, graceful 404/500 handling for invalid IDs and missing resources

## 7. REST API Overview

| Method | Endpoint                              | Access        |
|--------|-----------------------------------------|---------------|
| POST   | /api/auth/register                     | Public        |
| POST   | /api/auth/login                        | Public        |
| GET    | /api/auth/me                           | Private       |
| GET    | /api/shipments                         | Private       |
| GET    | /api/shipments/:id                     | Private       |
| POST   | /api/shipments                         | Private       |
| PUT    | /api/shipments/:id                     | Admin         |
| DELETE | /api/shipments/:id                     | Admin         |
| PATCH  | /api/shipments/:id/status              | Admin         |
| GET    | /api/tracking/:trackingNumber          | Public        |
| POST   | /api/shipments/:id/tracking            | Admin         |
| GET    | /api/services                          | Public        |
| POST   | /api/services                          | Admin         |
| PUT    | /api/services/:id                      | Admin         |
| DELETE | /api/services/:id                      | Admin         |
| GET    | /api/gallery                           | Public        |
| POST   | /api/gallery                           | Admin         |
| DELETE | /api/gallery/:id                       | Admin         |
| GET    | /api/dashboard                         | Admin         |
| GET    | /api/users                             | Admin         |

## 8. Theme

Primary palette: navy `#0B2A6F`, blue `#1649B8`, orange `#FF6B00`, white `#FFFFFF`, plus supporting off-white/light-blue backgrounds and status colors — configured in `client/tailwind.config.js` and used consistently across every page and component.

## 9. Notes

- Never commit `server/.env` or real secrets to version control.
- Change `JWT_SECRET` before deploying to production.
- The `server/uploads` folder stores admin-uploaded banner/gallery images locally; swap in cloud storage (S3, Cloudinary, etc.) for production deployments if needed.
