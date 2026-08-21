import { z } from 'zod';

export const cashierHoursItemSchema = z.object({
  cashier_hours: z.number(),
  employee_id: z.string(),
  month: z.number(),
  year: z.number(),
});

export const cashierHoursItemsSchema = z.array(cashierHoursItemSchema);

export type CashierHoursItem = z.infer<typeof cashierHoursItemSchema>;
