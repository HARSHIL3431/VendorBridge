import { z } from 'zod';

export const createInvoiceSchema = z.object({
  body: z.object({
    purchaseOrderId: z.string().uuid('Invalid purchase order ID'),
  }),
});

export const invoiceIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid invoice ID'),
  }),
});

export const sendEmailSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid invoice ID'),
  }),
  body: z.object({
    email: z.string().email('Valid email is required'),
  }),
});
