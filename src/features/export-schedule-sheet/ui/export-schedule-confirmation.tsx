import { useMemo, useState } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { Calendar } from '@/assets/svg';
import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { SelectInput } from '@/shared/ui/select-input';
import { Text } from '@/shared/ui/text';

import { getExportWeekPeriodOptions } from '../model/get-export-week-period-options';
import { useCheckSheetAvailability } from '../model/use-check-sheet-availability';
import { ExportScheduleSummary } from './export-schedule-summary';

export interface ExportScheduleConfirmationProps {
  date: dayjs.Dayjs;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: (params: {
    endDate: dayjs.Dayjs;
    monthName: string;
    startDate: dayjs.Dayjs;
  }) => void;
  sourceLabel?: string;
}

export function ExportScheduleConfirmation({
  date,
  isLoading = false,
  onCancel,
  onConfirm,
  sourceLabel = 'поточний екран графіка',
}: ExportScheduleConfirmationProps) {
  const periodData = useMemo(() => getExportWeekPeriodOptions(date), [date]);
  const [selectedIndex, setSelectedIndex] = useState(periodData.defaultIndex);

  const currentOption =
    periodData.options[selectedIndex] ?? periodData.options[0];

  const {
    monthError,
    weekError,
    isLoading: isCheckingSheet,
  } = useCheckSheetAvailability({
    endDate: currentOption.endDate,
    monthLabel: currentOption.monthLabel,
    monthName: currentOption.monthName,
    startDate: currentOption.startDate,
  });

  const monthOptions = useMemo(
    () =>
      periodData.options.map((opt, index) => ({
        label: opt.monthLabel,
        value: index,
      })),
    [periodData.options],
  );

  const weekOptions = useMemo(
    () =>
      periodData.options.map((opt, index) => ({
        label: opt.weekLabel,
        value: index,
      })),
    [periodData.options],
  );

  const isInteractive = periodData.isCrossMonth;

  return (
    <View className='gap-4 pb-6'>
      <View className='gap-1'>
        <Text className='font-bold text-[22px] text-primary'>
          Підтвердження
        </Text>
        <Text className='text-[14px] leading-5 text-grey'>
          Перевірте дані перед відправкою у Google Sheets.
        </Text>
      </View>

      <SelectInput<number>
        disabled={!isInteractive}
        error={monthError ?? undefined}
        label='Період у таблиці'
        labelColor='#ffffff'
        leftIcon={<Calendar className='text-primary' height={20} width={20} />}
        onChange={(val) => setSelectedIndex(val)}
        options={monthOptions}
        value={selectedIndex}
      />

      <SelectInput<number>
        disabled={!isInteractive}
        error={weekError ?? undefined}
        label='Тиждень'
        labelColor='#ffffff'
        leftIcon={<Calendar className='text-primary' height={20} width={20} />}
        onChange={(val) => setSelectedIndex(val)}
        options={weekOptions}
        value={selectedIndex}
      />

      <ExportScheduleSummary
        monthLabel={currentOption.monthLabel}
        sourceLabel={sourceLabel}
        weekLabel={currentOption.weekLabel}
      />

      <View className='mt-2 flex-row gap-3'>
        <ButtonBase
          appearance='outline'
          className='flex-1 py-3'
          disabled={isLoading}
          onPress={onCancel}
          variant='primary'
        >
          Скасувати
        </ButtonBase>

        <ButtonLoader
          appearance='solid'
          className='flex-1 py-3'
          disabled={
            isLoading ||
            Boolean(monthError) ||
            Boolean(weekError) ||
            isCheckingSheet
          }
          loaderColor='#fff'
          loading={isLoading || isCheckingSheet}
          onPress={() =>
            onConfirm({
              endDate: currentOption.endDate,
              monthName: currentOption.monthName,
              startDate: currentOption.startDate,
            })
          }
          variant='primary'
        >
          Відправити
        </ButtonLoader>
      </View>
    </View>
  );
}
