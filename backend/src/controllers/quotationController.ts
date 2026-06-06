import { Request, Response, NextFunction } from 'express';
import { quotationService } from '../services/quotationService';

export class QuotationController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        rfqId: req.query.rfqId as string | undefined,
        vendorId: req.query.vendorId as string | undefined,
      };
      const data = await quotationService.list(filters);

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
      const data = await quotationService.getById(req.params.id as string);

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
      const { rfqId, vendorId, price, deliveryDays, notes } = req.body;
      const data = await quotationService.create({
        rfqId,
        vendorId,
        userId: req.user!.id,
        price,
        deliveryDays,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Quotation submitted successfully',
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

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await quotationService.update(req.params.id as string, req.user!.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Quotation updated successfully',
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

export const quotationController = new QuotationController();
