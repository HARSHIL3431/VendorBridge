import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  body: z.object({
    quotationId: z.string().uuid('Invalid quotation ID'),
  }),
});

export const purchaseOrderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid purchase order ID'),
  }),
});
