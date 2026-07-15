# Jungle Carz API

Node.js + Express + Prisma + MySQL

## Setup

1. Create DB in MySQL Workbench:

```sql
CREATE DATABASE jungle_carz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy env:

```bash
cp .env.example .env
```

3. Fill MySQL credentials in `.env`

4. Install & push schema:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

API: `http://localhost:4000`

## Super admin (stored in MySQL)

Run `npm run db:seed` once — it creates the admin account **in the database** (no `.env` login needed):

| Email | Password |
|-------|----------|
| `superadmin@junglecarz.com` | `JungleSuperAdmin@2026` |

After that, just log in at `/login` — credentials are read from MySQL like any user.

## Endpoints

- `GET /api/health`
- `POST /api/auth/register` `POST /api/auth/login` `GET /api/auth/me`
- `GET /api/cars` `GET /api/cars/:id`
- `POST/PUT/DELETE /api/cars` (admin)
- `GET /api/bookings/mine` `POST /api/bookings`
- `GET /api/bookings` (admin)
- `GET /api/users` (admin)
- `GET /api/favorites`
- `GET /api/admin/stats`
- `POST /api/uploads/car-images` (admin, multipart — car photos)
