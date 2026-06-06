import type {
  Activity,
  Approval,
  Invoice,
  PurchaseOrder,
  Quotation,
  Rfq,
  User,
  Vendor,
} from './types'

// ---- Users (matches documented seed credentials) ----
export const seedUsers: (User & { password: string })[] = [
  {
    id: 'u-admin',
    name: 'Admin User',
    email: 'admin@vendorbridge.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    id: 'u-officer',
    name: 'Priya Nair',
    email: 'officer@vendorbridge.com',
    password: 'officer123',
    role: 'PROCUREMENT_OFFICER',
  },
  {
    id: 'u-manager',
    name: 'Rahul Mehta',
    email: 'manager@vendorbridge.com',
    password: 'manager123',
    role: 'MANAGER',
  },
  {
    id: 'u-vendor1',
    name: 'ABC Suppliers',
    email: 'vendor1@test.com',
    password: 'vendor123',
    role: 'VENDOR',
    vendorId: 'v-1',
  },
]

const categories = [
  'Electronics',
  'Office Supplies',
  'Furniture',
  'IT Services',
  'Logistics',
  'Catering',
]

export const seedVendors: Vendor[] = [
  { id: 'v-1', name: 'ABC Suppliers', email: 'abc@supplier.com', phone: '9876543210', gstNumber: '22AAAAA0000A1Z5', category: 'Electronics', status: 'ACTIVE' },
  { id: 'v-2', name: 'XYZ Ltd', email: 'sales@xyz.com', phone: '9811122233', gstNumber: '27BBBBB1111B2Z4', category: 'Electronics', status: 'ACTIVE' },
  { id: 'v-3', name: 'Nova Office Mart', email: 'hello@novaoffice.com', phone: '9900011122', gstNumber: '29CCCCC2222C3Z3', category: 'Office Supplies', status: 'ACTIVE' },
  { id: 'v-4', name: 'Greenline Furniture', email: 'orders@greenline.com', phone: '9000022211', gstNumber: '24DDDDD3333D4Z2', category: 'Furniture', status: 'ACTIVE' },
  { id: 'v-5', name: 'ByteForge IT', email: 'contact@byteforge.io', phone: '9123456780', gstNumber: '07EEEEE4444E5Z1', category: 'IT Services', status: 'ACTIVE' },
  { id: 'v-6', name: 'SwiftCargo Logistics', email: 'ops@swiftcargo.com', phone: '9345678123', gstNumber: '19FFFFF5555F6Z9', category: 'Logistics', status: 'INACTIVE' },
  { id: 'v-7', name: 'Spice Route Catering', email: 'book@spiceroute.com', phone: '9876501234', gstNumber: '33GGGGG6666G7Z8', category: 'Catering', status: 'ACTIVE' },
  { id: 'v-8', name: 'PrimeTech Distributors', email: 'sales@primetech.com', phone: '9988776655', gstNumber: '36HHHHH7777H8Z7', category: 'Electronics', status: 'ACTIVE' },
  { id: 'v-9', name: 'Urban Supplies Co', email: 'info@urbansupplies.com', phone: '9090909090', gstNumber: '21IIIII8888I9Z6', category: 'Office Supplies', status: 'BLACKLISTED' },
  { id: 'v-10', name: 'Apex Solutions', email: 'team@apexsol.com', phone: '9456123780', gstNumber: '06JJJJJ9999J1Z5', category: 'IT Services', status: 'ACTIVE' },
]

export const seedRfqs: Rfq[] = [
  { id: 'r-1', title: 'Laptop Procurement', description: 'Need 50 laptops for the new Bangalore office. Min spec: i5, 16GB RAM, 512GB SSD.', quantity: 50, deadline: '2026-06-20T00:00:00.000Z', status: 'OPEN', createdAt: '2026-06-01T10:00:00.000Z' },
  { id: 'r-2', title: 'Ergonomic Office Chairs', description: 'Supply of 120 ergonomic mesh chairs with lumbar support.', quantity: 120, deadline: '2026-06-18T00:00:00.000Z', status: 'OPEN', createdAt: '2026-06-02T09:30:00.000Z' },
  { id: 'r-3', title: 'Annual IT Support Contract', description: 'Managed IT support for 200 endpoints, 24x7 coverage.', quantity: 1, deadline: '2026-06-12T00:00:00.000Z', status: 'CLOSED', createdAt: '2026-05-20T08:00:00.000Z' },
  { id: 'r-4', title: 'Quarterly Catering', description: 'Catering for monthly all-hands, ~300 people each session.', quantity: 3, deadline: '2026-06-25T00:00:00.000Z', status: 'OPEN', createdAt: '2026-06-04T14:00:00.000Z' },
  { id: 'r-5', title: 'Network Switches', description: 'Procure 24-port managed gigabit switches.', quantity: 18, deadline: '2026-06-10T00:00:00.000Z', status: 'AWARDED', createdAt: '2026-05-15T11:00:00.000Z' },
]

