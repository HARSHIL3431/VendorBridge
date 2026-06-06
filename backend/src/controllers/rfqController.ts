import { Request, Response, NextFunction } from 'express';
import { rfqService } from '../services/rfqService';

export class RfqController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await rfqService.list(req.user?.role, req.user?.id);

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
      const data = await rfqService.getById(req.params.id as string);

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
      const data = await rfqService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'RFQ created successfully',
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
      const data = await rfqService.update(req.params.id as string, req.body);

      res.status(200).json({
        success: true,
        message: 'RFQ updated successfully',
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

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await rfqService.delete(req.params.id as string);

      res.status(200).json({
        success: true,
        message: 'RFQ deleted successfully',
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

export const rfqController = new RfqController();
