import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Car,
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  addCar,
  deleteCar,
  getAllCars,
  resetCarsToSeed,
  updateCar,
  type CarFormInput,
} from '../utils/carsStorage'
import {
  deleteBooking,
  getBookingRequests,
  updateBookingStatus,
} from '../utils/bookingStorage'
import {
  deleteUserAccount,
  getAllUsersForAdmin,
  setUserRole,
} from '../utils/authStorage'
import type { CarListing, FuelType, Transmission, VehicleType } from '../types/search'
import type { BookingRequest, BookingStatus } from '../types/booking'
import type { AdminUserView, UserRole } from '../types/auth'
import { formatCurrency } from '../hooks/useCarFilters'

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
  securityDeposit: 5000,
  images: [''],
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
}

export function Admin() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [cars, setCars] = useState(() => getAllCars())
  const [bookings, setBookings] = useState(() => getBookingRequests())
  const [users, setUsers] = useState(() => getAllUsersForAdmin())
  const [showCarForm, setShowCarForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CarFormInput>(emptyCarForm)
  const [carQuery, setCarQuery] = useState('')

  const refresh = () => {
    setCars(getAllCars())
    setBookings(getBookingRequests())
    setUsers(getAllUsersForAdmin())
  }

  const stats = useMemo(
    () => ({
      cars: cars.length,
      tourism: cars.filter((c) => c.category === 'tourism').length,
      bookings: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      users: users.length,
      admins: users.filter((u) => u.role === 'admin').length,
      revenue: bookings
        .filter((b) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + b.total, 0),
    }),
    [cars, bookings, users],
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
    setShowCarForm(true)
  }

  const openEdit = (car: CarListing) => {
    setEditingId(car.id)
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
    })
    setShowCarForm(true)
  }

  const saveCar = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CarFormInput = {
      ...form,
      name: form.name || `${form.brand} ${form.model}`,
      images: form.images.filter(Boolean),
      featureChips: form.featureChips.filter(Boolean),
    }
    if (editingId) updateCar(editingId, payload)
    else addCar(payload)
    setShowCarForm(false)
    refresh()
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

        {tab === 'overview' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Cars" value={String(stats.cars)} sub={`${stats.tourism} tourism`} />
            <StatCard label="Bookings" value={String(stats.bookings)} sub={`${stats.pending} pending`} />
            <StatCard label="Users" value={String(stats.users)} sub={`${stats.admins} admin`} />
            <StatCard
              label="Confirmed Revenue"
              value={formatCurrency(stats.revenue)}
              sub="Confirmed + completed"
            />
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
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset cars to default seed fleet?')) {
                      resetCarsToSeed()
                      refresh()
                    }
                  }}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold"
                >
                  Reset fleet
                </button>
                <button
                  type="button"
                  onClick={openAdd}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add car
                </button>
              </div>
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
                              onClick={() => {
                                if (confirm(`Delete ${car.name}?`)) {
                                  deleteCar(car.id)
                                  refresh()
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
            onStatus={(id, status) => {
              updateBookingStatus(id, status)
              refresh()
            }}
            onDelete={(id) => {
              if (confirm('Delete this booking?')) {
                deleteBooking(id)
                refresh()
              }
            }}
          />
        )}

        {tab === 'users' && (
          <UsersPanel
            users={users}
            onRole={(id, role) => {
              setUserRole(id, role)
              refresh()
            }}
            onDelete={(id) => {
              if (confirm('Delete this user account?')) {
                deleteUserAccount(id)
                refresh()
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
          onClose={() => setShowCarForm(false)}
          onSubmit={saveCar}
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
  onStatus,
  onDelete,
}: {
  bookings: BookingRequest[]
  onStatus: (id: string, status: BookingStatus) => void
  onDelete: (id: string) => void
}) {
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

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
              <p className="text-xs font-semibold text-muted">{b.reference}</p>
              <h3 className="text-lg font-bold text-dark">{b.carName}</h3>
              <p className="text-sm text-muted">
                {b.customer.fullName} · {b.customer.email} · {b.customer.mobile}
              </p>
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
  onRole,
  onDelete,
}: {
  users: AdminUserView[]
  onRole: (id: string, role: UserRole) => void
  onDelete: (id: string) => void
}) {
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
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-dark">{u.fullName}</p>
                  <p className="text-xs text-muted">{u.email}</p>
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
                  {u.email !== 'admin@junglecarz.com' && (
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
            ))}
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
}: {
  title: string
  form: CarFormInput
  setForm: React.Dispatch<React.SetStateAction<CarFormInput>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const update = <K extends keyof CarFormInput>(key: K, value: CarFormInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dark/50 p-4 sm:items-center">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Brand" value={form.brand} onChange={(v) => update('brand', v)} required />
          <Field label="Model" value={form.model} onChange={(v) => update('model', v)} required />
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
            options={['petrol', 'diesel', 'electric', 'hybrid']}
          />
          <Field
            label="Seats"
            type="number"
            value={String(form.seats)}
            onChange={(v) => update('seats', Number(v) || 5)}
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
            label="Security deposit"
            type="number"
            value={String(form.securityDeposit)}
            onChange={(v) => update('securityDeposit', Number(v) || 0)}
          />
          <Field label="Tag" value={form.tag ?? ''} onChange={(v) => update('tag', v)} />
          <div className="sm:col-span-2">
            <Field
              label="Image URL"
              value={form.images[0] ?? ''}
              onChange={(v) => update('images', [v])}
              placeholder="https://..."
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Feature chips (comma separated)"
              value={form.featureChips.join(', ')}
              onChange={(v) =>
                update(
                  'featureChips',
                  v.split(',').map((s) => s.trim()).filter(Boolean),
                )
              }
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
            className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white"
          >
            Save car
          </button>
        </div>
      </form>
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
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