function q(
  id: string,
  rfqId: string,
  rfqTitle: string,
  vendorId: string,
  vendorName: string,
  price: number,
  deliveryDays: number,
  notes: string,
  createdAt: string,
): Quotation {
  return {
    id,
    rfqId,
    vendorId,
    price,
    deliveryDays,
    notes,
    createdAt,
    vendor: { id: vendorId, name: vendorName },
    rfq: { id: rfqId, title: rfqTitle },
  }
}

export const seedQuotations: Quotation[] = [
  // RFQ 1 — Laptops
  q('q-1', 'r-1', 'Laptop Procurement', 'v-1', 'ABC Suppliers', 4250000, 7, 'Fast delivery guaranteed, 3yr warranty', '2026-06-05T08:00:00.000Z'),
  q('q-2', 'r-1', 'Laptop Procurement', 'v-2', 'XYZ Ltd', 4500000, 5, 'Faster delivery, premium support', '2026-06-05T09:10:00.000Z'),
  q('q-3', 'r-1', 'Laptop Procurement', 'v-8', 'PrimeTech Distributors', 4380000, 6, 'Includes accidental damage cover', '2026-06-05T10:20:00.000Z'),
  // RFQ 2 — Chairs
  q('q-4', 'r-2', 'Ergonomic Office Chairs', 'v-4', 'Greenline Furniture', 960000, 12, 'Assembly included on site', '2026-06-06T08:30:00.000Z'),
  q('q-5', 'r-2', 'Ergonomic Office Chairs', 'v-3', 'Nova Office Mart', 1020000, 9, 'Faster delivery, 5yr warranty', '2026-06-06T09:00:00.000Z'),
  q('q-6', 'r-2', 'Ergonomic Office Chairs', 'v-9', 'Urban Supplies Co', 888000, 18, 'Lowest cost, longer lead time', '2026-06-06T11:00:00.000Z'),
  // RFQ 3 — IT support (closed)
  q('q-7', 'r-3', 'Annual IT Support Contract', 'v-5', 'ByteForge IT', 1800000, 1, 'Dedicated onsite engineer', '2026-05-22T08:00:00.000Z'),
  q('q-8', 'r-3', 'Annual IT Support Contract', 'v-10', 'Apex Solutions', 1650000, 1, 'Remote-first, SLA 30min', '2026-05-22T10:00:00.000Z'),
  // RFQ 4 — Catering
  q('q-9', 'r-4', 'Quarterly Catering', 'v-7', 'Spice Route Catering', 540000, 2, 'Veg + non-veg, live counters', '2026-06-06T12:00:00.000Z'),
  // RFQ 5 — Switches (awarded)
  q('q-10', 'r-5', 'Network Switches', 'v-2', 'XYZ Ltd', 432000, 4, 'Enterprise grade, lifetime warranty', '2026-05-16T08:00:00.000Z'),
  q('q-11', 'r-5', 'Network Switches', 'v-8', 'PrimeTech Distributors', 450000, 3, 'Stocked locally', '2026-05-16T09:30:00.000Z'),
  q('q-12', 'r-5', 'Network Switches', 'v-1', 'ABC Suppliers', 468000, 6, 'Bulk discount applied', '2026-05-16T10:30:00.000Z'),
  // Extra spread
  q('q-13', 'r-1', 'Laptop Procurement', 'v-10', 'Apex Solutions', 4600000, 4, 'Same-week delivery', '2026-06-05T12:00:00.000Z'),
  q('q-14', 'r-2', 'Ergonomic Office Chairs', 'v-1', 'ABC Suppliers', 1005000, 10, 'Custom upholstery options', '2026-06-06T13:00:00.000Z'),
  q('q-15', 'r-4', 'Quarterly Catering', 'v-3', 'Nova Office Mart', 600000, 2, 'Premium menu with desserts', '2026-06-06T14:30:00.000Z'),
]

