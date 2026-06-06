import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalVendors,
        activeRfqs,
        pendingApprovals,
        totalInvoices,
        totalPurchaseOrders,
      ] = await Promise.all([
        prisma.vendor.count(),
        prisma.rfq.count({ where: { status: 'OPEN' } }),
        prisma.quotation.count({
          where: {
            status: 'PENDING',
            approval: null,
          },
        }),
        prisma.invoice.count(),
        prisma.purchaseOrder.count(),
      ]);

      // Get recent activity (last 10 items)
      const recentRfqs = await prisma.rfq.findMany({
        select: { title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      const recentPOs = await prisma.purchaseOrder.findMany({
        select: {
          poNumber: true,
          createdAt: true,
          quotation: {
            select: {
              vendor: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });

      const recentInvoices = await prisma.invoice.findMany({
        select: { invoiceNumber: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 2,
      });

      const recentActivity = [
        ...recentRfqs.map((r: { title: string; createdAt: Date }) => ({
          type: 'RFQ_CREATED',
          message: `${r.title} RFQ created`,
          createdAt: r.createdAt.toISOString(),
        })),
        ...recentPOs.map((p: { poNumber: string; createdAt: Date; quotation: { vendor: { name: string } } }) => ({
          type: 'PO_GENERATED',
          message: `Purchase Order ${p.poNumber} generated for ${p.quotation.vendor.name}`,
          createdAt: p.createdAt.toISOString(),
        })),
        ...recentInvoices.map((i: { invoiceNumber: string; createdAt: Date }) => ({
          type: 'INVOICE_CREATED',
          message: `Invoice ${i.invoiceNumber} generated`,
          createdAt: i.createdAt.toISOString(),
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      res.status(200).json({
        success: true,
        data: {
          totalVendors,
          activeRfqs,
          pendingApprovals,
          totalInvoices,
          totalPurchaseOrders,
          recentActivity,
        },
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
