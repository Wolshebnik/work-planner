import type { Employee } from '@/entities/employee';

export interface AvatarColor {
  backgroundColor: string;
  textColor: string;
}

const COLORS: AvatarColor[] = [
  { backgroundColor: '#CDF4D8', textColor: '#206F37' }, // Green
  { backgroundColor: '#F4CDCD', textColor: '#6F2020' }, // Red
  { backgroundColor: '#E4CDF4', textColor: '#4E206F' }, // Purple
  { backgroundColor: '#F4EFCD', textColor: '#6F6520' }, // Yellow
  { backgroundColor: '#CDEEF4', textColor: '#20626F' }, // Cyan
  { backgroundColor: '#F4CDE2', textColor: '#6F204B' }, // Pink
  { backgroundColor: '#D6F4CD', textColor: '#346F20' }, // Lime
  { backgroundColor: '#CECDF4', textColor: '#23206F' }, // Indigo
  { backgroundColor: '#F4DACD', textColor: '#6F3A20' }, // Orange
  { backgroundColor: '#CDF4E5', textColor: '#206F51' }, // Mint
  { backgroundColor: '#F1CDF4', textColor: '#68206F' }, // Magenta
  { backgroundColor: '#ECF4CD', textColor: '#5E6F20' }, // Yellow Green
  { backgroundColor: '#CDE0F4', textColor: '#20476F' }, // Blue
  { backgroundColor: '#F4CDD5', textColor: '#6F2030' }, // Rose
  { backgroundColor: '#CDF4D0', textColor: '#206F27' }, // Fresh Green
  { backgroundColor: '#DCCDF4', textColor: '#3E206F' }, // Violet
  { backgroundColor: '#F4E7CD', textColor: '#6F5520' }, // Sand
  { backgroundColor: '#CDF4F3', textColor: '#206F6C' }, // Aqua
  { backgroundColor: '#F4CDEA', textColor: '#6F205B' }, // Fuchsia
  { backgroundColor: '#DFF4CD', textColor: '#446F20' }, // Light Lime
];

export function createEmployeeColorMap(
  employees: Employee[],
): Map<string, AvatarColor> {
  const sortedEmployees = [...employees].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }

    return a.id.localeCompare(b.id);
  });

  return new Map(
    sortedEmployees.map((employee, index) => [
      employee.id,
      COLORS[index % COLORS.length],
    ]),
  );
}

export function getEmployeeAvatarColor(
  employeeId: string,
  colorMap: Map<string, AvatarColor>,
): AvatarColor {
  return colorMap.get(employeeId) ?? COLORS[0];
}
