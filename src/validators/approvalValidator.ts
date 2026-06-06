import { z } from 'zod';

export const createApprovalSchema = z.object({
  body: z.object({
    quotationId: z.string().uuid('Invalid quotation ID'),
    status: z.enum(['APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: 'Status must be APPROVED or REJECTED' }),
    }),
    remarks: z.string().optional(),
  }),
});

export const approvalIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid approval ID'),
  }),
});
