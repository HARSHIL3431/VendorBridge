import prisma from '../config/prisma';
import { Prisma, ApprovalStatus, QuotationStatus } from '@prisma/client';

export class ApprovalService {
  async compare(rfqId: string) {
    const rfq = await prisma.rfq.findUnique({
      where: { id: rfqId },
      select: { id: true, title: true, quantity: true },
    });

    if (!rfq) {
      throw { status: 404, message: 'RFQ not found' };
    }

    const quotations = await prisma.quotation.findMany({
      where: { rfqId },
      select: {
        id: true,
        vendorId: true,
        price: true,
        deliveryDays: true,
        notes: true,
        vendor: { select: { name: true } },
      },
      orderBy: { price: 'asc' },
    });

    if (quotations.length === 0) {
      return {
        rfq,
        quotations: [],
      };
    }

    const lowestPrice = Math.min(...quotations.map((q: { price: number }) => q.price));

    const comparisonQuotations = quotations.map((q: { id: string; vendorId: string; vendor: { name: string }; price: number; deliveryDays: number; notes: string | null; }) => ({
      quotationId: q.id,
      vendorId: q.vendorId,
      vendor: q.vendor.name,
      price: q.price,
      deliveryDays: q.deliveryDays,
      notes: q.notes,
      lowestPrice: q.price === lowestPrice,
    }));

    return {
      rfq,
      quotations: comparisonQuotations,
    };
  }

  async list() {
    const approvals = await prisma.approval.findMany({
      select: {
        id: true,
        quotationId: true,
        status: true,
        remarks: true,
        approvedById: true,
        createdAt: true,
        quotation: {
          select: {
            price: true,
            vendor: { select: { name: true } },
            rfq: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map approvedById to approvedBy for API compatibility
    return approvals.map((a: { id: string; quotationId: string; status: ApprovalStatus; remarks: string | null; approvedById: string; createdAt: Date; quotation: { price: number; vendor: { name: string }; rfq: { title: string } } }) => ({
      id: a.id,
      quotationId: a.quotationId,
      status: a.status,
      remarks: a.remarks,
      approvedBy: a.approvedById,
      createdAt: a.createdAt,
      quotation: a.quotation,
    }));
  }

  async getById(id: string) {
    const approval = await prisma.approval.findUnique({
      where: { id },
      select: {
        id: true,
        quotationId: true,
        status: true,
        remarks: true,
        approvedById: true,
        createdAt: true,
        quotation: {
          select: {
            price: true,
            vendor: { select: { name: true } },
            rfq: { select: { title: true } },
          },
        },
      },
    });

    if (!approval) {
      throw { status: 404, message: 'Approval not found' };
    }

    return {
      id: approval.id,
      quotationId: approval.quotationId,
      status: approval.status,
      remarks: approval.remarks,
      approvedBy: approval.approvedById,
      createdAt: approval.createdAt,
      quotation: approval.quotation,
    };
  }

  async create(data: {
    quotationId: string;
    status: string;
    remarks?: string;
    approvedById: string;
  }) {
    // Verify quotation exists
    const quotation = await prisma.quotation.findUnique({
      where: { id: data.quotationId },
    });

    if (!quotation) {
      throw { status: 404, message: 'Quotation not found' };
    }

    // Check for duplicate approval
    const existing = await prisma.approval.findUnique({
      where: { quotationId: data.quotationId },
    });

    if (existing) {
      throw { status: 400, message: 'Quotation is already approved' };
    }

    // Create approval and update quotation status in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const approval = await tx.approval.create({
        data: {
          quotationId: data.quotationId,
          status: data.status as ApprovalStatus,
          remarks: data.remarks,
          approvedById: data.approvedById,
        },
        select: {
          id: true,
          quotationId: true,
          status: true,
          approvedById: true,
        },
      });

      // Update quotation status based on approval
      const quotationStatus: QuotationStatus =
        data.status === 'APPROVED' ? 'ACCEPTED' : 'REJECTED';

      await tx.quotation.update({
        where: { id: data.quotationId },
        data: { status: quotationStatus },
      });

      // If approved, update the RFQ status to AWARDED
      if (data.status === 'APPROVED') {
        await tx.rfq.update({
          where: { id: quotation.rfqId },
          data: { status: 'AWARDED' },
        });
      }

      return {
        id: approval.id,
        quotationId: approval.quotationId,
        status: approval.status,
        approvedBy: approval.approvedById,
      };
    });

    return result;
  }
}

export const approvalService = new ApprovalService();