export const seedApprovals: Approval[] = [
  {
    id: 'a-1',
    quotationId: 'q-10',
    status: 'APPROVED',
    remarks: 'Best value for money, lifetime warranty',
    approvedBy: 'u-manager',
    createdAt: '2026-05-18T09:00:00.000Z',
    quotation: { vendor: { name: 'XYZ Ltd' }, rfq: { title: 'Network Switches' }, price: 432000 },
  },
  {
    id: 'a-2',
    quotationId: 'q-8',
    status: 'APPROVED',
    remarks: 'Strong SLA, lower cost',
    approvedBy: 'u-manager',
    createdAt: '2026-05-24T15:00:00.000Z',
    quotation: { vendor: { name: 'Apex Solutions' }, rfq: { title: 'Annual IT Support Contract' }, price: 1650000 },
  },
  {
    id: 'a-3',
    quotationId: 'q-13',
    status: 'REJECTED',
    remarks: 'Price above approved budget',
    approvedBy: 'u-manager',
    createdAt: '2026-06-05T16:00:00.000Z',
    quotation: { vendor: { name: 'Apex Solutions' }, rfq: { title: 'Laptop Procurement' }, price: 4600000 },
  },
]

export const seedPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-001',
    quotationId: 'q-10',
    status: 'ISSUED',
    createdAt: '2026-05-18T10:00:00.000Z',
    quotation: { price: 432000, deliveryDays: 4, vendor: { name: 'XYZ Ltd' }, rfq: { title: 'Network Switches' } },
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-002',
    quotationId: 'q-8',
    status: 'FULFILLED',
    createdAt: '2026-05-25T10:00:00.000Z',
    quotation: { price: 1650000, deliveryDays: 1, vendor: { name: 'Apex Solutions' }, rfq: { title: 'Annual IT Support Contract' } },
  },
]

export const seedInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    purchaseOrderId: 'po-1',
    subtotal: 432000,
    tax: 77760,
    total: 509760,
    status: 'PAID',
    createdAt: '2026-05-19T11:00:00.000Z',
    purchaseOrder: { poNumber: 'PO-2026-001', quotation: { price: 432000, deliveryDays: 4, vendor: { name: 'XYZ Ltd' } } },
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    purchaseOrderId: 'po-2',
    subtotal: 1650000,
    tax: 297000,
    total: 1947000,
    status: 'PENDING',
    createdAt: '2026-05-26T11:00:00.000Z',
    purchaseOrder: { poNumber: 'PO-2026-002', quotation: { price: 1650000, deliveryDays: 1, vendor: { name: 'Apex Solutions' } } },
  },
]

export const seedActivities: Activity[] = [
  { id: 'ac-1', type: 'INVOICE_GENERATED', message: 'Invoice INV-2026-002 generated for Apex Solutions', createdAt: '2026-05-26T11:00:00.000Z', actor: 'Priya Nair' },
  { id: 'ac-2', type: 'PO_GENERATED', message: 'Purchase Order PO-2026-002 issued to Apex Solutions', createdAt: '2026-05-25T10:00:00.000Z', actor: 'Priya Nair' },
  { id: 'ac-3', type: 'QUOTATION_APPROVED', message: 'Apex Solutions quotation approved for IT Support Contract', createdAt: '2026-05-24T15:00:00.000Z', actor: 'Rahul Mehta' },
  { id: 'ac-4', type: 'QUOTATION_REJECTED', message: 'Apex Solutions quotation rejected for Laptop Procurement', createdAt: '2026-06-05T16:00:00.000Z', actor: 'Rahul Mehta' },
  { id: 'ac-5', type: 'QUOTATION_SUBMITTED', message: 'Spice Route Catering submitted a quotation for Quarterly Catering', createdAt: '2026-06-06T12:00:00.000Z', actor: 'Spice Route Catering' },
  { id: 'ac-6', type: 'RFQ_CREATED', message: 'Quarterly Catering RFQ created', createdAt: '2026-06-04T14:00:00.000Z', actor: 'Priya Nair' },
  { id: 'ac-7', type: 'VENDOR_CREATED', message: 'Apex Solutions added to vendor directory', createdAt: '2026-06-03T09:00:00.000Z', actor: 'Admin User' },
  { id: 'ac-8', type: 'RFQ_CREATED', message: 'Laptop Procurement RFQ created', createdAt: '2026-06-01T10:00:00.000Z', actor: 'Priya Nair' },
]

export { categories }
