import { z } from 'zod';

export const employeeSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  patronymic: z.string().nullable(),
  is_active: z.boolean(),
  sort_order: z.number(),
});

export const employeesSchema = z.array(employeeSchema);

export type Employee = z.infer<typeof employeeSchema>;
