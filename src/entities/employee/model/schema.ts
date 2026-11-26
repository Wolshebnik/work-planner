import { z } from 'zod';

export const employeeArchivePeriodSchema = z.object({
  archived_at: z.string(),
  restored_at: z.string().nullable(),
});

export const employeeArchivePeriodsSchema = z.array(
  employeeArchivePeriodSchema,
);

export const employeeSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  patronymic: z.string().nullable(),
  is_active: z.boolean(),
  archive_periods: employeeArchivePeriodsSchema.default([]),
  sort_order: z.number(),
});

export const employeesSchema = z.array(employeeSchema);

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeArchivePeriod = z.infer<
  typeof employeeArchivePeriodSchema
>;
