import { z } from 'zod';

export const connectGoogleSheetSchema = z.object({
  title: z.string().min(1, "Обов'язкове поле"),
  url: z
    .string()
    .min(1, "Обов'язкове поле")
    .url('Введіть коректне посилання (URL)')
    .regex(
      /docs\.google\.com\/spreadsheets/,
      'Посилання повинно бути на Google Таблицю (docs.google.com/spreadsheets)',
    ),
});

export type ConnectGoogleSheetFormValues = z.infer<
  typeof connectGoogleSheetSchema
>;
