import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const cx = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ')
}
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function formatDate(date: Date) {
  const zonedDate = toZonedTime(date, 'America/Lima')
  return format(zonedDate, 'dd-MM-yyyy HH:mm')
}

export function formatDateCalendar(date: Date) {
  const zonedDate = toZonedTime(date, 'America/Lima')
  return format(zonedDate, 'dd-MM-yyyy')
}

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
