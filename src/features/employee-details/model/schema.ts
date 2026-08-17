import { z } from 'zod';

export const editEmployeeNameSchema = z.object({
  lastName: z.string().min(1, 'Прізвище обов\'язкове'),
  firstName: z.string().min(1, 'Ім\'я обов\'язкове'),
  middleName: z.string().optional(),
});

export type EditEmployeeNameFormData = z.infer<typeof editEmployeeNameSchema>;

export type EmployeeDetailsMode = 'details' | 'edit';

export interface EmployeeData {
  id: string;
  name: string;
  isActive: boolean;
}

export interface EmployeeDetailsSheetProps {
  employee: EmployeeData | null;
  isOpen: boolean;
  onClose: () => void;
  onArchive: (id: string) => void;
  onSave: (data: EditEmployeeNameFormData) => Promise<void>;
  initialMode?: EmployeeDetailsMode;
}