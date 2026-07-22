import type { NextFunction, Response } from 'express'
import { verifyToken } from '../lib/auth.js'
import type { AuthedRequest } from '../types/express.js'

export type { AuthedRequest } from '../types/express.js'

export function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice(7))
    } catch {
      // Allow guest requests when token is missing or invalid.
    }
  }
  next()
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    req.user = verifyToken(header.slice(7))
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    req.user = verifyToken(header.slice(7))
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
