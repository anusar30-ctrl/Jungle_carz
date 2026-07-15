import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

const uploadDir = path.join(process.cwd(), 'uploads', 'cars')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)
      ? ext
      : '.jpg'
    cb(null, `${randomUUID()}${safeExt}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

router.post(
  '/car-images',
  requireAdmin,
  (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message })
      }
      if (err) {
        return res.status(400).json({
          error: err instanceof Error ? err.message : 'Upload failed',
        })
      }
      next()
    })
  },
  (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined
    if (!files?.length) {
      return res.status(400).json({ error: 'No images uploaded' })
    }

    const urls = files.map((f) => `/uploads/cars/${f.filename}`)
    return res.status(201).json({ urls })
  },
)

export default router
