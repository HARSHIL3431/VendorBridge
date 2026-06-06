import { Request, Response, NextFunction } from 'express';
import { approvalService } from '../services/approvalService';

export class ComparisonController {
  async compare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await approvalService.compare(req.params.rfqId as string);

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
}

export const comparisonController = new ComparisonController();
