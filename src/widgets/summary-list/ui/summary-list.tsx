import { View } from 'react-native';

import { EmployeeSummaryCard } from '@/shared/ui/employee-summary-card';
import { SectionTitle } from '@/shared/ui/section-title';

import type { EmployeeSummaryItem } from '../model/types';

interface SummaryListProps {
  className?: string;
  employees: EmployeeSummaryItem[];
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

      {employees.map((employee) => (
        <EmployeeSummaryCard
          key={employee.id}
          initials={employee.initials}
          name={employee.name}
          avatarColor={employee.avatarColor}
          values={employee.weeklyHours}
          monthTotal={employee.monthTotal ?? employee.monthlyHours}
          className='mb-2'
        />
      ))}
    </View>
  );
}

