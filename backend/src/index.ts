import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import path from 'path'
import authRoutes from './routes/auth.js'
import carsRoutes from './routes/cars.js'
import bookingsRoutes from './routes/bookings.js'
import usersRoutes from './routes/users.js'
import favoritesRoutes from './routes/favorites.js'
import adminRoutes from './routes/admin.js'
import uploadsRoutes from './routes/uploads.js'

const app = express()
const PORT = Number(process.env.PORT || 4000)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    env: process.env.ENV || process.env.NODE_ENV,
    db: process.env.MYSQL_DB,
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/cars', carsRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/uploads', uploadsRoutes)

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  },
)

app.listen(PORT, () => {
  console.log(`Jungle Carz API running on http://localhost:${PORT}`)
})
