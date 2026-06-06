import prisma from '../config/prisma';

export class PurchaseOrderService {
  private async generatePoNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.purchaseOrder.count({
      where: {
        poNumber: { startsWith: `PO-${year}` },
      },
    });
    const num = String(count + 1).padStart(3, '0');
    return `PO-${year}-${num}`;
  }

  async list() {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      select: {
        id: true,
        poNumber: true,
        quotationId: true,
        status: true,
        createdAt: true,
        quotation: {
          select: {
            price: true,
            deliveryDays: true,
            vendor: { select: { name: true } },
            rfq: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return purchaseOrders;
  }

  async getById(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      select: {
        id: true,
        poNumber: true,
        quotationId: true,
        status: true,
        createdAt: true,
        quotation: {
          select: {
            price: true,
            deliveryDays: true,
            vendor: { select: { name: true } },
            rfq: { select: { title: true } },
          },
        },
      },
    });

    if (!po) {
      throw { status: 404, message: 'Purchase Order not found' };
    }

    return po;
  }

  async create(quotationId: string) {
    // Verify quotation exists
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { approval: true },
    });

    if (!quotation) {
      throw { status: 404, message: 'Quotation not found' };
    }

    // Must have approved approval
    if (!quotation.approval || quotation.approval.status !== 'APPROVED') {
      throw { status: 400, message: 'Quotation has not been approved' };
    }

    // One PO per quotation
    const existingPo = await prisma.purchaseOrder.findUnique({
      where: { quotationId },
    });

    if (existingPo) {
      throw { status: 400, message: 'Purchase Order already exists for this quotation' };
    }

    const poNumber = await this.generatePoNumber();

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        quotationId,
        status: 'ISSUED',
      },
      select: {
        id: true,
        poNumber: true,
        status: true,
      },
    });

    return po;
  }
}

export const purchaseOrderService = new PurchaseOrderService();
