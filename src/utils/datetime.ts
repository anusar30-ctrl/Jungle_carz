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
