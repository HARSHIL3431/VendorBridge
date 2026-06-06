import axios from 'axios'
import type {
  Activity,
  Approval,
  ComparisonRow,
  DashboardStats,
  Invoice,
  PurchaseOrder,
  Quotation,
  Rfq,
  RfqStatus,
  User,
  Vendor,
} from './types'
import * as seed from './seed-data'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vendorbridge_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    const msg = error.response?.data?.message || error.message
    return Promise.reject(new Error(msg))
  }
)

const KEYS = {
  vendors: 'vb_vendors',
  rfqs: 'vb_rfqs',
  quotations: 'vb_quotations',
  approvals: 'vb_approvals',
  purchaseOrders: 'vb_purchase_orders',
  invoices: 'vb_invoices',
  activities: 'vb_activities',
}

function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('vendorbridge_demo') === 'true'
}

function getLocal<T>(key: string, defaultData: T): T {
  if (typeof window === 'undefined') return defaultData
  const val = localStorage.getItem(key)
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultData))
    return defaultData
  }
  return JSON.parse(val)
}

function setLocal<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export const db = {
  // ---- Auth ----
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (isDemoMode()) {
      const user = seed.seedUsers.find(u => u.email === email && u.password === password)
      if (!user) {
        throw new Error('Invalid email or password (Demo Mode)')
      }
      return {
        token: 'mock-jwt-token-for-demo',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          vendorId: user.vendorId,
        }
      }
    }
    const res = await axios.post(`${api.defaults.baseURL}/auth/login`, { email, password })
    return res.data.data
  },

  // ---- Dashboard ----
  async dashboardStats(): Promise<DashboardStats> {
    if (isDemoMode()) {
      const vendors = getLocal<Vendor[]>(KEYS.vendors, seed.seedVendors)
      const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
      const approvals = getLocal<Approval[]>(KEYS.approvals, seed.seedApprovals)
      const invoices = getLocal<Invoice[]>(KEYS.invoices, seed.seedInvoices)
      const pos = getLocal<PurchaseOrder[]>(KEYS.purchaseOrders, seed.seedPurchaseOrders)
      const activities = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)

      return {
        totalVendors: vendors.length,
        activeRfqs: rfqs.filter(r => r.status === 'OPEN').length,
        pendingApprovals: approvals.filter(a => a.status === 'APPROVED').length,
        totalInvoices: invoices.length,
        totalPurchaseOrders: pos.length,
        recentActivity: activities.map(a => ({ type: a.type, message: a.message, createdAt: a.createdAt })).slice(0, 4)
      }
    }
    return api.get('/dashboard/stats')
  },

  // ---- Vendors ----
  async listVendors(filter?: { search?: string; category?: string; status?: string }): Promise<Vendor[]> {
    if (isDemoMode()) {
      let list = getLocal<Vendor[]>(KEYS.vendors, seed.seedVendors)
      if (filter?.search) {
         const s = filter.search.toLowerCase()
         list = list.filter(v => v.name.toLowerCase().includes(s) || v.email.toLowerCase().includes(s))
      }
      if (filter?.category && filter.category !== 'ALL') {
         list = list.filter(v => v.category === filter.category)
      }
      if (filter?.status && filter.status !== 'ALL') {
         list = list.filter(v => v.status === filter.status)
      }
      return list
    }
    const params = new URLSearchParams()
    if (filter?.search) params.append('search', filter.search)
    if (filter?.category && filter.category !== 'ALL') params.append('category', filter.category)
    if (filter?.status && filter.status !== 'ALL') params.append('status', filter.status)
    const qs = params.toString()
    return api.get(`/vendors${qs ? `?${qs}` : ''}`)
  },
  async createVendor(input: Omit<Vendor, 'id'>): Promise<Vendor> {
    if (isDemoMode()) {
      const list = getLocal<Vendor[]>(KEYS.vendors, seed.seedVendors)
      const newVendor: Vendor = {
        ...input,
        id: `v-${Date.now()}`,
      }
      list.push(newVendor)
      setLocal(KEYS.vendors, list)

      // Add Activity
      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: 'VENDOR_CREATED',
        message: `${newVendor.name} added to vendor directory`,
        createdAt: new Date().toISOString(),
        actor: 'You'
      })
      setLocal(KEYS.activities, acts)

      return newVendor
    }
    return api.post('/vendors', input)
  },
  async updateVendor(id: string, patch: Partial<Vendor>): Promise<Vendor> {
    if (isDemoMode()) {
      const list = getLocal<Vendor[]>(KEYS.vendors, seed.seedVendors)
      const idx = list.findIndex(v => v.id === id)
      if (idx === -1) throw new Error('Vendor not found')
      list[idx] = { ...list[idx], ...patch }
      setLocal(KEYS.vendors, list)
      return list[idx]
    }
    return api.put(`/vendors/${id}`, patch)
  },
  async deleteVendor(id: string): Promise<void> {
    if (isDemoMode()) {
      const list = getLocal<Vendor[]>(KEYS.vendors, seed.seedVendors)
      const filtered = list.filter(v => v.id !== id)
      setLocal(KEYS.vendors, filtered)
      return
    }
    return api.delete(`/vendors/${id}`)
  },

  // ---- RFQs ----
  async listRfqs(): Promise<Rfq[]> {
    if (isDemoMode()) {
      return getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
    }
    return api.get('/rfqs')
  },
  async getRfq(id: string): Promise<Rfq & { quotations: Quotation[] }> {
    if (isDemoMode()) {
      const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
      const rfq = rfqs.find(r => r.id === id)
      if (!rfq) throw new Error('RFQ not found')

      const quotations = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)
      const rfqQuotations = quotations.filter(q => q.rfqId === id)

      return {
        ...rfq,
        quotations: rfqQuotations,
      }
    }
    return api.get(`/rfqs/${id}`)
  },
  async createRfq(input: { title: string; description: string; quantity: number; deadline: string }): Promise<Rfq> {
    if (isDemoMode()) {
      const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
      const newRfq: Rfq = {
        id: `r-${Date.now()}`,
        title: input.title,
        description: input.description,
        quantity: input.quantity,
        deadline: new Date(input.deadline).toISOString(),
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      }
      rfqs.unshift(newRfq)
      setLocal(KEYS.rfqs, rfqs)

      // Add Activity
      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: 'RFQ_CREATED',
        message: `${newRfq.title} RFQ created`,
        createdAt: new Date().toISOString(),
        actor: 'You'
      })
      setLocal(KEYS.activities, acts)

      return newRfq
    }
    return api.post('/rfqs', input)
  },
  async updateRfqStatus(id: string, status: RfqStatus): Promise<Rfq> {
    if (isDemoMode()) {
      const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
      const idx = rfqs.findIndex(r => r.id === id)
      if (idx === -1) throw new Error('RFQ not found')
      rfqs[idx].status = status
      setLocal(KEYS.rfqs, rfqs)
      return rfqs[idx]
    }
    return api.put(`/rfqs/${id}`, { status })
  },

  // ---- Quotations ----
  async listQuotations(filter?: { rfqId?: string; vendorId?: string }): Promise<Quotation[]> {
    if (isDemoMode()) {
      let qs = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)
      if (filter?.rfqId) qs = qs.filter(q => q.rfqId === filter.rfqId)
      if (filter?.vendorId) qs = qs.filter(q => q.vendorId === filter.vendorId)
      return qs
    }
    const params = new URLSearchParams()
    if (filter?.rfqId) params.append('rfqId', filter.rfqId)
    if (filter?.vendorId) params.append('vendorId', filter.vendorId)
    const qs = params.toString()
    return api.get(`/quotations${qs ? `?${qs}` : ''}`)
  },
  async submitQuotation(input: { rfqId: string; vendorId: string; price: number; deliveryDays: number; notes: string }): Promise<Quotation> {
    if (isDemoMode()) {
      const qs = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)
      const vendors = getLocal<Vendor[]>(KEYS.vendors, seed.seedVendors)
      const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)

      const vendor = vendors.find(v => v.id === input.vendorId)
      const rfq = rfqs.find(r => r.id === input.rfqId)

      if (!vendor || !rfq) throw new Error('Invalid RFQ or Vendor ID')

      const newQ: Quotation = {
        id: `q-${Date.now()}`,
        rfqId: input.rfqId,
        vendorId: input.vendorId,
        price: input.price,
        deliveryDays: input.deliveryDays,
        notes: input.notes,
        createdAt: new Date().toISOString(),
        vendor: { id: vendor.id, name: vendor.name },
        rfq: { id: rfq.id, title: rfq.title },
      }

      qs.unshift(newQ)
      setLocal(KEYS.quotations, qs)

      // Add Activity
      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: 'QUOTATION_SUBMITTED',
        message: `${vendor.name} submitted a quotation for ${rfq.title}`,
        createdAt: new Date().toISOString(),
        actor: vendor.name,
      })
      setLocal(KEYS.activities, acts)

      return newQ
    }
    return api.post('/quotations', input)
  },
  async updateQuotation(id: string, input: { price: number; deliveryDays: number; notes: string }): Promise<Quotation> {
    if (isDemoMode()) {
      const qs = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)
      const idx = qs.findIndex(q => q.id === id)
      if (idx === -1) throw new Error('Quotation not found')

      qs[idx] = {
        ...qs[idx],
        price: input.price,
        deliveryDays: input.deliveryDays,
        notes: input.notes,
      }
      setLocal(KEYS.quotations, qs)
      return qs[idx]
    }
    return api.put(`/quotations/${id}`, input)
  },

  // ---- Comparison ----
  async compare(rfqId: string): Promise<{ rfq: Pick<Rfq, 'id' | 'title' | 'quantity'>; quotations: ComparisonRow[] }> {
    if (isDemoMode()) {
      const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
      const rfq = rfqs.find(r => r.id === rfqId)
      if (!rfq) throw new Error('RFQ not found')

      const quotations = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)
      const rfqQuotes = quotations.filter(q => q.rfqId === rfqId)

      let minPrice = Infinity
      rfqQuotes.forEach(q => {
        if (q.price < minPrice) minPrice = q.price
      })

      const rows: ComparisonRow[] = rfqQuotes.map(q => ({
        quotationId: q.id,
        vendorId: q.vendorId,
        vendor: q.vendor.name,
        price: q.price,
        deliveryDays: q.deliveryDays,
        notes: q.notes,
        lowestPrice: q.price === minPrice && minPrice !== Infinity,
      }))

      return {
        rfq: { id: rfq.id, title: rfq.title, quantity: rfq.quantity },
        quotations: rows,
      }
    }
    return api.get(`/comparisons/${rfqId}`)
  },

  // ---- Approvals ----
  async listApprovals(): Promise<Approval[]> {
    if (isDemoMode()) {
      return getLocal<Approval[]>(KEYS.approvals, seed.seedApprovals)
    }
    return api.get('/approvals')
  },
  async approve(input: { quotationId: string; status: 'APPROVED' | 'REJECTED'; remarks: string }): Promise<Approval> {
    if (isDemoMode()) {
      const approvals = getLocal<Approval[]>(KEYS.approvals, seed.seedApprovals)
      const quotations = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)
      
      const q = quotations.find(item => item.id === input.quotationId)
      if (!q) throw new Error('Quotation not found')

      const newApproval: Approval = {
        id: `a-${Date.now()}`,
        quotationId: input.quotationId,
        status: input.status,
        remarks: input.remarks,
        approvedBy: 'u-manager',
        createdAt: new Date().toISOString(),
        quotation: {
          vendor: { name: q.vendor.name },
          rfq: { title: q.rfq.title },
          price: q.price,
        }
      }

      approvals.unshift(newApproval)
      setLocal(KEYS.approvals, approvals)

      if (input.status === 'APPROVED') {
        const rfqs = getLocal<Rfq[]>(KEYS.rfqs, seed.seedRfqs)
        const rIdx = rfqs.findIndex(r => r.id === q.rfqId)
        if (rIdx !== -1) {
          rfqs[rIdx].status = 'AWARDED'
          setLocal(KEYS.rfqs, rfqs)
        }
      }

      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: input.status === 'APPROVED' ? 'QUOTATION_APPROVED' : 'QUOTATION_REJECTED',
        message: `${q.vendor.name} quotation ${input.status.toLowerCase()} for ${q.rfq.title}`,
        createdAt: new Date().toISOString(),
        actor: 'Rahul Mehta',
      })
      setLocal(KEYS.activities, acts)

      return newApproval
    }
    return api.post('/approvals', input)
  },

  // ---- Purchase Orders ----
  async listPurchaseOrders(): Promise<PurchaseOrder[]> {
    if (isDemoMode()) {
      return getLocal<PurchaseOrder[]>(KEYS.purchaseOrders, seed.seedPurchaseOrders)
    }
    return api.get('/purchase-orders')
  },
  async generatePO(quotationId: string): Promise<PurchaseOrder> {
    if (isDemoMode()) {
      const pos = getLocal<PurchaseOrder[]>(KEYS.purchaseOrders, seed.seedPurchaseOrders)
      const quotations = getLocal<Quotation[]>(KEYS.quotations, seed.seedQuotations)

      const q = quotations.find(item => item.id === quotationId)
      if (!q) throw new Error('Quotation not found')

      const exists = pos.some(po => po.quotationId === quotationId)
      if (exists) throw new Error('Purchase Order already exists for this quotation')

      const newPo: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber: `PO-2026-${String(pos.length + 1).padStart(3, '0')}`,
        quotationId: quotationId,
        status: 'ISSUED',
        createdAt: new Date().toISOString(),
        quotation: {
          price: q.price,
          deliveryDays: q.deliveryDays,
          vendor: { name: q.vendor.name },
          rfq: { title: q.rfq.title },
        }
      }

      pos.unshift(newPo)
      setLocal(KEYS.purchaseOrders, pos)

      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: 'PO_GENERATED',
        message: `Purchase Order ${newPo.poNumber} issued to ${q.vendor.name}`,
        createdAt: new Date().toISOString(),
        actor: 'Priya Nair',
      })
      setLocal(KEYS.activities, acts)

      return newPo
    }
    return api.post('/purchase-orders', { quotationId })
  },

  // ---- Invoices ----
  async listInvoices(): Promise<Invoice[]> {
    if (isDemoMode()) {
      return getLocal<Invoice[]>(KEYS.invoices, seed.seedInvoices)
    }
    return api.get('/invoices')
  },
  async generateInvoice(purchaseOrderId: string): Promise<Invoice> {
    if (isDemoMode()) {
      const invoices = getLocal<Invoice[]>(KEYS.invoices, seed.seedInvoices)
      const pos = getLocal<PurchaseOrder[]>(KEYS.purchaseOrders, seed.seedPurchaseOrders)

      const po = pos.find(item => item.id === purchaseOrderId)
      if (!po) throw new Error('Purchase Order not found')

      const exists = invoices.some(inv => inv.purchaseOrderId === purchaseOrderId)
      if (exists) throw new Error('Invoice already exists for this Purchase Order')

      const subtotal = po.quotation.price
      const tax = Math.round(subtotal * 0.18)
      const total = subtotal + tax

      const newInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
        purchaseOrderId: purchaseOrderId,
        subtotal,
        tax,
        total,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        purchaseOrder: {
          poNumber: po.poNumber,
          quotation: {
            price: po.quotation.price,
            deliveryDays: po.quotation.deliveryDays,
            vendor: { name: po.quotation.vendor.name }
          }
        }
      }

      invoices.unshift(newInv)
      setLocal(KEYS.invoices, invoices)

      const poIdx = pos.findIndex(item => item.id === purchaseOrderId)
      if (poIdx !== -1) {
        pos[poIdx].status = 'FULFILLED'
        setLocal(KEYS.purchaseOrders, pos)
      }

      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: 'INVOICE_GENERATED',
        message: `Invoice ${newInv.invoiceNumber} generated for ${po.quotation.vendor.name}`,
        createdAt: new Date().toISOString(),
        actor: 'Priya Nair',
      })
      setLocal(KEYS.activities, acts)

      return newInv
    }
    return api.post('/invoices', { purchaseOrderId })
  },
  async downloadInvoicePdf(invoiceId: string): Promise<void> {
    if (isDemoMode()) {
      const invoices = getLocal<Invoice[]>(KEYS.invoices, seed.seedInvoices)
      const inv = invoices.find(i => i.id === invoiceId)
      if (!inv) throw new Error('Invoice not found')
      
      const dummyPdfContent = `VendorBridge Invoice\nInvoice Number: ${inv.invoiceNumber}\nTotal: INR ${inv.total}`
      const blob = new Blob([dummyPdfContent], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${inv.invoiceNumber}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      return
    }
    const response = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response as any]))
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoiceId}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  },
  async sendInvoiceEmail(invoiceId: string, email: string): Promise<void> {
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 600))
      
      const acts = getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
      const invoices = getLocal<Invoice[]>(KEYS.invoices, seed.seedInvoices)
      const inv = invoices.find(i => i.id === invoiceId)
      
      acts.unshift({
        id: `ac-${Date.now()}`,
        type: 'INVOICE_SENT',
        message: `Invoice ${inv?.invoiceNumber || ''} sent to ${email} successfully`,
        createdAt: new Date().toISOString(),
        actor: 'Priya Nair',
      })
      setLocal(KEYS.activities, acts)
      return
    }
    return api.post(`/invoices/${invoiceId}/send-email`, { email })
  },

  // ---- Activities ----
  async listActivities(): Promise<Activity[]> {
    if (isDemoMode()) {
      return getLocal<Activity[]>(KEYS.activities, seed.seedActivities)
    }
    const stats = await api.get('/dashboard/stats') as any
    return stats.recentActivity || []
  },
}

export default api
