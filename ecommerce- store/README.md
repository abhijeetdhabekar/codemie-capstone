# STOREFRONT — MERN E-Commerce Store

Capstone project: MERN Stack Development Internship — Week 4.
Full-stack e-commerce store with authentication, product catalog, cart, checkout, order history, and an admin panel — built on the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication** — JWT-based register/login, protected routes, password hashing (bcrypt)
- **Product Listing** — paginated grid, search, category filter, sorting
- **Product Details** — image, description, stock status, ratings, customer reviews
- **Product Search** — keyword search across name/description/category
- **Shopping Cart** — persisted in localStorage, quantity control
- **Checkout Page** — shipping address form, payment method, live order summary (tax + shipping)
- **Order History** — per-user order list + detailed order view
- **Admin Product Management** — create/edit/delete products via modal form
- **Admin Order Management** — view all orders, update status/payment
- **MongoDB Integration** — Mongoose models for User, Product, Order
- **Responsive React UI** — mobile-friendly brutalist design system (custom CSS, no framework)

## Tech Stack

| Layer      | Tech                                                  |
|------------|--------------------------------------------------------|
| Frontend   | React 18, Vite, React Router 6, Axios, Context API     |
| Backend    | Node.js, Express 4, JWT, bcryptjs                       |
| Database   | MongoDB + Mongoose                                      |
| Other      | express-async-handler, express-rate-limit, morgan, cors |

## Project Structure

```
ecommerce/
├── server/                 # Express + MongoDB API
│   ├── config/              # DB connection, JWT helper, seed script
│   ├── controllers/         # Route logic (auth, product, order)
│   ├── middleware/          # Auth guard, error handler
│   ├── models/               # Mongoose schemas
│   ├── routes/                # Express routers
│   ├── server.js               # App entry point
│   ├── package.json
│   └── .env.example
└── client/                  # React (Vite) frontend
    ├── src/
    │   ├── api/               # Axios instance
    │   ├── components/        # Header, Footer, ProductCard, guards...
    │   ├── context/           # AuthContext, CartContext
    │   ├── pages/              # Home, Product, Cart, Checkout, Orders, Admin...
    │   ├── styles/              # Global brutalist CSS
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string (free MongoDB Atlas cluster works — [mongodb.com/atlas](https://www.mongodb.com/atlas))

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and set your real values:

```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any long random string>
```

Seed the database with sample products + demo accounts (recommended for first run):

```bash
npm run seed
```

This creates:
- **Admin** — `admin@example.com` / `Admin@12345`
- **Customer** — `customer@example.com` / `Customer@123`
- 12 sample products across multiple categories

Start the API server:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

API runs at **http://localhost:5000** — health check at `GET /api/health`.

### 2. Frontend Setup

Open a **second terminal**:

```bash
cd client
npm install
cp .env.example .env
```

The default `.env` already points to `http://localhost:5000/api` — change `VITE_API_URL` only if your backend runs elsewhere.

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**.

### 3. Try it out

1. Visit `http://localhost:5173`
2. Log in as admin (`admin@example.com` / `Admin@12345`) → go to **Admin** in the nav → manage products/orders
3. Log in or register as a customer → browse products → add to cart → checkout → view order in **Orders**

## Environment Variables

**server/.env**

| Variable        | Description                              |
|-----------------|--------------------------------------------|
| `PORT`          | API port (default 5000)                    |
| `NODE_ENV`      | `development` or `production`               |
| `MONGO_URI`     | MongoDB connection string                    |
| `JWT_SECRET`    | Secret used to sign JWTs                     |
| `JWT_EXPIRE`    | Token expiry, e.g. `7d`                      |
| `CLIENT_URL`    | Frontend origin, for CORS                     |
| `ADMIN_EMAIL`   | Admin email created by the seed script         |
| `ADMIN_PASSWORD`| Admin password created by the seed script       |

**client/.env**

| Variable        | Description                    |
|-----------------|----------------------------------|
| `VITE_API_URL`  | Base URL of the backend API       |

## Production Build

```bash
cd client
npm run build          # outputs client/dist
```

With `NODE_ENV=production` set on the server, `server.js` automatically serves the built frontend from `client/dist`, so you can deploy both from a single Node process if you prefer a single-service deployment. Otherwise, deploy the API (Render/Railway/Fly.io) and the client (Vercel/Netlify) separately and point `VITE_API_URL` at the deployed API URL.

## API Overview

| Method | Endpoint                     | Access        | Description               |
|--------|-------------------------------|---------------|----------------------------|
| POST   | `/api/auth/register`          | Public        | Register a new user        |
| POST   | `/api/auth/login`              | Public        | Login, returns JWT          |
| GET    | `/api/auth/profile`            | Private       | Get logged-in user           |
| PUT    | `/api/auth/profile`             | Private       | Update profile                |
| GET    | `/api/products`                  | Public        | List products (search/filter/paginate) |
| GET    | `/api/products/:id`               | Public        | Product details                 |
| GET    | `/api/products/categories`         | Public        | Distinct categories               |
| POST   | `/api/products`                     | Admin         | Create product                     |
| PUT    | `/api/products/:id`                  | Admin         | Update product                      |
| DELETE | `/api/products/:id`                   | Admin         | Delete product                       |
| POST   | `/api/products/:id/reviews`            | Private       | Add product review                    |
| POST   | `/api/orders`                           | Private       | Place an order (checkout)              |
| GET    | `/api/orders/my`                         | Private       | Logged-in user's orders                 |
| GET    | `/api/orders/:id`                         | Private       | Single order (owner or admin)            |
| GET    | `/api/orders`                              | Admin         | All orders                                |
| PUT    | `/api/orders/:id/status`                    | Admin         | Update order status/payment                |

## Notes

- Stock is validated and decremented server-side on order creation — client-supplied prices/totals are never trusted.
- Passwords are hashed with bcrypt; JWTs are issued on login/register and sent as `Bearer` tokens.
- The cart persists in `localStorage`, independent of login state, and merges naturally once the user logs in for checkout.
