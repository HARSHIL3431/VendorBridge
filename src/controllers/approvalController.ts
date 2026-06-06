import { Request, Response, NextFunction } from 'express';
import { approvalService } from '../services/approvalService';

export class ApprovalController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await approvalService.list();

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
      const data = await approvalService.getById(req.params.id as string);

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
      const { quotationId, status, remarks } = req.body;
      const data = await approvalService.create({
        quotationId,
        status,
        remarks,
        approvedById: req.user!.id,
      });

      const message =
        status === 'APPROVED'
          ? 'Quotation approved successfully'
          : 'Quotation rejected successfully';

      res.status(201).json({
        success: true,
        message,
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

export const approvalController = new ApprovalController();
