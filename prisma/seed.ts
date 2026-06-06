import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean up existing data in reverse dependency order
  await prisma.invoice.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.rfq.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  console.log('  Cleaned existing data');

  // ─── Users ─────────────────────────────────────────────
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedOfficer = await bcrypt.hash('officer123', 10);
  const hashedManager = await bcrypt.hash('manager123', 10);
  const hashedVendor = await bcrypt.hash('vendor123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@vendorbridge.com',
      password: hashedAdmin,
      role: 'ADMIN',
    },
  });

  const officer = await prisma.user.create({
    data: {
      name: 'Procurement Officer',
      email: 'officer@vendorbridge.com',
      password: hashedOfficer,
      role: 'PROCUREMENT_OFFICER',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@vendorbridge.com',
      password: hashedManager,
      role: 'MANAGER',
    },
  });

  const vendor1User = await prisma.user.create({
    data: {
      name: 'Vendor One',
      email: 'vendor1@test.com',
      password: hashedVendor,
      role: 'VENDOR',
    },
  });

  const vendor2User = await prisma.user.create({
    data: {
      name: 'Vendor Two',
      email: 'vendor2@test.com',
      password: hashedVendor,
      role: 'VENDOR',
    },
  });

  const vendor3User = await prisma.user.create({
    data: {
      name: 'Vendor Three',
      email: 'vendor3@test.com',
      password: hashedVendor,
      role: 'VENDOR',
    },
  });

  console.log('  ✓ Created 6 users');

  // ─── Vendors (10) ─────────────────────────────────────
  const vendorsData = [
    { name: 'ABC Suppliers', email: 'abc@supplier.com', phone: '9876543210', gstNumber: '22AAAAA0000A1Z5', category: 'Electronics', status: 'ACTIVE' as const },
    { name: 'XYZ Technologies', email: 'xyz@tech.com', phone: '9876543211', gstNumber: '22BBBBB0000B1Z6', category: 'Electronics', status: 'ACTIVE' as const },
    { name: 'MegaCorp Solutions', email: 'mega@corp.com', phone: '9876543212', gstNumber: '22CCCCC0000C1Z7', category: 'IT Services', status: 'ACTIVE' as const },
    { name: 'Prime Office Supplies', email: 'prime@office.com', phone: '9876543213', gstNumber: '22DDDDD0000D1Z8', category: 'Office Supplies', status: 'ACTIVE' as const },
    { name: 'Global Traders', email: 'global@traders.com', phone: '9876543214', gstNumber: '22EEEEE0000E1Z9', category: 'General', status: 'ACTIVE' as const },
    { name: 'QuickServe Ltd', email: 'quick@serve.com', phone: '9876543215', gstNumber: '22FFFFF0000F1Z0', category: 'IT Services', status: 'ACTIVE' as const },
    { name: 'StarTech Industries', email: 'star@tech.com', phone: '9876543216', gstNumber: '22GGGGG0000G1Z1', category: 'Electronics', status: 'ACTIVE' as const },
    { name: 'ValueMax Vendors', email: 'value@max.com', phone: '9876543217', gstNumber: '22HHHHH0000H1Z2', category: 'General', status: 'INACTIVE' as const },
    { name: 'EcoPack Solutions', email: 'eco@pack.com', phone: '9876543218', gstNumber: '22IIIII0000I1Z3', category: 'Packaging', status: 'ACTIVE' as const },
    { name: 'NexGen Supplies', email: 'nex@gen.com', phone: '9876543219', gstNumber: '22JJJJJ0000J1Z4', category: 'Electronics', status: 'ACTIVE' as const },
  ];

  const vendors = [];
  for (const v of vendorsData) {
    const vendor = await prisma.vendor.create({ data: v });
    vendors.push(vendor);
  }

  console.log('  ✓ Created 10 vendors');

  // ─── RFQs (5) ─────────────────────────────────────────
  const rfqsData = [
    { title: 'Laptop Procurement', description: 'Need 50 laptops for new office', quantity: 50, deadline: new Date('2026-07-20'), status: 'OPEN' as const },
    { title: 'Office Furniture', description: 'Desks and chairs for 30 employees', quantity: 30, deadline: new Date('2026-07-15'), status: 'OPEN' as const },
    { title: 'Network Equipment', description: 'Routers, switches, and cables', quantity: 20, deadline: new Date('2026-07-25'), status: 'OPEN' as const },
    { title: 'Printer Supplies', description: 'Toner cartridges and paper', quantity: 100, deadline: new Date('2026-08-01'), status: 'OPEN' as const },
    { title: 'Server Hardware', description: 'Rack servers for data center', quantity: 5, deadline: new Date('2026-08-10'), status: 'AWARDED' as const },
  ];

  const rfqs = [];
  for (const r of rfqsData) {
    const rfq = await prisma.rfq.create({ data: r });
    rfqs.push(rfq);
  }

  console.log('  ✓ Created 5 RFQs');

  // ─── Quotations (15) ──────────────────────────────────
  const quotationsData = [
    // RFQ 1: Laptop Procurement — 3 quotations
    { rfqId: rfqs[0].id, vendorId: vendors[0].id, userId: vendor1User.id, price: 85000, deliveryDays: 7, notes: 'Fast delivery guaranteed' },
    { rfqId: rfqs[0].id, vendorId: vendors[1].id, userId: vendor2User.id, price: 90000, deliveryDays: 5, notes: 'Premium quality laptops' },
    { rfqId: rfqs[0].id, vendorId: vendors[2].id, userId: vendor3User.id, price: 82000, deliveryDays: 10, notes: 'Best price in market' },

    // RFQ 2: Office Furniture — 3 quotations
    { rfqId: rfqs[1].id, vendorId: vendors[3].id, userId: vendor1User.id, price: 45000, deliveryDays: 14, notes: 'Ergonomic furniture' },
    { rfqId: rfqs[1].id, vendorId: vendors[4].id, userId: vendor2User.id, price: 42000, deliveryDays: 10, notes: 'Bulk discount available' },
    { rfqId: rfqs[1].id, vendorId: vendors[5].id, userId: vendor3User.id, price: 48000, deliveryDays: 7, notes: 'Premium materials' },

    // RFQ 3: Network Equipment — 3 quotations
    { rfqId: rfqs[2].id, vendorId: vendors[0].id, userId: vendor1User.id, price: 120000, deliveryDays: 5, notes: 'Cisco equipment' },
    { rfqId: rfqs[2].id, vendorId: vendors[6].id, userId: vendor2User.id, price: 115000, deliveryDays: 7, notes: 'Enterprise grade' },
    { rfqId: rfqs[2].id, vendorId: vendors[9].id, userId: vendor3User.id, price: 110000, deliveryDays: 12, notes: 'Budget friendly option' },

    // RFQ 4: Printer Supplies — 3 quotations
    { rfqId: rfqs[3].id, vendorId: vendors[3].id, userId: vendor1User.id, price: 15000, deliveryDays: 3, notes: 'Original cartridges' },
    { rfqId: rfqs[3].id, vendorId: vendors[8].id, userId: vendor2User.id, price: 12000, deliveryDays: 5, notes: 'Compatible cartridges' },
    { rfqId: rfqs[3].id, vendorId: vendors[4].id, userId: vendor3User.id, price: 13500, deliveryDays: 4, notes: 'Mixed options available' },

    // RFQ 5: Server Hardware — 3 quotations (AWARDED RFQ)
    { rfqId: rfqs[4].id, vendorId: vendors[0].id, userId: vendor1User.id, price: 500000, deliveryDays: 14, notes: 'Dell PowerEdge servers', status: 'ACCEPTED' as const },
    { rfqId: rfqs[4].id, vendorId: vendors[1].id, userId: vendor2User.id, price: 520000, deliveryDays: 10, notes: 'HP ProLiant servers', status: 'REJECTED' as const },
    { rfqId: rfqs[4].id, vendorId: vendors[6].id, userId: vendor3User.id, price: 480000, deliveryDays: 21, notes: 'Supermicro servers', status: 'REJECTED' as const },
  ];

  const quotations = [];
  for (const q of quotationsData) {
    const quotation = await prisma.quotation.create({
      data: {
        rfqId: q.rfqId,
        vendorId: q.vendorId,
        userId: q.userId,
        price: q.price,
        deliveryDays: q.deliveryDays,
        notes: q.notes,
        status: (q as any).status || 'PENDING',
      },
    });
    quotations.push(quotation);
  }

  console.log('  ✓ Created 15 quotations');

  // ─── Approvals (3) — for RFQ 5's quotations ──────────
  // The winning quotation for RFQ 5 (Server Hardware): vendors[0] at 500k
  const approval1 = await prisma.approval.create({
    data: {
      quotationId: quotations[12].id, // Server hardware — vendor[0] — ACCEPTED
      status: 'APPROVED',
      remarks: 'Best value for money — Dell servers approved',
      approvedById: manager.id,
    },
  });

  const approval2 = await prisma.approval.create({
    data: {
      quotationId: quotations[13].id, // Server hardware — vendor[1] — REJECTED
      status: 'REJECTED',
      remarks: 'Price too high compared to alternatives',
      approvedById: manager.id,
    },
  });

  const approval3 = await prisma.approval.create({
    data: {
      quotationId: quotations[14].id, // Server hardware — vendor[6] — REJECTED
      status: 'REJECTED',
      remarks: 'Delivery timeline too long',
      approvedById: manager.id,
    },
  });

  console.log('  ✓ Created 3 approvals');

  // ─── Purchase Orders (3) ──────────────────────────────
  const po1 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-001',
      quotationId: quotations[12].id,
      status: 'ISSUED',
    },
  });


  console.log('  ℹ Creating additional approvals & POs for seed completeness...');

  // For a complete seed, let's approve some more quotations and create POs for them
  // First, approve quotation for RFQ 1 (Laptop — vendor[2] at 82k, cheapest)
  await prisma.quotation.update({
    where: { id: quotations[2].id },
    data: { status: 'ACCEPTED' },
  });

  const approval4 = await prisma.approval.create({
    data: {
      quotationId: quotations[2].id,
      status: 'APPROVED',
      remarks: 'Best price for laptops',
      approvedById: manager.id,
    },
  });

  await prisma.rfq.update({
    where: { id: rfqs[0].id },
    data: { status: 'AWARDED' },
  });

  // Approve quotation for RFQ 2 (Office Furniture — vendor[4] at 42k, cheapest)
  await prisma.quotation.update({
    where: { id: quotations[4].id },
    data: { status: 'ACCEPTED' },
  });

  const approval5 = await prisma.approval.create({
    data: {
      quotationId: quotations[4].id,
      status: 'APPROVED',
      remarks: 'Bulk discount makes this the best option',
      approvedById: manager.id,
    },
  });

  await prisma.rfq.update({
    where: { id: rfqs[1].id },
    data: { status: 'AWARDED' },
  });

  const po2 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-002',
      quotationId: quotations[2].id,
      status: 'ISSUED',
    },
  });

  const po3 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-003',
      quotationId: quotations[4].id,
      status: 'ISSUED',
    },
  });

  console.log('  ✓ Created 3 purchase orders');

  // ─── Invoices (3) ─────────────────────────────────────
  const invoicesData = [
    { invoiceNumber: 'INV-2026-001', purchaseOrderId: po1.id, subtotal: 500000 },
    { invoiceNumber: 'INV-2026-002', purchaseOrderId: po2.id, subtotal: 82000 },
    { invoiceNumber: 'INV-2026-003', purchaseOrderId: po3.id, subtotal: 42000 },
  ];

  for (const inv of invoicesData) {
    const tax = Math.round(inv.subtotal * 0.18 * 100) / 100;
    const total = Math.round((inv.subtotal + tax) * 100) / 100;

    await prisma.invoice.create({
      data: {
        invoiceNumber: inv.invoiceNumber,
        purchaseOrderId: inv.purchaseOrderId,
        subtotal: inv.subtotal,
        tax,
        total,
        status: 'PENDING',
      },
    });
  }

  console.log('  ✓ Created 3 invoices');

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('  Admin:    admin@vendorbridge.com / admin123');
  console.log('  Officer:  officer@vendorbridge.com / officer123');
  console.log('  Manager:  manager@vendorbridge.com / manager123');
  console.log('  Vendor 1: vendor1@test.com / vendor123');
  console.log('  Vendor 2: vendor2@test.com / vendor123');
  console.log('  Vendor 3: vendor3@test.com / vendor123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
