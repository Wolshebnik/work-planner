import type { Employee } from '@/entities/employee';

import { type AvatarColor } from './avatar-color';

export type { AvatarColor };

const COLORS: AvatarColor[] = [
  { backgroundColor: '#CDF4D8', textColor: '#206F37' },
  { backgroundColor: '#F4CDCD', textColor: '#6F2020' },
  { backgroundColor: '#E4CDF4', textColor: '#4E206F' },
  { backgroundColor: '#F4EFCD', textColor: '#6F6520' },
  { backgroundColor: '#CDEEF4', textColor: '#20626F' },
  { backgroundColor: '#F4CDE2', textColor: '#6F204B' },
  { backgroundColor: '#D6F4CD', textColor: '#346F20' },
  { backgroundColor: '#CECDF4', textColor: '#23206F' },
  { backgroundColor: '#F4DACD', textColor: '#6F3A20' },
  { backgroundColor: '#CDF4E5', textColor: '#206F51' },
  { backgroundColor: '#F1CDF4', textColor: '#68206F' },
  { backgroundColor: '#ECF4CD', textColor: '#5E6F20' },
  { backgroundColor: '#CDE0F4', textColor: '#20476F' },
  { backgroundColor: '#F4CDD5', textColor: '#6F2030' },
  { backgroundColor: '#CDF4D0', textColor: '#206F27' },
  { backgroundColor: '#DCCDF4', textColor: '#3E206F' },
  { backgroundColor: '#F4E7CD', textColor: '#6F5520' },
  { backgroundColor: '#CDF4F3', textColor: '#206F6C' },
  { backgroundColor: '#F4CDEA', textColor: '#6F205B' },
  { backgroundColor: '#DFF4CD', textColor: '#446F20' },
];

export function getAvatarColorById(id?: string | null): AvatarColor {
  if (!id) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

export function createEmployeeColorMap(
  employees: Employee[],
): Map<string, AvatarColor> {
  return new Map(
    employees.map((employee) => [
      employee.id,
      getAvatarColorById(employee.id),
    ]),
  );
}

export function getEmployeeAvatarColor(
  employeeId?: string | null,
  colorMap?: Map<string, AvatarColor>,
): AvatarColor {
  if (colorMap && employeeId && colorMap.has(employeeId)) {
    return colorMap.get(employeeId)!;
  }
  return getAvatarColorById(employeeId);
}
