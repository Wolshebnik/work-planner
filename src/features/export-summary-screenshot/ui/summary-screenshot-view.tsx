import { forwardRef } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { EmployeeSummaryCard } from '@/shared/ui/employee-summary-card';
import { SectionTitle } from '@/shared/ui/section-title';
import type { EmployeeSummaryItem } from '@/widgets/summary-list';

export interface SummaryScreenshotViewProps {
  className?: string;
  employees: EmployeeSummaryItem[];
  monthLabel: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const SummaryScreenshotView = forwardRef<
  View,
  SummaryScreenshotViewProps
>(function SummaryScreenshotView(
  {
    className,
    employees,
    monthLabel,
    onLayout,
  },
  ref,
) {
  return (
    <View
      ref={ref}
      collapsable={false}
      className={cn('w-[390px] bg-background px-4 py-6', className)}
      onLayout={onLayout}
    >
      <SectionTitle
        text={`ПІДСУМКИ ЗА ${monthLabel.toUpperCase()}`}
        className='ml-2 mb-3'
      />

      {employees.map((employee) => (
        <EmployeeSummaryCard
          key={employee.id}
          initials={employee.initials}
          name={employee.name}
          avatarColor={employee.avatarColor}
          values={employee.weeklyWorkDays}
          weekLabels={employee.weekLabels}
          cashTotal={employee.cashTotal ?? 0}
          monthTotal={employee.monthTotal ?? employee.monthlyHours}
          className='mb-2'
        />
      ))}
    </View>
  );
});
