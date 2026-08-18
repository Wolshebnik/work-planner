import { z } from 'zod';

import { scheduleStatusSchema } from '@/entities/schedule-status';

export const scheduleEntrySchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  work_date: z.string(),
  status_id: z.string(),
  status: scheduleStatusSchema,
});

export const scheduleEntriesSchema = z.array(scheduleEntrySchema);

export type ScheduleEntry = z.infer<typeof scheduleEntrySchema>;
