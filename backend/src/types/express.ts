import type { Request } from 'express'
import type { ParsedQs } from 'qs'
import type { AuthTokenPayload } from '../lib/auth.js'

/** Route params with a single `:id` segment (string, not string[]). */
export type IdParams = { id: string }

/** Route params with a single `:carId` segment. */
export type CarIdParams = { carId: string }

/**
 * Authenticated request with typed route params.
 * Use `AuthedRequest<IdParams>` for `/:id` routes, etc.
 */
export interface AuthedRequest<
  P extends Record<string, string> = Record<string, string>,
  ResBody = unknown,
  ReqBody = Record<string, unknown>,
  ReqQuery extends ParsedQs = ParsedQs,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: AuthTokenPayload
}
