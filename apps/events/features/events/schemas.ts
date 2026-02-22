import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional().default(''),
  location: z.string().max(300, 'Location too long').optional().default(''),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  allDay: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurrence: z.any().optional(),
  color: z.string().default('#0d9488'),
  maxAttendees: z.number().int().positive().optional().nullable(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type EventInput = z.infer<typeof eventSchema>;

export const eventFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().positive().default(1),
});

export type EventFilter = z.infer<typeof eventFilterSchema>;
