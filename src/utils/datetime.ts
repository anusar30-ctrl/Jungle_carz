/** Build value for `<input type="datetime-local" />` from URL date + time (HH:mm). */
export function toDatetimeLocal(date: string, time: string): string {
  if (!date) return ''
  const [h = '10', m = '00'] = (time || '10:00').split(':')
  return `${date}T${h.padStart(2, '0')}:${m.padStart(2, '0')}`
}

/** Split datetime-local value into date (YYYY-MM-DD) and time (HH:mm). */
export function splitDatetimeLocal(value: string): { date: string; time: string } {
  if (!value) return { date: '', time: '' }
  const [date, timePart] = value.split('T')
  return { date: date ?? '', time: timePart?.slice(0, 5) ?? '10:00' }
}

/** Minimum datetime-local string for drop-off (same day as pickup allowed). */
export function minDropDatetime(pickupValue: string): string {
  return pickupValue || ''
}

const MINUTES_PER_HOUR = 60
const MS_PER_HOUR = 60 * 60 * 1000

/** Hours between two datetime-local values (local timezone). */
export function getTripDurationHours(start: string, end: string): number {
  if (!start || !end) return 0
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
    return 0
  }
  return (endMs - startMs) / MS_PER_HOUR
}

/** Add hours to a datetime-local string and return another datetime-local value. */
export function addHoursToDatetimeLocal(value: string, hours: number): string {
  if (!value) return ''
  const date = new Date(value)
  date.setMinutes(date.getMinutes() + hours * MINUTES_PER_HOUR)
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const MIN_SELF_DRIVE_HOURS = 6

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** Format for trip picker header, e.g. "21 Jul'26, 8 AM" */
export function formatTripPickerLabel(datetimeLocal: string): string {
  if (!datetimeLocal) return ''
  const d = new Date(datetimeLocal)
  if (Number.isNaN(d.getTime())) return ''
  const day = d.getDate()
  const mon = MONTHS_SHORT[d.getMonth()]
  const yr = String(d.getFullYear()).slice(-2)
  let h = d.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const mins = d.getMinutes()
  if (mins === 0) return `${day} ${mon}'${yr}, ${h} ${ampm}`
  return `${day} ${mon}'${yr}, ${h}:${String(mins).padStart(2, '0')} ${ampm}`
}

export function formatTripRangeLabel(start: string, end: string): string {
  return `${formatTripPickerLabel(start)} - ${formatTripPickerLabel(end)}`
}

export function dateYmd(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayYmd(): string {
  return dateYmd(new Date())
}

/** Minutes from midnight, snapped to 30-min slots (0–1410). */
export function minutesFromDatetimeLocal(value: string): number {
  const { time } = splitDatetimeLocal(value)
  const [h = '10', m = '0'] = time.split(':')
  const total = Number(h) * 60 + Number(m)
  return Math.round(total / 30) * 30
}

export function datetimeFromParts(date: string, minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date}T${pad(h)}:${pad(m)}`
}

export function formatMinutesLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS_SHORT[month]} '${String(year).slice(-2)}`
}
