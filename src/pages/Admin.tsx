import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Car,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Users,
  X,
  MapPin,
} from 'lucide-react'
import { fetchAdminDashboard, type AdminStats } from '../api/admin'
import { deleteUser, fetchAllUsers, updateUserRole } from '../api/users'
import { useAuth } from '../context/AuthContext'
import {
  addCar,
  deleteCar,
  fetchAllCars,
  updateCar,
  type CarFormInput,
} from '../utils/carsStorage'
import {
  deleteBooking,
  fetchAllBookings,
  updateBookingStatus,
} from '../utils/bookingStorage'
import type { CarListing, FuelType, Transmission, VehicleType } from '../types/search'
import type { BookingRequest, BookingStatus } from '../types/booking'
import type { AdminUserView, UserRole } from '../types/auth'
import { formatCurrency } from '../hooks/useCarFilters'
import { CarImageUpload } from '../components/admin/CarImageUpload'
import {
  LocationPickerModal,
  type SelectedLocation,
} from '../components/luxury/LocationPickerModal'
import { LUXURY_LOCATIONS } from '../constants/luxury'

type Tab = 'overview' | 'cars' | 'bookings' | 'users'

const emptyCarForm: CarFormInput = {
  brand: '',
  model: '',
  name: '',
  vehicleType: 'suv',
  category: 'regular',
  year: new Date().getFullYear(),
  transmission: 'automatic',
  fuel: 'petrol',
  seats: 5,
  mileage: '15 km/l',
  pricePerDay: 2500,
  originalPrice: 3000,
  pricePerKm: 52,
  excessKmRate: 7,
  securityDeposit: 5000,
  images: [],
  featureChips: ['FastTag Included', 'ABS', 'Airbags'],
  amenities: { ac: true, bluetooth: true, gps: true },
  badges: ['available'],
  tag: '',
  cancellationPolicy: 'Free cancellation up to 24 hrs',
  unlimitedKm: true,
  instantBooking: true,
  freeCancellation: true,
  airConditioning: true,
  bluetoothFeature: true,
  sunroof: false,
  locationCity: '',
  locationName: '',
  locationAddress: '',
  latitude: undefined,
  longitude: undefined,
}

