import { z } from 'zod';

export const createRfqSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    deadline: z.string().min(1, 'Deadline is required'),
  }),
});

export const updateRfqSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid RFQ ID'),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    quantity: z.number().int().positive().optional(),
    deadline: z.string().optional(),
    status: z.enum(['OPEN', 'CLOSED', 'AWARDED']).optional(),
  }),
});

export const rfqIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid RFQ ID'),
  }),
});
