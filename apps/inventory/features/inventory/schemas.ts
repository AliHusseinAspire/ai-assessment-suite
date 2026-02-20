import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional(),
  sku: z.string().min(1, 'SKU is required').max(50),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'ORDERED', 'DISCONTINUED']),
  supplier: z.string().max(200).optional(),
  minStock: z.coerce.number().int().min(0).default(10),
  maxStock: z.coerce.number().int().min(1).default(100),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const updateItemSchema = createItemSchema.partial().extend({
  id: z.string().min(1),
});

export const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'ORDERED', 'DISCONTINUED']).optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
