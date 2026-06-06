import type { Role } from './types'

// Prices are stored in paise-free rupees in seed data; format as INR.
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ---- Role-based permission helpers (mirrors the API permissions matrix) ----
export type Permission =
  | 'manageUsers'
  | 'viewVendors'
  | 'editVendors'
  | 'viewRfqs'
  | 'editRfqs'
  | 'submitQuotations'
  | 'compareQuotations'
  | 'approve'
  | 'generatePO'
  | 'generateInvoice'
  | 'sendInvoiceEmail'

const MATRIX: Record<Permission, Role[]> = {
  manageUsers: ['ADMIN'],
  viewVendors: ['ADMIN', 'PROCUREMENT_OFFICER'],
  editVendors: ['ADMIN'],
  viewRfqs: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'],
  editRfqs: ['ADMIN', 'PROCUREMENT_OFFICER'],
  submitQuotations: ['VENDOR'],
  compareQuotations: ['ADMIN', 'PROCUREMENT_OFFICER'],
  approve: ['ADMIN', 'MANAGER'],
  generatePO: ['ADMIN', 'PROCUREMENT_OFFICER'],
  generateInvoice: ['ADMIN', 'PROCUREMENT_OFFICER'],
  sendInvoiceEmail: ['ADMIN', 'PROCUREMENT_OFFICER'],
}

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return MATRIX[permission].includes(role)
}
