import { Request, Response, NextFunction } from 'express';
import { purchaseOrderService } from '../services/purchaseOrderService';

export class PurchaseOrderController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await purchaseOrderService.list();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await purchaseOrderService.getById(req.params.id as string);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quotationId } = req.body;
      const data = await purchaseOrderService.create(quotationId);

      res.status(201).json({
        success: true,
        message: 'Purchase Order generated successfully',
        data,
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

export const purchaseOrderController = new PurchaseOrderController();
