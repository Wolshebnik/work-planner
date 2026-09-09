import { memo, useEffect } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import type { Employee } from '@/entities/employee';
import { CashSheet } from '@/features/cash-sheet';
import {
  SummaryScreenshotView,
  useExportSummaryScreenshot,
} from '@/features/export-summary-screenshot';
import type { AvatarColor } from '@/shared/config/avatar-color';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { SummaryList } from '@/widgets/summary-list';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';
import { useScheduleSummaryData } from '../../model/summary/use-schedule-summary-data';

interface ScheduleSummaryContentProps {
  activeEmployees: Employee[];
  colorMap: Map<string, AvatarColor>;
  date: dayjs.Dayjs;
  isCurrent?: boolean;
}

export const ScheduleSummaryContent = memo(function ScheduleSummaryContent({
  date,
  activeEmployees,
  colorMap,
  isCurrent = true,
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

  const {
    exportRef,
    exportScreenshot,
    handleLayout: handleScreenshotLayout,
    isExporting,
  } = useExportSummaryScreenshot(monthLabel);

  const { registerScreenshotHandler, setIsExportingScreenshot } =
    useScheduleSlotContext();

  useEffect(() => {
    if (!isCurrent) {
      return;
    }

    setIsExportingScreenshot(isExporting);
  }, [isCurrent, isExporting, setIsExportingScreenshot]);

  useEffect(() => {
    if (!isCurrent) {
      return;
    }

    registerScreenshotHandler(exportScreenshot);

    return () => {
      registerScreenshotHandler(null);
    };
  }, [isCurrent, exportScreenshot, registerScreenshotHandler]);

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
      {isCurrent && (
        <View
          pointerEvents='none'
          style={{
            position: 'absolute',
            left: -9999,
            top: 0,
          }}
        >
          <SummaryScreenshotView
            ref={exportRef}
            employees={summaryEmployees}
            monthLabel={monthLabel}
            onLayout={handleScreenshotLayout}
          />
        </View>
      )}
    </>
  );
});
