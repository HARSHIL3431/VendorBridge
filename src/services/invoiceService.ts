import prisma from '../config/prisma';
import { generateInvoicePdf } from '../utils/pdfGenerator';
import { sendInvoiceEmail } from '../utils/emailService';

export class InvoiceService {
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count({
      where: {
        invoiceNumber: { startsWith: `INV-${year}` },
      },
    });
    const num = String(count + 1).padStart(3, '0');
    return `INV-${year}-${num}`;
  }

  async list() {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        invoiceNumber: true,
        purchaseOrderId: true,
        subtotal: true,
        tax: true,
        total: true,
        status: true,
        createdAt: true,
        purchaseOrder: {
          select: {
            poNumber: true,
            quotation: {
              select: {
                vendor: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invoices;
  }

  async getById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        invoiceNumber: true,
        purchaseOrderId: true,
        subtotal: true,
        tax: true,
        total: true,
        status: true,
        createdAt: true,
        purchaseOrder: {
          select: {
            poNumber: true,
            quotation: {
              select: {
                vendor: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw { status: 404, message: 'Invoice not found' };
    }

    return invoice;
  }

  async create(purchaseOrderId: string) {
    // Verify PO exists
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { quotation: true },
    });

    if (!po) {
      throw { status: 404, message: 'Purchase Order not found' };
    }

    // One invoice per PO
    const existingInvoice = await prisma.invoice.findUnique({
      where: { purchaseOrderId },
    });

    if (existingInvoice) {
      throw { status: 400, message: 'Invoice already exists for this Purchase Order' };
    }

    const subtotal = po.quotation.price;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        purchaseOrderId,
        subtotal,
        tax,
        total,
        status: 'PENDING',
      },
      select: {
        id: true,
        invoiceNumber: true,
        subtotal: true,
        tax: true,
        total: true,
        status: true,
      },
    });

    return invoice;
  }

  async generatePdf(id: string): Promise<Buffer> {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: {
            quotation: {
              include: {
                vendor: true,
                rfq: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw { status: 404, message: 'Invoice not found' };
    }

    const pdfBytes = await generateInvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.createdAt,
      vendorName: invoice.purchaseOrder.quotation.vendor.name,
      gstNumber: invoice.purchaseOrder.quotation.vendor.gstNumber,
      rfqTitle: invoice.purchaseOrder.quotation.rfq.title,
      quantity: invoice.purchaseOrder.quotation.rfq.quantity,
      poNumber: invoice.purchaseOrder.poNumber,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
    });

    return Buffer.from(pdfBytes);
  }

  async sendEmail(id: string, recipientEmail: string) {
    const pdfBuffer = await this.generatePdf(id);

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: { invoiceNumber: true },
    });

    if (!invoice) {
      throw { status: 404, message: 'Invoice not found' };
    }

    await sendInvoiceEmail({
      to: recipientEmail,
      invoiceNumber: invoice.invoiceNumber,
      pdfBuffer,
    });

    // Update invoice status to SENT
    await prisma.invoice.update({
      where: { id },
      data: { status: 'SENT' },
    });

    return recipientEmail;
  }
}

export const invoiceService = new InvoiceService();
