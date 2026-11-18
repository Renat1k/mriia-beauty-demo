import { masters, services } from './data'
import type { Service } from './data'

export interface DemoBooking {
  id: string
  serviceId: string
  masterId: string
  date: string
  time: string
  name: string
  phone: string
  notes: string
  createdAt: string
}

export const STORAGE_KEY = 'mriia.demo-bookings.v1'
export const TIME_ZONE = 'Europe/Kyiv'

export function todayInKyiv() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const part = (type: string) => parts.find(p => p.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function addDays(value: string, days: number) {
  const date = new Date(`${value}T12:00:00`)
  date.setDate(date.getDate() + days)
  return dateKey(date)
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatDate(value: string, withWeekday = false) {
  return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', ...(withWeekday ? { weekday: 'long' as const } : {}) }).format(new Date(`${value}T12:00:00`))
}

export const timeToMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
export const minutesToTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
const overlaps = (start: number, end: number, otherStart: number, otherEnd: number) => start < otherEnd && end > otherStart

export function candidateTimes(service: Service) {
  return Array.from({ length: Math.floor((20 * 60 - 9 * 60 - service.duration) / 30) + 1 }, (_, index) => minutesToTime(9 * 60 + index * 30))
}

export function availableMasters(service: Service, masterId: string, date: string, time: string, bookings: DemoBooking[]) {
  const today = todayInKyiv()
  if (date < today || date > addDays(today, 60) || !candidateTimes(service).includes(time)) return []
  const start = timeToMinutes(time)
  if (date === today) {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
    const hour = Number(parts.find(p => p.type === 'hour')?.value)
    const minute = Number(parts.find(p => p.type === 'minute')?.value)
    if (start < hour * 60 + minute + 60) return []
  }
  return masters.filter(master => {
    if (!master.categories.includes(service.category) || (masterId !== 'any' && master.id !== masterId)) return false
    const end = start + service.duration
    // Fictional occupied intervals make the demo schedule realistic and deterministic.
    const dayNumber = Number(date.slice(-2))
    const demoBlocks = dayNumber % 2 ? [[11 * 60, 12 * 60], [14 * 60, 15 * 60]] : [[12 * 60, 13 * 60], [15 * 60, 16 * 60]]
    if (demoBlocks.some(([from, to]) => overlaps(start, end, from, to))) return false
    return !bookings.some(booking => {
      if (booking.masterId !== master.id || booking.date !== date) return false
      const duration = services.find(s => s.id === booking.serviceId)?.duration || 60
      return overlaps(start, end, timeToMinutes(booking.time), timeToMinutes(booking.time) + duration)
    })
  })
}

export function readBookings(): DemoBooking[] {
  const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is DemoBooking => {
    if (!item || typeof item !== 'object') return false
    const record = item as Record<string, unknown>
    return ['id', 'serviceId', 'masterId', 'date', 'time', 'name', 'phone', 'notes', 'createdAt'].every(key => typeof record[key] === 'string')
      && services.some(s => s.id === record.serviceId)
      && masters.some(m => m.id === record.masterId)
      && /^\d{4}-\d{2}-\d{2}$/.test(String(record.date))
      && !Number.isNaN(new Date(`${record.date}T12:00:00`).getTime())
      && /^([01]\d|2[0-3]):[0-5]\d$/.test(String(record.time))
  })
}

export function writeBookings(bookings: DemoBooking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

export function normalizePhone(value: string) {
  return `+${value.replace(/\D/g, '')}`
}

export function downloadCalendar(booking: DemoBooking) {
  const service = services.find(s => s.id === booking.serviceId)!
  const master = masters.find(m => m.id === booking.masterId)!
  const guess = new Date(`${booking.date}T${booking.time}:00Z`)
  const zoneName = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'shortOffset' }).formatToParts(guess).find(part => part.type === 'timeZoneName')?.value || 'GMT+2'
  const offset = Number(zoneName.match(/GMT([+-]\d+)/)?.[1] || 0)
  const start = new Date(guess.getTime() - offset * 60 * 60 * 1000)
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
  const content = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mriia//Demo Booking//UK', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${booking.id}@mriia.demo`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(start.getTime() + service.duration * 60 * 1000))}`,
    `SUMMARY:${escape(`ДЕМО · мрія: ${service.name}`)}`,
    `DESCRIPTION:${escape(`Портфолійна демоверсія: це не реальне бронювання. Запис нікуди не надіслано. Салон і майстриня вигадані. Приклад майстрині: ${master.name}.`)}`,
    'STATUS:TENTATIVE', 'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `mriia-demo-${booking.id}.ics`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
