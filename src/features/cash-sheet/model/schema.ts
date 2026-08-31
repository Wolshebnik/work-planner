import { z } from 'zod';

const cashFormBaseSchema = z.object({
  amount: z
    .string()
    .min(1, 'Введіть суму каси')
    .refine((val) => !isNaN(Number(val.replace(',', '.'))), 'Введіть числове значення')
});

export const cashFormSchema = cashFormBaseSchema.refine(
  ({ amount }) => Number(amount.replace(',', '.')) > 0,
  'Введіть суму більше 0',
);

export const cashFormResetSchema = cashFormBaseSchema.refine(
  ({ amount }) => Number(amount.replace(',', '.')) >= 0,
  'Введіть числове значення >= 0',
);

export type CashFormValues = z.infer<typeof cashFormSchema>;