export function Admin() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [cars, setCars] = useState<CarListing[]>([])
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [users, setUsers] = useState<AdminUserView[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentSignups, setRecentSignups] = useState<AdminUserView[]>([])
  const [recentBookings, setRecentBookings] = useState<
    Array<{
      id: string
      reference: string
      carName: string
      isGuest: boolean
      customerName: string
      customerEmail: string
      customerMobile: string
      accountEmail?: string
      total: number
      status: BookingStatus
      createdAt: string
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [showCarForm, setShowCarForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CarFormInput>(emptyCarForm)
  const [carQuery, setCarQuery] = useState('')
  const [saveError, setSaveError] = useState('')
  const [savingCar, setSavingCar] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [carsData, bookingsData, usersData, dashboardData] = await Promise.all([
        fetchAllCars(),
        fetchAllBookings(),
        fetchAllUsers(),
        fetchAdminDashboard(),
      ])
      setCars(carsData)
      setBookings(bookingsData)
      setUsers(usersData)
      setStats(dashboardData.stats)
      setRecentSignups(dashboardData.recentSignups)
      setRecentBookings(dashboardData.recentBookings)
    } catch {
      // Keep partial state on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const overviewStats = useMemo(
    () =>
      stats ?? {
        cars: cars.length,
        tourism: cars.filter((c) => c.category === 'tourism').length,
        bookings: bookings.length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        users: users.length,
        admins: users.filter((u) => u.role === 'admin').length,
        newUsers7d: users.filter(
          (u) => Date.now() - new Date(u.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
        ).length,
        guestBookings: bookings.filter((b) => b.isGuest).length,
        revenue: bookings
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + b.total, 0),
      },
    [stats, cars, bookings, users],
  )

  const filteredCars = useMemo(() => {
    const q = carQuery.trim().toLowerCase()
    if (!q) return cars
    return cars.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q),
    )
  }, [cars, carQuery])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyCarForm)
    setSaveError('')
    setShowCarForm(true)
  }

  const openEdit = (car: CarListing) => {
    setEditingId(car.id)
    setSaveError('')
    setForm({
      brand: car.brand,
      model: car.model,
      name: car.name,
      vehicleType: car.vehicleType,
      category: car.category ?? 'regular',
      year: car.year ?? new Date().getFullYear(),
      transmission: car.transmission,
      fuel: car.fuel,
      seats: car.seats,
      mileage: car.mileage,
      pricePerDay: car.pricePerDay,
      originalPrice: car.originalPrice,
      pricePerKm: car.pricePerKm,
      excessKmRate: car.excessKmRate,
      securityDeposit: car.securityDeposit,
      images: car.images,
      featureChips: car.featureChips,
      amenities: car.amenities,
      badges: car.badges,
      discountPercent: car.discountPercent,
      tag: car.tag ?? '',
      cancellationPolicy: car.cancellationPolicy,
      unlimitedKm: car.unlimitedKm,
      instantBooking: car.instantBooking,
      freeCancellation: car.freeCancellation,
      airConditioning: car.airConditioning,
      bluetoothFeature: car.bluetoothFeature,
      sunroof: car.sunroof,
      rating: car.rating,
      reviews: car.reviews,
      popularity: car.popularity,
      locationCity: car.locationCity ?? '',
      locationName: car.locationName ?? '',
      locationAddress: car.locationAddress ?? '',
      latitude: car.latitude,
      longitude: car.longitude,
    })
    setShowCarForm(true)
  }

  const saveCar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError('')

    if (!form.brand.trim()) {
      setSaveError('Please enter the car brand.')
      return
    }
    if (!form.model.trim()) {
      setSaveError('Please enter the car model.')
      return
    }

    const filteredImages = form.images.filter(Boolean)
    if (filteredImages.length === 0) {
      setSaveError('Please upload at least one car image.')
      return
    }

    if (!form.locationCity) {
      setSaveError('Please select the city where this car is located.')
      return
    }
    if (
      !form.locationName ||
      !form.locationAddress ||
      form.latitude == null ||
      form.longitude == null
    ) {
      setSaveError('Please pick a pickup location using the location button.')
      return
    }

    if (!form.pricePerDay || form.pricePerDay <= 0) {
      setSaveError('Price per day must be greater than 0.')
      return
    }
    if (!form.originalPrice || form.originalPrice <= 0) {
      setSaveError('Original price must be greater than 0.')
      return
    }

    const payload: CarFormInput = {
      ...form,
      brand: form.brand.trim(),
      model: form.model.trim(),
      name: form.name.trim() || `${form.brand.trim()} ${form.model.trim()}`,
      tag: form.tag?.trim() || undefined,
      images: filteredImages,
      featureChips: form.featureChips.filter(Boolean),
    }

    setSavingCar(true)
    try {
      if (editingId) await updateCar(editingId, payload)
      else await addCar(payload)
      setShowCarForm(false)
      setSaveError('')
      await refresh()
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Could not save car. Try again.'
      )
    } finally {
      setSavingCar(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Car }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cars', label: 'Cars', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 bg-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-secondary uppercase">
              Jungle Carz
            </p>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/70 sm:inline">
              {user?.fullName}
            </span>
            <Link
              to="/"
              className="rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Site
            </Link>
            <button
              type="button"
              onClick={() => {
                logout()
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'border border-gray-200 bg-white text-dark hover:border-primary/30'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {loading && tab === 'overview' && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {tab === 'overview' && !loading && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Cars" value={String(overviewStats.cars)} sub={`${overviewStats.tourism} tourism`} />
              <StatCard label="Bookings" value={String(overviewStats.bookings)} sub={`${overviewStats.pending} pending`} />
              <StatCard label="Users" value={String(overviewStats.users)} sub={`${overviewStats.newUsers7d} new this week`} />
              <StatCard
                label="Confirmed Revenue"
                value={formatCurrency(overviewStats.revenue)}
                sub={`${overviewStats.guestBookings ?? 0} guest bookings`}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-soft">
                <h2 className="mb-4 text-lg font-bold text-dark">New signups (last 7 days)</h2>
                {recentSignups.length === 0 ? (
                  <p className="text-sm text-muted">No new accounts this week.</p>
                ) : (
                  <div className="space-y-3">
                    {recentSignups.map((u) => (
                      <div key={u.id} className="rounded-2xl border border-gray-100 px-4 py-3">
                        <p className="font-semibold text-dark">{u.fullName}</p>
                        <p className="text-sm text-muted">{u.email}</p>
                        <p className="text-sm text-muted">
                          {u.mobile || 'No mobile'} · {u.provider} ·{' '}
                          {new Date(u.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-soft">
                <h2 className="mb-4 text-lg font-bold text-dark">Recent bookings</h2>
                {recentBookings.length === 0 ? (
                  <p className="text-sm text-muted">No bookings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map((b) => (
                      <div key={b.id} className="rounded-2xl border border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-dark">{b.carName}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              b.isGuest
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {b.isGuest ? 'Guest' : 'Account'}
                          </span>
                        </div>
                        <p className="text-sm text-muted">
                          {b.customerName} · {b.customerEmail} · {b.customerMobile}
                        </p>
                        <p className="text-sm text-muted">
                          {b.reference} · {formatCurrency(b.total)} ·{' '}
                          {new Date(b.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {tab === 'cars' && (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                value={carQuery}
                onChange={(e) => setCarQuery(e.target.value)}
                placeholder="Search cars..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm sm:max-w-xs"
              />
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add car
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-soft">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-muted">
                    <tr>
                      <th className="px-4 py-3">Car</th>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price/day</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.slice(0, 100).map((car) => (
                      <tr key={car.id} className="border-b border-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.images[0]}
                              alt=""
                              className="h-12 w-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-dark">{car.name}</p>
                              <p className="text-xs text-muted">{car.brand}</p>
                              {car.locationName && (
                                <p className="mt-0.5 text-xs text-muted">
                                  {car.locationName}
                                  {car.locationCity ? `, ${car.locationCity}` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{car.year ?? '—'}</td>
                        <td className="px-4 py-3 capitalize">{car.vehicleType}</td>
                        <td className="px-4 py-3 capitalize">
                          {car.category ?? 'regular'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">
                          {formatCurrency(car.pricePerDay)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(car)}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:border-primary/30"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Delete ${car.name}?`)) {
                                  await deleteCar(car.id)
                                  await refresh()
                                }
                              }}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCars.length > 100 && (
                <p className="border-t border-gray-100 px-4 py-3 text-xs text-muted">
                  Showing first 100 of {filteredCars.length} cars. Use search to find more.
                </p>
              )}
            </div>
          </section>
        )}

        {tab === 'bookings' && (
          <BookingsPanel
            bookings={bookings}
            loading={loading}
            onStatus={async (id, status) => {
              await updateBookingStatus(id, status)
              await refresh()
            }}
            onDelete={async (id) => {
              if (confirm('Delete this booking?')) {
                await deleteBooking(id)
                await refresh()
              }
            }}
          />
        )}

        {tab === 'users' && (
          <UsersPanel
            users={users}
            loading={loading}
            currentUserId={user?.id}
            onRole={async (id, role) => {
              await updateUserRole(id, role)
              await refresh()
            }}
            onDelete={async (id) => {
              if (confirm('Delete this user account?')) {
                await deleteUser(id)
                await refresh()
              }
            }}
          />
        )}
      </div>

      {showCarForm && (
        <CarFormModal
          title={editingId ? 'Edit car' : 'Add car'}
          form={form}
          setForm={setForm}
          onClose={() => {
            setShowCarForm(false)
            setSaveError('')
          }}
          onSubmit={saveCar}
          saveError={saveError}
          saving={savingCar}
        />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-soft">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-dark">{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  )
}

function BookingsPanel({
  bookings,
  loading,
  onStatus,
  onDelete,
}: {
  bookings: BookingRequest[]
  loading?: boolean
  onStatus: (id: string, status: BookingStatus) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}) {
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="rounded-[24px] border border-gray-100 bg-white p-10 text-center shadow-soft">
        <p className="font-semibold text-dark">No bookings yet</p>
        <p className="mt-1 text-sm text-muted">New booking requests will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((b) => (
        <article
          key={b.id}
          className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-soft"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-muted">{b.reference}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    b.isGuest
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {b.isGuest ? 'Guest booking' : 'Account booking'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-dark">{b.carName}</h3>
              <p className="text-sm text-muted">
                {b.customer.fullName} · {b.customer.email} · {b.customer.mobile}
              </p>
              {!b.isGuest && b.accountEmail && (
                <p className="text-xs text-muted">
                  Account: {b.accountName || b.accountEmail} ({b.accountEmail})
                </p>
              )}
              <p className="mt-1 text-sm text-muted">
                {b.pickupCity} → {b.dropCity} · {b.pickupDate} to {b.dropDate} ·{' '}
                {b.days} days
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {formatCurrency(b.total)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={b.status}
                onChange={(e) =>
                  onStatus(b.id, e.target.value as BookingStatus)
                }
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold capitalize"
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
                <option value="completed">completed</option>
              </select>
              <button
                type="button"
                onClick={() => onDelete(b.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function UsersPanel({
  users,
  loading,
  currentUserId,
  onRole,
  onDelete,
}: {
  users: AdminUserView[]
  loading?: boolean
  currentUserId?: string
  onRole: (id: string, role: UserRole) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isNew =
                Date.now() - new Date(u.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
              return (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-semibold text-dark">{u.fullName}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                    {isNew && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        New
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{u.mobile || '—'}</td>
                <td className="px-4 py-3 capitalize">{u.provider}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => onRole(u.id, e.target.value as UserRole)}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold capitalize"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  {u.id !== currentUserId && (
                    <button
                      type="button"
                      onClick={() => onDelete(u.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CarFormModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  saveError,
  saving,
}: {
  title: string
  form: CarFormInput
  setForm: React.Dispatch<React.SetStateAction<CarFormInput>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  saveError?: string
  saving?: boolean
}) {
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const update = <K extends keyof CarFormInput>(key: K, value: CarFormInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const carLocation: SelectedLocation | null =
    form.locationName &&
    form.locationAddress &&
    form.latitude != null &&
    form.longitude != null
      ? {
          name: form.locationName,
          address: form.locationAddress,
          latitude: form.latitude,
          longitude: form.longitude,
        }
      : null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-dark/50 p-4 sm:items-center">
        <form
          onSubmit={onSubmit}
          noValidate
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5 text-muted" />
            </button>
          </div>

          {saveError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {saveError}
            </div>
          )}

          <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-3 text-sm font-semibold text-dark">Car Location *</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-dark">City</span>
                <select
                  value={form.locationCity ?? ''}
                  onChange={(e) => {
                    const nextCity = e.target.value
                    setForm((f) => ({
                      ...f,
                      locationCity: nextCity,
                      locationName: '',
                      locationAddress: '',
                      latitude: undefined,
                      longitude: undefined,
                    }))
                  }}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary/40"
                >
                  <option value="">Select city</option>
                  {LUXURY_LOCATIONS.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-dark">
                  Pickup location
                </span>
                <button
                  type="button"
                  onClick={() => form.locationCity && setLocationModalOpen(true)}
                  disabled={!form.locationCity}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-left outline-none transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    className={
                      carLocation ? 'truncate text-dark' : 'text-muted'
                    }
                  >
                    {carLocation?.name ||
                      (form.locationCity
                        ? 'Select where the car is parked'
                        : 'Select city first')}
                  </span>
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                </button>
              </label>
            </div>
            {carLocation && (
              <p className="mt-2 text-xs text-secondary">
                Location set: {carLocation.name} — {carLocation.address}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Brand *" value={form.brand} onChange={(v) => update('brand', v)} />
          <Field label="Model *" value={form.model} onChange={(v) => update('model', v)} />
          <Field
            label="Display name"
            value={form.name}
            onChange={(v) => update('name', v)}
            placeholder="Auto from brand + model if empty"
          />
          <Field
            label="Year"
            type="number"
            value={String(form.year ?? '')}
            onChange={(v) => update('year', Number(v) || undefined)}
          />
          <Select
            label="Vehicle type"
            value={form.vehicleType}
            onChange={(v) => update('vehicleType', v as VehicleType)}
            options={['hatchback', 'sedan', 'suv', 'luxury', 'muv', 'electric']}
          />
          <Select
            label="Category"
            value={form.category ?? 'regular'}
            onChange={(v) => update('category', v as 'regular' | 'tourism')}
            options={['regular', 'tourism']}
          />
          <Select
            label="Transmission"
            value={form.transmission}
            onChange={(v) => update('transmission', v as Transmission)}
            options={['automatic', 'manual']}
          />
          <Select
            label="Fuel"
            value={form.fuel}
            onChange={(v) => update('fuel', v as FuelType)}
            options={['petrol', 'diesel', 'electric', 'hybrid', 'cng']}
          />
          <NumberField
            label="Seats"
            value={form.seats}
            onChange={(v) => update('seats', v)}
            min={1}
            max={20}
          />
          <Field label="Mileage" value={form.mileage} onChange={(v) => update('mileage', v)} />
          <Field
            label="Price / day"
            type="number"
            value={String(form.pricePerDay)}
            onChange={(v) => update('pricePerDay', Number(v) || 0)}
          />
          <Field
            label="Original price"
            type="number"
            value={String(form.originalPrice)}
            onChange={(v) => update('originalPrice', Number(v) || 0)}
          />
          <Field
            label="Price / km"
            type="number"
            value={String(form.pricePerKm ?? '')}
            onChange={(v) => update('pricePerKm', Number(v) || undefined)}
          />
          <Field
            label="Excess km rate"
            type="number"
            value={String(form.excessKmRate ?? 7)}
            onChange={(v) => update('excessKmRate', Number(v) || 7)}
          />
          <Field
            label="Security deposit"
            type="number"
            value={String(form.securityDeposit)}
            onChange={(v) => update('securityDeposit', Number(v) || 0)}
          />
          <Field label="Tag" value={form.tag ?? ''} onChange={(v) => update('tag', v)} />
          <CarImageUpload
            images={form.images}
            onChange={(urls) => update('images', urls)}
          />
          <div className="sm:col-span-2">
            <FeatureChipsField
              label="Feature chips"
              chips={form.featureChips}
              onChange={(chips) => update('featureChips', chips)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {(
            [
              ['unlimitedKm', 'Unlimited KM'],
              ['instantBooking', 'Instant booking'],
              ['freeCancellation', 'Free cancellation'],
              ['airConditioning', 'AC'],
              ['bluetoothFeature', 'Bluetooth'],
              ['sunroof', 'Sunroof'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => update(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {saving ? 'Saving…' : 'Save car'}
          </button>
        </div>
      </form>
      </div>

      <LocationPickerModal
        open={locationModalOpen}
        city={form.locationCity ?? ''}
        selection={carLocation}
        title="Select car location"
        showMapPreview
        onClose={() => setLocationModalOpen(false)}
        onContinue={(location) => {
          setForm((f) => ({
            ...f,
            locationName: location.name,
            locationAddress: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
          }))
          setLocationModalOpen(false)
        }}
      />
    </>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-dark">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '')
          setText(digits)
          if (digits !== '') {
            const parsed = parseInt(digits, 10)
            if (!Number.isNaN(parsed)) {
              onChange(Math.min(max, Math.max(min, parsed)))
            }
          }
        }}
        onBlur={() => {
          if (text === '' || Number(text) < min) {
            const fallback = Math.max(min, value || min)
            setText(String(fallback))
            onChange(fallback)
            return
          }
          const parsed = Math.min(max, Math.max(min, parseInt(text, 10)))
          setText(String(parsed))
          onChange(parsed)
        }}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary/40"
      />
    </label>
  )
}

function FeatureChipsField({
  label,
  chips,
  onChange,
}: {
  label: string
  chips: string[]
  onChange: (chips: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  const addChip = (raw: string) => {
    const value = raw.trim()
    if (!value) return
    if (chips.some((chip) => chip.toLowerCase() === value.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([...chips, value])
    setDraft('')
  }

  const removeChip = (index: number) => {
    onChange(chips.filter((_, i) => i !== index))
  }

  const handleDraftChange = (value: string) => {
    if (value.includes(',')) {
      const parts = value.split(',').map((part) => part.trim()).filter(Boolean)
      const next = [...chips]
      for (const part of parts) {
        if (!next.some((chip) => chip.toLowerCase() === part.toLowerCase())) {
          next.push(part)
        }
      }
      onChange(next)
      setDraft('')
      return
    }
    setDraft(value)
  }

  return (
    <div className="block text-sm">
      <span className="mb-1.5 block font-semibold text-dark">{label}</span>
      {chips.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <span
              key={`${chip}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-dark"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(index)}
                aria-label={`Remove ${chip}`}
                className="text-muted hover:text-dark"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addChip(draft)
            }
          }}
          placeholder="e.g. Sunroof, FastTag Included"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary/40"
        />
        <button
          type="button"
          onClick={() => addChip(draft)}
          className="shrink-0 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary"
        >
          Add
        </button>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Type a feature and tap Add, or separate with a comma.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['With Luggage Carrier', 'Without Luggage Carrier'].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => addChip(preset)}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-dark transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            + {preset}
          </button>
        ))}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-dark">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-primary/40"
      />
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-dark">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 capitalize outline-none focus:border-primary/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === 'cng' ? 'CNG' : o}
          </option>
        ))}
      </select>
    </label>
  )
}
