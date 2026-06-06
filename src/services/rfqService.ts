import prisma from '../config/prisma';
import { Prisma, RfqStatus } from '@prisma/client';

export class RfqService {
  async list(userRole?: string, userId?: string) {
    // VENDOR sees only RFQs they have submitted quotations for
    if (userRole === 'VENDOR') {
      const quotations = await prisma.quotation.findMany({
        where: { userId },
        select: { rfqId: true },
      });
      const rfqIds = quotations.map((q: { rfqId: string }) => q.rfqId);

      return prisma.rfq.findMany({
        where: { id: { in: rfqIds } },
        select: {
          id: true,
          title: true,
          description: true,
          quantity: true,
          deadline: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.rfq.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        quantity: true,
        deadline: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const rfq = await prisma.rfq.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        quantity: true,
        deadline: true,
        status: true,
        createdAt: true,
        quotations: {
          select: {
            id: true,
            rfqId: true,
            vendorId: true,
            price: true,
            deliveryDays: true,
            notes: true,
            createdAt: true,
            vendor: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!rfq) {
      throw { status: 404, message: 'RFQ not found' };
    }

    return rfq;
  }

  async create(data: {
    title: string;
    description: string;
    quantity: number;
    deadline: string;
  }) {
    const rfq = await prisma.rfq.create({
      data: {
        title: data.title,
        description: data.description,
        quantity: data.quantity,
        deadline: new Date(data.deadline),
        status: 'OPEN',
      },
      select: {
        id: true,
        title: true,
        description: true,
        quantity: true,
        deadline: true,
        status: true,
        createdAt: true,
      },
    });

    return rfq;
  }

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    quantity: number;
    deadline: string;
    status: string;
  }>) {
    const rfq = await prisma.rfq.findUnique({ where: { id } });

    if (!rfq) {
      throw { status: 404, message: 'RFQ not found' };
    }

    if (rfq.status === 'CLOSED' || rfq.status === 'AWARDED') {
      throw { status: 400, message: `Cannot update RFQ with status ${rfq.status}` };
    }

    const updateData: Prisma.RfqUpdateInput = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.quantity) updateData.quantity = data.quantity;
    if (data.deadline) updateData.deadline = new Date(data.deadline);
    if (data.status) updateData.status = data.status as RfqStatus;

    const updated = await prisma.rfq.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        quantity: true,
        deadline: true,
        status: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async delete(id: string) {
    const rfq = await prisma.rfq.findUnique({
      where: { id },
      include: { quotations: { select: { id: true }, take: 1 } },
    });

    if (!rfq) {
      throw { status: 404, message: 'RFQ not found' };
    }

    if (rfq.quotations.length > 0) {
      throw { status: 400, message: 'Cannot delete RFQ with submitted quotations' };
    }

    await prisma.rfq.delete({ where: { id } });
  }
}

export const rfqService = new RfqService();
