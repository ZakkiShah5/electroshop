# ElectroShop

A full-stack e-commerce platform for consumer electronics built with Next.js 14 and Express.js.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)

---

## Features

- **Product catalog** — Browse phones, laptops, tablets & accessories with search, filters, and pagination
- **Product detail** — Image gallery, specifications, related products, stock tracking
- **Shopping cart** — Persistent across sessions via localStorage
- **Checkout** — Multi-step flow: Shipping → Stripe Payment → Confirmation
- **Stripe integration** — Real payments with `PaymentElement` + demo mode when keys aren't set
- **Authentication** — JWT-based login/register with persistent sessions
- **Order history** — View past orders with full details and delivery timeline
- **Admin dashboard** — Revenue chart, order management, product CRUD with image & spec support
- **Responsive design** — Mobile-first, works on all screen sizes

---

## Tech Stack

### Frontend (`electroshop-frontend/`)
| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS v3 |
| State | React Context (Auth + Cart) |
| HTTP | Axios with JWT interceptor |
| Payments | Stripe.js + React Stripe.js |
| Charts | Recharts |
| Toasts | react-hot-toast |

### Backend (`electroshop-backend/`)
| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ with ES Modules |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT + bcryptjs |
| Rate Limiting | express-rate-limit |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)
- npm or yarn

### 1. Clone the repo
```bash
git clone <repo-url>
cd ecommerce
```

### 2. Backend
```bash
cd electroshop-backend
cp .env.example .env    # fill in your values
npm install
npm run seed            # loads 12 products + 2 users
npm run dev             # starts on http://localhost:8000
```

**Backend `.env` variables:**
```env
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb://localhost:27017/electroshop
JWT_SECRET=your_jwt_secret_here
ALLOWED_ORIGINS=http://localhost:3040
```

### 3. Frontend
```bash
cd electroshop-frontend
cp .env.local.example .env.local    # fill in your values
npm install
npm run dev    # starts on http://localhost:3040
```

**Frontend `.env.local` variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # optional — demo mode if omitted
STRIPE_SECRET_KEY=sk_test_...                    # optional — demo mode if omitted
```

> **Stripe demo mode**: If you don't have Stripe keys, the checkout still works end-to-end. A mock payment form is shown and real orders are created in the database.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@electroshop.com | admin123 |
| User | user@electroshop.com | user123 |

---

## Deployment

### Frontend → Vercel

1. Push frontend to a GitHub repo
2. Import into [vercel.com](https://vercel.com)
3. Set these environment variables in Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

4. Deploy — `vercel.json` is already configured.

### Backend → Railway

1. Push backend to a GitHub repo
2. Create a new project on [railway.app](https://railway.app)
3. Add a MongoDB plugin or connect an Atlas URI
4. Set these environment variables:

```
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://...
JWT_SECRET=a_long_random_secret
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

5. Deploy — `railway.json` and `Procfile` are already configured.

---

## Project Structure

```
ecommerce/
├── electroshop-frontend/
│   ├── app/
│   │   ├── admin/          # Admin dashboard (layout + pages)
│   │   ├── auth/           # Login & register
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # 3-step checkout
│   │   ├── orders/         # Order history + detail
│   │   ├── products/       # Catalog + product detail
│   │   └── api/            # Next.js API routes (Stripe)
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, MobileMenu
│   │   ├── products/       # ProductCard, ProductGrid
│   │   ├── cart/           # CartItem, CartSummary
│   │   └── ui/             # Button, Badge, LoadingSpinner
│   ├── context/            # AuthContext, CartContext
│   └── lib/                # api.js (Axios), utils.js
│
└── electroshop-backend/
    ├── config/             # db.js
    ├── controllers/        # Product, user, order logic
    ├── middleware/         # auth, error handling
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    └── server.js           # Entry point
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | — | List products (search, filter, paginate) |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/users/login` | — | Login |
| POST | `/api/users/register` | — | Register |
| GET | `/api/users/profile` | User | Get profile |
| GET | `/api/users` | Admin | All users |
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/mine` | User | My orders |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/pay` | User | Mark paid |
| PUT | `/api/orders/:id/deliver` | Admin | Mark delivered |

---

## License

MIT
# electroshop
