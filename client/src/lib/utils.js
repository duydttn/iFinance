import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: vi })
}

export function getScopeBadge(scope) {
  if (scope === 'business') return { label: 'Công ty', variant: 'business' }
  if (scope === 'personal') return { label: 'Cá nhân', variant: 'personal' }
  return { label: 'Cả hai', variant: 'both' }
}

export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getMonthAgo() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().split('T')[0]
}
