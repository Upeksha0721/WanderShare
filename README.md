# 🌍 WanderShare — Travel Experience Sharing Platform

> A full-stack microservices web application that enables travelers to discover, share, and manage authentic travel experiences worldwide.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Microservices](#microservices)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Admin Dashboard](#admin-dashboard)
- [Screenshots](#screenshots)
- [Scaling Strategy](#scaling-strategy)
- [Future Improvements](#future-improvements)

---

## 📖 Overview

WanderShare is a full-stack MERN application built with a **microservices architecture**. It allows users to register, create travel listings, like experiences shared by others, and explore destinations worldwide. An admin dashboard provides platform-wide management including user control, listing moderation, and real-time analytics.

This project demonstrates:
- Microservices design with an API Gateway pattern
- JWT-based authentication across services
- Role-based access control (User vs Admin)
- Responsive, modern UI with Next.js App Router
- RESTful API design with MongoDB Atlas

---

## ✨ Features

### 👤 User Features
- Register & login with JWT authentication
- Create, edit, and delete travel experience listings
- Like/unlike listings from other travelers
- Personal dashboard showing own listings and stats
- Search and explore all listings by title, location, or description
- Paginated listing feed

### 🛡️ Admin Features
- Separate secure admin login portal
- Dashboard with real-time analytics
- Total users, listings, most liked, and location stats
- New users chart (last 7 days)
- Listings by location breakdown
- User management: view, ban/unban, delete users
- Listing management: view and delete any listing

### 🎨 UI/UX
- Modern blue/purple/yellow gradient design system
- Animated hero section with parallax scrolling
- Fully responsive layout
- Landing page for guests; personalized dashboard for logged-in users
- About Us and Contact sections

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js Frontend               │
│           (localhost:3000)                  │
└──────────────────┬──────────────────────────┘
                   │ HTTP Requests
                   ▼
┌─────────────────────────────────────────────┐
│              API Gateway                    │
│           (localhost:5000)                  │
│  /api/auth     → Auth Service   (:5001)     │
│  /api/listings → Listing Service(:5002)     │
│  /api/admin    → Admin Service  (:5003)     │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
       ▼              ▼              ▼
┌──────────┐  ┌──────────────┐  ┌──────────────┐
│   Auth   │  │   Listing    │  │    Admin     │
│ Service  │  │   Service    │  │   Service    │
│ :5001    │  │   :5002      │  │   :5003      │
└────┬─────┘  └──────┬───────┘  └──────┬───────┘
     │               │                 │
     ▼               ▼                 ▼
┌──────────┐  ┌──────────────┐  ┌──────────────┐
│ MongoDB  │  │   MongoDB    │  │   MongoDB    │
│wandershare│ │ wandershare  │  │ wandershare  │
│  -auth   │  │  -listings   │  │   -admin     │
└──────────┘  └──────────────┘  └──────────────┘
```

### API Gateway Pattern
All client requests flow through the API Gateway (port 5000), which proxies them to the appropriate microservice. This provides a single entry point, enabling centralized CORS handling, rate limiting, and future load balancing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React, Tailwind CSS |
| **Backend** | Node.js, Express.js 4 |
| **Database** | MongoDB Atlas (M0 Free Tier) |
| **ODM** | Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcryptjs |
| **API Gateway** | http-proxy-middleware v2 |
| **HTTP Client** | Axios |
| **Notifications** | react-hot-toast |
| **Cookie Management** | js-cookie |
| **Icons** | lucide-react |
| **Dev Tools** | Nodemon |

---

## 🔧 Microservices

### 1. Auth Service (Port 5001)
Handles all user authentication and identity management.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | None |
| POST | `/api/auth/login` | Login, returns JWT | None |
| GET | `/api/auth/me` | Get current user | Bearer Token |

### 2. Listing Service (Port 5002)
Manages all travel listing CRUD operations.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/listings` | Get all listings (search + pagination) | None |
| GET | `/api/listings/:id` | Get single listing | None |
| POST | `/api/listings` | Create listing | Bearer Token |
| PUT | `/api/listings/:id` | Update listing (owner only) | Bearer Token |
| DELETE | `/api/listings/:id` | Delete listing (owner only) | Bearer Token |
| POST | `/api/listings/:id/like` | Toggle like | Bearer Token |

**Query Parameters for GET /api/listings:**
- `search` — full-text search on title, location, description
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)

### 3. Admin Service (Port 5003)
Provides admin-only management capabilities.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/admin/login` | Admin login | None |
| POST | `/api/admin/seed` | Create initial admin account | None |
| GET | `/api/admin/stats` | Dashboard analytics | Admin JWT |
| GET | `/api/admin/users` | List all users | Admin JWT |
| DELETE | `/api/admin/users/:id` | Delete user | Admin JWT |
| PATCH | `/api/admin/users/:id/ban` | Ban/unban user | Admin JWT |
| GET | `/api/admin/listings` | List all listings | Admin JWT |
| DELETE | `/api/admin/listings/:id` | Delete listing | Admin JWT |

### 4. API Gateway (Port 5000)
Routes incoming requests to appropriate services using `http-proxy-middleware`.

---

## 🗄️ Database Design

### wandershare-auth (MongoDB)

**Users Collection**
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (bcrypt hashed)",
  "isBanned": "Boolean (default: false)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### wandershare-listings (MongoDB)

**Listings Collection**
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "location": "String (required)",
  "imageUrl": "String (required)",
  "description": "String (required)",
  "price": "Number",
  "creatorId": "String (ref: User._id)",
  "creatorName": "String",
  "likes": ["String (User IDs)"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Indexes:** Text index on `title`, `location`, `description` for full-text search. Index on `createdAt` for sorting.

### wandershare-admin (MongoDB)

**Admins Collection**
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (bcrypt hashed)",
  "role": "String (default: 'admin')",
  "createdAt": "Date"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free M0 tier works)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Upeksha0721/WanderShare.git
cd WanderShare
git checkout develop
```

### 2. Install Dependencies

```bash
# Auth Service
cd services/auth-service && npm install

# Listing Service
cd ../listing-service && npm install

# Admin Service
cd ../admin-service && npm install

# API Gateway
cd ../gateway && npm install

# Frontend
cd ../../client && npm install
```

### 3. Configure Environment Variables

See [Environment Variables](#environment-variables) section below.

### 4. Start All Services

Open **5 separate terminals**:

```bash
# Terminal 1 — Auth Service
cd services/auth-service && npm run dev

# Terminal 2 — Listing Service
cd services/listing-service && npm run dev

# Terminal 3 — Admin Service
cd services/admin-service && npm run dev

# Terminal 4 — API Gateway
cd services/gateway && npm run dev

# Terminal 5 — Frontend
cd client && npm run dev
```

### 5. Seed Admin Account

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/seed" -Method POST

# or curl (Linux/Mac)
curl -X POST http://localhost:5000/api/admin/seed
```

### 6. Access the Application

| URL | Description |
|---|---|
| http://localhost:3000 | Main application |
| http://localhost:3000/admin/login | Admin portal |
| http://localhost:5000/health | Gateway health check |

---

## 🔐 Environment Variables

### services/auth-service/.env
```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/wandershare-auth?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

### services/listing-service/.env
```
PORT=5002
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/wandershare-listings?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

### services/admin-service/.env
```
PORT=5003
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/wandershare-admin?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@wandershare.com
ADMIN_PASSWORD=your_admin_password
```

### services/gateway/.env
```
PORT=5000
AUTH_SERVICE_URL=http://localhost:5001
LISTING_SERVICE_URL=http://localhost:5002
ADMIN_SERVICE_URL=http://localhost:5003
```

### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🛡️ Admin Dashboard

Access the admin panel at `/admin/login` with the seeded credentials.

**Features:**
- **Overview Stats:** Total users, listings, most liked count, unique locations
- **New Users Chart:** Bar chart showing registrations over last 7 days
- **Listings by Location:** Visual breakdown of listing distribution
- **Most Liked Listings:** Top 5 listings ranked by likes
- **User Management:** Search, ban/unban, or delete any user
- **Listing Management:** Search and delete any listing across the platform

**Security:**
- Admin JWT tokens are separate from user tokens
- Role verification middleware on all admin routes (`role: 'admin'`)
- Admin tokens stored in secure cookies (7-day expiry)

---

## 📈 Scaling Strategy

### Current Architecture Strengths
- **Microservices:** Each service can be scaled independently based on load
- **Stateless Auth:** JWT tokens mean no session storage needed — horizontally scalable
- **Database Separation:** Each service has its own database, preventing bottlenecks

### Production Scaling Plan

**Horizontal Scaling:**
```
Load Balancer (Nginx / AWS ALB)
        │
   ┌────┴────┐
   ▼         ▼
Gateway-1  Gateway-2
   │
   ├── Auth Service  × 3 instances
   ├── Listing Service × 5 instances (highest traffic)
   └── Admin Service × 1 instance
```

**Database Scaling:**
- MongoDB Atlas auto-scaling with replica sets
- Read replicas for listing queries (read-heavy workload)
- Index optimization: text indexes on listing fields, compound indexes on createdAt + creatorId

**Caching Strategy:**
- Redis cache for listing feed (TTL: 5 minutes)
- Cache invalidation on create/update/delete
- CDN (Cloudflare) for static assets and images

**Performance Optimizations:**
- Image optimization via Next.js Image component
- Pagination on all list endpoints
- Database connection pooling via Mongoose

**Monitoring:**
- Centralized logging with Winston + ELK Stack
- Health check endpoints on all services
- Prometheus + Grafana for metrics

---

## 🔮 Future Improvements

- [ ] Docker + Docker Compose for containerization
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Image upload with AWS S3 / Cloudinary (instead of URL input)
- [ ] Real-time notifications with Socket.io
- [ ] Email verification on registration
- [ ] Google OAuth login
- [ ] Review and rating system for listings
- [ ] Map integration (Google Maps / Leaflet)
- [ ] Mobile app with React Native
- [ ] Rate limiting on API Gateway
- [ ] Kubernetes deployment manifests

---

## 👩‍💻 Author

**Upeksha** — Full Stack Developer  
Built as part of a Full Stack Software Engineer technical assessment.

---

## 📄 License

MIT License — feel free to use this project as a reference.
