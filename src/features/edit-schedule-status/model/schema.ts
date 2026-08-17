import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, "Обов'язкове поле"),
  shortName: z.string().min(1, "Обов'язкове поле"),
  dbMark: z.string().min(1, "Обов'язкове поле"),
  color: z.string().min(1, "Обов'язкове поле"),
  workingHours: z.string().min(1, "Обов'язкове поле"),
});

export type FormValues = z.infer<typeof schema>;
