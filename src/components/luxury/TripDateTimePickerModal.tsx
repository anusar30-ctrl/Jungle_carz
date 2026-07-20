import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  dateYmd,
  datetimeFromParts,
  formatMinutesLabel,
  formatTripRangeLabel,
  getTripDurationHours,
  MIN_SELF_DRIVE_HOURS,
  minutesFromDatetimeLocal,
  monthLabel,
  splitDatetimeLocal,
  todayYmd,
  toDatetimeLocal,
} from '../../utils/datetime'

type TripDateTimePickerModalProps = {
  open: boolean
  tripStart: string
  tripEnd: string
  enforceMinDuration: boolean
  onClose: () => void
  onContinue: (start: string, end: string) => void
  onDurationTooShort: () => void
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const
const TIME_MAX = 1410
const TIME_STEP = 30

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

function buildMonthCells(year: number, month: number) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array.from({ length: firstDow }, () => null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)
  return cells
}

function formatDurationHint(hours: number): string {
  if (hours < 1) {
    const mins = Math.round(hours * 60)
    return `${mins} min`
  }
  if (hours < 24) return `${hours.toFixed(1).replace(/\.0$/, '')} hrs`
  const days = Math.floor(hours / 24)
  const rem = hours % 24
  if (rem < 0.5) return `${days} day${days > 1 ? 's' : ''}`
  return `${days}d ${Math.round(rem)}h`
}

