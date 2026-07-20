import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export interface GoogleProfile {
  email: string
  fullName: string
  avatar?: string
}

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleProfile> {
  const audience = process.env.GOOGLE_CLIENT_ID
  if (!audience) {
    throw new Error('GOOGLE_CLIENT_ID is not configured')
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience,
  })

  const payload = ticket.getPayload()
  if (!payload?.email || !payload.email_verified) {
    throw new Error('Invalid or unverified Google account')
  }

  return {
    email: payload.email.toLowerCase(),
    fullName: payload.name?.trim() || payload.email.split('@')[0] || 'User',
    avatar: payload.picture,
  }
}
