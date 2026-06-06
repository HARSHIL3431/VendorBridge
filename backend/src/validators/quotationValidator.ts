import { z } from 'zod';

export const createQuotationSchema = z.object({
  body: z.object({
    rfqId: z.string().uuid('Invalid RFQ ID'),
    vendorId: z.string().uuid('Invalid vendor ID'),
    price: z.number().positive('Price must be positive'),
    deliveryDays: z.number().int().positive('Delivery days must be a positive integer'),
    notes: z.string().optional(),
  }),
});

export const updateQuotationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid quotation ID'),
  }),
  body: z.object({
    price: z.number().positive('Price must be positive').optional(),
    deliveryDays: z.number().int().positive('Delivery days must be a positive integer').optional(),
    notes: z.string().optional(),
  }),
});

export const quotationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid quotation ID'),
  }),
});

export const quotationQuerySchema = z.object({
  query: z.object({
    rfqId: z.string().uuid().optional(),
    vendorId: z.string().uuid().optional(),
  }),
});
