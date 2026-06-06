import prisma from '../config/prisma';
import { Prisma, VendorStatus } from '@prisma/client';

export class VendorService {
  async list(filters: { status?: string; category?: string; search?: string }) {
    const where: Prisma.VendorWhereInput = {};

    if (filters.status) {
      where.status = filters.status as VendorStatus;
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const vendors = await prisma.vendor.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstNumber: true,
        category: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return vendors;
  }

  async getById(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstNumber: true,
        category: true,
        status: true,
      },
    });

    if (!vendor) {
      throw { status: 404, message: 'Vendor not found' };
    }

    return vendor;
  }

  async create(data: {
    name: string;
    email: string;
    phone: string;
    gstNumber: string;
    category: string;
    status?: string;
  }) {
    const existing = await prisma.vendor.findUnique({ where: { email: data.email } });
    if (existing) {
      throw { status: 400, message: 'Vendor with this email already exists' };
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gstNumber: data.gstNumber,
        category: data.category,
        status: (data.status as VendorStatus) || 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstNumber: true,
        category: true,
        status: true,
      },
    });

    return vendor;
  }

  async update(id: string, data: Partial<{
    name: string;
    email: string;
    phone: string;
    gstNumber: string;
    category: string;
    status: string;
  }>) {
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw { status: 404, message: 'Vendor not found' };
    }

    const { status, ...rest } = data;
    const updateData: Prisma.VendorUpdateInput = { ...rest };
    if (status) {
      updateData.status = status as VendorStatus;
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstNumber: true,
        category: true,
        status: true,
      },
    });

    return updated;
  }

  async delete(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: { quotations: { select: { id: true }, take: 1 } },
    });

    if (!vendor) {
      throw { status: 404, message: 'Vendor not found' };
    }

    if (vendor.quotations.length > 0) {
      throw { status: 400, message: 'Cannot delete vendor with linked quotations' };
    }

    await prisma.vendor.delete({ where: { id } });
  }
}

export const vendorService = new VendorService();
