import { View } from 'react-native';

import { SectionTitle } from '@/shared/ui/section-title';
import { EmployeeSummaryCard } from '@/shared/ui/employee-summary-card';
import { getAvatarColor } from '@/shared/config/get-avatar-color';

interface Employee {
  name: string;
  initials: string;
  values: number[];
  monthTotal: number;
}
interface SummaryListProps {
  className?: string;
  employees: Employee[];
  monthLabel: string;
}

export function SummaryList({ employees, monthLabel, className }: SummaryListProps) {
  return (
    <View className={className}>
      <SectionTitle text={`ПІДСУМКИ ЗА ${monthLabel.toUpperCase()}`} className='ml-2' />

      {employees.map((employee, index) => (
        <EmployeeSummaryCard
          {...employee}
          key={`employee-${index}`}
          avatarColor={getAvatarColor(employee.name)}
          className='mb-2'
        />
      ))}
    </View>
  );
}
