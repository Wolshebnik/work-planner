import { z } from 'zod';

import type { AvatarColor } from '@/shared/config/get-avatar-color';

export const editEmployeeNameSchema = z.object({
  lastName: z.string().min(1, 'Прізвище обов\'язкове'),
  firstName: z.string().min(1, 'Ім\'я обов\'язкове'),
  middleName: z.string().optional(),
});

export type EditEmployeeNameFormData = z.infer<typeof editEmployeeNameSchema>;

export type EmployeeDetailsMode = 'details' | 'edit';

export interface EmployeeData {
  color?: AvatarColor;
  id: string;
  isActive: boolean;
  name: string;
}

export interface EmployeeDetailsSheetProps {
  employee: EmployeeData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditEmployeeNameFormData) => Promise<void>;
  initialMode?: EmployeeDetailsMode;
}