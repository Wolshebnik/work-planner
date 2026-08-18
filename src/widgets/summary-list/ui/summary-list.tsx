import { View } from 'react-native';

import type { AvatarColor } from '@/shared/config/get-avatar-color';
import { EmployeeSummaryCard } from '@/shared/ui/employee-summary-card';
import { SectionTitle } from '@/shared/ui/section-title';

interface Employee {
  avatarColor?: AvatarColor;
  initials: string;
  monthTotal: number;
  name: string;
  values: string[] | number[];
}
interface SummaryListProps {
  className?: string;
  employees: Employee[];
  monthLabel: string;
}

export function SummaryList({
  employees,
  monthLabel,
  className,
}: SummaryListProps) {
  return (
    <View className={className}>
      <SectionTitle
        text={`ПІДСУМКИ ЗА ${monthLabel.toUpperCase()}`}
        className='ml-2'
      />

      {employees.map((employee, index) => (
        <EmployeeSummaryCard
          {...employee}
          key={`employee-${index}`}
          avatarColor={employee.avatarColor}
          className='mb-2'
        />
      ))}
    </View>
  );
}
