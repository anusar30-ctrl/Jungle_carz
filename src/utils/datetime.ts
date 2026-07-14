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
