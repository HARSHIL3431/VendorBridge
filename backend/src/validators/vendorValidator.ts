import { z } from 'zod';

export const createVendorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone is required'),
    gstNumber: z.string().min(1, 'GST number is required'),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED']).optional().default('ACTIVE'),
  }),
});

export const updateVendorSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid vendor ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    gstNumber: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED']).optional(),
  }),
});

export const vendorIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid vendor ID'),
  }),
});

export const vendorQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});
