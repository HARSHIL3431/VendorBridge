import { Request, Response, NextFunction } from 'express';
import { invoiceService } from '../services/invoiceService';

export class InvoiceController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await invoiceService.list();

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
      const data = await invoiceService.getById(req.params.id as string);

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
      const { purchaseOrderId } = req.body;
      const data = await invoiceService.create(purchaseOrderId);

      res.status(201).json({
        success: true,
        message: 'Invoice generated successfully',
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

  async downloadPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const pdfBuffer = await invoiceService.generatePdf(id);

      // Get invoice number for filename
      const invoice = await invoiceService.getById(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async sendEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const recipientEmail = await invoiceService.sendEmail(req.params.id as string, email);

      res.status(200).json({
        success: true,
        message: `Invoice sent to ${recipientEmail} successfully`,
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

export const invoiceController = new InvoiceController();
