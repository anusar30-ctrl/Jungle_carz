/** Super admin account — created once in MySQL by `npm run db:seed`. */
export const SUPER_ADMIN_EMAIL = 'superadmin@junglecarz.com'

/** Used only when the account does not exist yet in the database. */
export const SUPER_ADMIN_INITIAL = {
  email: SUPER_ADMIN_EMAIL,
  password: 'JungleSuperAdmin@2026',
  fullName: 'Super Admin',
  mobile: '9999999999',
} as const

export function isSuperAdminEmail(email: string): boolean {
  return email.toLowerCase() === SUPER_ADMIN_EMAIL
}
