// Domain types — mirror the VendorBridge API documentation exactly.

export type Role = 'ADMIN' | 'PROCUREMENT_OFFICER' | 'MANAGER' | 'VENDOR'

export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED'
export type RfqStatus = 'OPEN' | 'CLOSED' | 'AWARDED'
export type ApprovalStatus = 'APPROVED' | 'REJECTED'
export type PoStatus = 'ISSUED' | 'FULFILLED' | 'CANCELLED'
export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  vendorId?: string
}

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  gstNumber: string
  category: string
  status: VendorStatus
}

export interface Rfq {
  id: string
  title: string
  description: string
  quantity: number
  deadline: string
  status: RfqStatus
  createdAt: string
}

export interface Quotation {
  id: string
  rfqId: string
  vendorId: string
  price: number
  deliveryDays: number
  notes: string
  createdAt: string
  vendor: { id: string; name: string }
  rfq: { id: string; title: string }
}

export interface ComparisonRow {
  quotationId: string
  vendorId: string
  vendor: string
  price: number
  deliveryDays: number
  notes: string
  lowestPrice: boolean
}

export interface Approval {
  id: string
  quotationId: string
  status: ApprovalStatus
  remarks: string
  approvedBy: string
  createdAt: string
  quotation: {
    vendor: { name: string }
    rfq: { title: string }
    price: number
  }
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  quotationId: string
  status: PoStatus
  createdAt: string
  quotation: {
    price: number
    deliveryDays: number
    vendor: { name: string }
    rfq: { title: string }
  }
}

export interface Invoice {
  id: string
  invoiceNumber: string
  purchaseOrderId: string
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  createdAt: string
  purchaseOrder: {
    poNumber: string
    quotation: {
      price: number
      deliveryDays: number
      vendor: { name: string }
    }
  }
}

export type ActivityType =
  | 'RFQ_CREATED'
  | 'QUOTATION_SUBMITTED'
  | 'QUOTATION_APPROVED'
  | 'QUOTATION_REJECTED'
  | 'VENDOR_CREATED'
  | 'PO_GENERATED'
  | 'INVOICE_GENERATED'
  | 'INVOICE_SENT'

export interface Activity {
  id: string
  type: ActivityType
  message: string
  createdAt: string
  actor: string
}

export interface DashboardStats {
  totalVendors: number
  activeRfqs: number
  pendingApprovals: number
  totalInvoices: number
  totalPurchaseOrders: number
  recentActivity: Pick<Activity, 'type' | 'message' | 'createdAt'>[]
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrator',
  PROCUREMENT_OFFICER: 'Procurement Officer',
  MANAGER: 'Manager',
  VENDOR: 'Vendor',
}
