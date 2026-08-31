import { memo } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { Employee } from '@/entities/employee';
import { CashSheet } from '@/features/cash-sheet';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { SummaryList } from '@/widgets/summary-list';

import { useScheduleSummaryData } from '../../model/summary/use-schedule-summary-data';

interface ScheduleSummaryContentProps {
  activeEmployees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
}

export const ScheduleSummaryContent = memo(function ScheduleSummaryContent({
  date,
  activeEmployees,
  colorMap,
}: ScheduleSummaryContentProps) {
  const {
    summaryEmployees,
    monthLabel,
    isLoading,
    isCashSheetOpen,
    selectedEmployee,
    handleCashPress,
    handleCloseCashSheet,
    handleSaveCash,
    canResetCash,
  } = useScheduleSummaryData({ activeEmployees, colorMap, date });

  if (isLoading) {
    return (
      <View className='h-96 items-center justify-center'>
        <CircularProgressLoader size='large' />
      </View>
    );
  }

  return (
    <>
      <SummaryList
        employees={summaryEmployees}
        monthLabel={monthLabel}
        onCashPress={handleCashPress}
        className='px-4'
      />
      <CashSheet
        allowZero={canResetCash}
        isOpen={isCashSheetOpen}
        onClose={handleCloseCashSheet}
        employeeName={selectedEmployee?.name}
        initialAmount={selectedEmployee?.cashTotal}
        onSave={handleSaveCash}
      />
    </>
  );
});

