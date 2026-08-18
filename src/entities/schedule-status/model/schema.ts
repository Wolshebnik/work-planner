import { z } from 'zod';

export const scheduleStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  schedule_mark: z.string().nullable(),
  excel_mark: z.string().nullable(),
  color: z.string().nullable(),
  is_active: z.boolean(),
  is_locked: z.boolean(),
  is_system: z.boolean(),
  sort_order: z.number(),
});

export const scheduleStatusesSchema = z.array(scheduleStatusSchema);

export type ScheduleStatus = z.infer<typeof scheduleStatusSchema>;
