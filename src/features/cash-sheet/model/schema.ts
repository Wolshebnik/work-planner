import { z } from 'zod';

export const cashFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Введіть суму каси')
    .refine(
      (val) => !isNaN(Number(val.replace(',', '.'))) && Number(val.replace(',', '.')) >= 0,
      'Введіть числове значення >= 0',
    ),
});

export type CashFormValues = z.infer<typeof cashFormSchema>;
