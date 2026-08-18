import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, "Обов'язкове поле"),
  description: z.string().min(1, "Обов'язкове поле"),
  scheduleMark: z.string().min(1, "Обов'язкове поле"),
  excelMark: z.string().min(1, "Обов'язкове поле"),
  color: z.string().min(1, "Обов'язкове поле"),
  isLocked: z.boolean(),
});

export type FormValues = z.infer<typeof schema>;
