import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class QuotationService {
  async list(filters: { rfqId?: string; vendorId?: string }) {
    const where: Prisma.QuotationWhereInput = {};
    if (filters.rfqId) where.rfqId = filters.rfqId;
    if (filters.vendorId) where.vendorId = filters.vendorId;

    const quotations = await prisma.quotation.findMany({
      where,
      select: {
        id: true,
        rfqId: true,
        vendorId: true,
        price: true,
        deliveryDays: true,
        notes: true,
        createdAt: true,
        vendor: { select: { id: true, name: true } },
        rfq: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return quotations;
  }

  async getById(id: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      select: {
        id: true,
        rfqId: true,
        vendorId: true,
        price: true,
        deliveryDays: true,
        notes: true,
        createdAt: true,
        vendor: { select: { id: true, name: true } },
        rfq: { select: { id: true, title: true } },
      },
    });

    if (!quotation) {
      throw { status: 404, message: 'Quotation not found' };
    }

    return quotation;
  }

  async create(data: {
    rfqId: string;
    vendorId: string;
    userId: string;
    price: number;
    deliveryDays: number;
    notes?: string;
  }) {
    // Verify RFQ exists and is OPEN
    const rfq = await prisma.rfq.findUnique({ where: { id: data.rfqId } });
    if (!rfq) {
      throw { status: 404, message: 'RFQ not found' };
    }
    if (rfq.status !== 'OPEN') {
      throw { status: 400, message: 'Cannot submit quotation for a non-OPEN RFQ' };
    }

    // Verify vendor exists
    const vendor = await prisma.vendor.findUnique({ where: { id: data.vendorId } });
    if (!vendor) {
      throw { status: 404, message: 'Vendor not found' };
    }

    // Check one quotation per vendor per RFQ
    const existing = await prisma.quotation.findUnique({
      where: { rfqId_vendorId: { rfqId: data.rfqId, vendorId: data.vendorId } },
    });
    if (existing) {
      throw { status: 400, message: 'Vendor has already submitted a quotation for this RFQ' };
    }

    const quotation = await prisma.quotation.create({
      data: {
        rfqId: data.rfqId,
        vendorId: data.vendorId,
        userId: data.userId,
        price: data.price,
        deliveryDays: data.deliveryDays,
        notes: data.notes,
      },
      select: {
        id: true,
        rfqId: true,
        vendorId: true,
        price: true,
        deliveryDays: true,
        notes: true,
        createdAt: true,
        vendor: { select: { id: true, name: true } },
        rfq: { select: { id: true, title: true } },
      },
    });

    return quotation;
  }

  async update(id: string, userId: string, data: Partial<{
    price: number;
    deliveryDays: number;
    notes: string;
  }>) {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { rfq: { select: { status: true } } },
    });

    if (!quotation) {
      throw { status: 404, message: 'Quotation not found' };
    }

    // Verify ownership
    if (quotation.userId !== userId) {
      throw { status: 403, message: 'You can only update your own quotations' };
    }

    // RFQ must be OPEN
    if (quotation.rfq.status !== 'OPEN') {
      throw { status: 400, message: 'Cannot update quotation — RFQ is no longer OPEN' };
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data,
      select: {
        id: true,
        rfqId: true,
        vendorId: true,
        price: true,
        deliveryDays: true,
        notes: true,
        createdAt: true,
        vendor: { select: { id: true, name: true } },
        rfq: { select: { id: true, title: true } },
      },
    });

    return updated;
  }
}

export const quotationService = new QuotationService();