export function TripDateTimePickerModal({
  open,
  tripStart,
  tripEnd,
  enforceMinDuration,
  onClose,
  onContinue,
  onDurationTooShort,
}: TripDateTimePickerModalProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startMinutes, setStartMinutes] = useState(480)
  const [endMinutes, setEndMinutes] = useState(480)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())

  useEffect(() => {
    if (!open) return
    const start = splitDatetimeLocal(tripStart)
    const end = splitDatetimeLocal(tripEnd)
    setStartDate(start.date || todayYmd())
    setEndDate(end.date || todayYmd())
    setStartMinutes(
      minutesFromDatetimeLocal(tripStart || toDatetimeLocal(todayYmd(), '08:00'))
    )
    setEndMinutes(
      minutesFromDatetimeLocal(tripEnd || toDatetimeLocal(todayYmd(), '08:00'))
    )
    const base = start.date ? new Date(start.date) : new Date()
    setViewYear(base.getFullYear())
    setViewMonth(base.getMonth())
  }, [open, tripStart, tripEnd])

  const rightMonth = addMonths(viewYear, viewMonth, 1)
  const today = todayYmd()

  const previewStart = datetimeFromParts(startDate, startMinutes)
  const previewEnd = datetimeFromParts(endDate || startDate, endMinutes)
  const durationHours = getTripDurationHours(previewStart, previewEnd)
  const durationTooShort =
    enforceMinDuration && durationHours > 0 && durationHours < MIN_SELF_DRIVE_HOURS
  const endBeforeStart =
    durationHours <= 0 &&
    !!startDate &&
    new Date(previewEnd).getTime() <= new Date(previewStart).getTime()

  const rangeLabel = useMemo(
    () => formatTripRangeLabel(previewStart, previewEnd),
    [previewStart, previewEnd]
  )

  const handleDateClick = (year: number, month: number, day: number) => {
    const ymd = dateYmd(new Date(year, month, day))
    if (ymd < today) return

    if (!startDate || (startDate && endDate)) {
      setStartDate(ymd)
      setEndDate('')
      return
    }

    if (ymd < startDate) {
      setEndDate(startDate)
      setStartDate(ymd)
      return
    }

    setEndDate(ymd)
  }

  const handleReset = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setStartDate(dateYmd(now))
    setEndDate(dateYmd(tomorrow))
    setStartMinutes(480)
    setEndMinutes(480)
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
  }

  const handleContinue = () => {
    const end = endDate || startDate
    const start = datetimeFromParts(startDate, startMinutes)
    const endDt = datetimeFromParts(end, endMinutes)

    if (new Date(endDt).getTime() <= new Date(start).getTime()) {
      onDurationTooShort()
      return
    }

    if (
      enforceMinDuration &&
      getTripDurationHours(start, endDt) < MIN_SELF_DRIVE_HOURS
    ) {
      onClose()
      onDurationTooShort()
      return
    }

    onContinue(start, endDt)
    onClose()
  }

  const shiftMonths = (delta: number) => {
    const next = addMonths(viewYear, viewMonth, delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  const renderMonth = (year: number, month: number) => {
    const cells = buildMonthCells(year, month)
    const effectiveEnd = endDate || startDate
    const hasRange = startDate && endDate && startDate !== endDate

    return (
      <div className="min-w-[252px] flex-1">
        <p className="mb-4 text-center font-outfit text-[15px] font-semibold tracking-tight text-gray-800">
          {monthLabel(year, month)}
        </p>
        <div className="mb-1 grid grid-cols-7 border-b border-gray-100 pb-2">
          {WEEKDAYS.map((d, i) => (
            <span
              key={`${year}-${month}-wd-${i}`}
              className="text-center font-outfit text-[11px] font-semibold uppercase tracking-wide text-gray-400"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            if (day === null) {
              return <span key={`${year}-${month}-e-${idx}`} className="h-10" />
            }
            const ymd = dateYmd(new Date(year, month, day))
            const isPast = ymd < today
            const isStart = ymd === startDate
            const isEnd = ymd === effectiveEnd
            const inRange =
              hasRange && ymd > startDate && ymd < effectiveEnd
            const isSingle = isStart && isEnd

            return (
              <div
                key={`${year}-${month}-d-${day}`}
                className="relative flex h-10 items-center justify-center"
              >
                {inRange && (
                  <span className="absolute inset-y-1.5 inset-x-0 bg-primary/12" />
                )}
                {isStart && hasRange && (
                  <span className="absolute inset-y-1.5 left-1/2 right-0 bg-primary/12" />
                )}
                {isEnd && hasRange && (
                  <span className="absolute inset-y-1.5 left-0 right-1/2 bg-primary/12" />
                )}

                <button
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDateClick(year, month, day)}
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full font-outfit text-sm transition-all ${
                    isPast
                      ? 'cursor-not-allowed text-gray-300'
                      : isStart || isEnd
                        ? 'bg-primary font-semibold text-white shadow-sm shadow-primary/30'
                        : 'text-gray-700 hover:bg-gray-100'
                  } ${isSingle ? 'ring-2 ring-primary/25' : ''}`}
                >
                  {day}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-end justify-center bg-black/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative flex max-h-[96dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-picker-title"
          >
            {/* Header */}
            <div className="border-b border-gray-100 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
              <div className="flex items-start justify-between gap-3 pr-8">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p
                      id="trip-picker-title"
                      className="font-outfit text-[15px] font-semibold leading-snug text-gray-900 sm:text-base"
                    >
                      {rangeLabel}
                    </p>
                    {durationHours > 0 && (
                      <p className="mt-1 font-outfit text-xs text-gray-500">
                        Trip duration:{' '}
                        <span
                          className={
                            durationTooShort
                              ? 'font-semibold text-amber-600'
                              : 'font-semibold text-primary'
                          }
                        >
                          {formatDurationHint(durationHours)}
                        </span>
                        {enforceMinDuration && (
                          <span className="text-gray-400">
                            {' '}
                            · min {MIN_SELF_DRIVE_HOURS}h
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="shrink-0 pt-1 font-outfit text-xs font-bold tracking-wider text-primary transition-colors hover:text-primary-dark sm:text-sm"
                >
                  RESET
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:right-4 sm:top-4"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
              <div className="flex items-start gap-1 sm:gap-3">
                <button
                  type="button"
                  onClick={() => shiftMonths(-1)}
                  className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-8 sm:flex-row sm:gap-4">
                  {renderMonth(viewYear, viewMonth)}
                  <div className="hidden sm:block">{renderMonth(rightMonth.year, rightMonth.month)}</div>
                </div>

                <button
                  type="button"
                  onClick={() => shiftMonths(1)}
                  className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile: second month below */}
              <div className="mt-8 sm:hidden">{renderMonth(rightMonth.year, rightMonth.month)}</div>

              <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5">
                <p className="font-outfit text-sm font-semibold text-gray-900">
                  Select the start time &amp; end time
                </p>
                <p className="mt-0.5 font-outfit text-xs text-gray-500">
                  All times are shown in IST (UTC+5:30).
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <TimeSelect
                    label="Start Time"
                    value={startMinutes}
                    onChange={setStartMinutes}
                  />
                  <TimeSelect
                    label="End Time"
                    value={endMinutes}
                    onChange={setEndMinutes}
                  />
                </div>
              </div>

              {(durationTooShort || endBeforeStart) && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="font-outfit text-xs leading-relaxed text-amber-800">
                    {endBeforeStart
                      ? 'End time must be after start time.'
                      : `Self drive trips must be longer than ${MIN_SELF_DRIVE_HOURS} hours. Adjust your dates or times.`}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!startDate}
                className="ml-auto flex min-h-[50px] w-full items-center justify-center rounded-xl bg-primary px-8 font-outfit text-sm font-bold tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:opacity-50 sm:ml-0 sm:w-auto sm:min-w-[200px]"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

const TIME_OPTIONS = Array.from({ length: TIME_MAX / TIME_STEP + 1 }, (_, i) => {
  const minutes = i * TIME_STEP
  return { minutes, label: formatMinutesLabel(minutes) }
})

function TimeSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block font-outfit text-xs font-medium text-gray-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full min-w-0 rounded-lg border-2 border-primary/25 bg-white px-3 py-2.5 font-outfit text-sm font-bold tabular-nums text-primary shadow-sm outline-none transition-colors focus:border-primary/50"
        aria-label={label}
      >
        {TIME_OPTIONS.map((opt) => (
          <option key={opt.minutes} value={opt.minutes}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
