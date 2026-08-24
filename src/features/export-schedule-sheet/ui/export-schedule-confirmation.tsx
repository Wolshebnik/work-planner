import { useEffect, useMemo, useState } from 'react';

import type dayjs from 'dayjs';
import { View } from 'react-native';

import { Calendar } from '@/assets/svg';
import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { SelectInput } from '@/shared/ui/select-input';
import { Text } from '@/shared/ui/text';
import { showToast } from '@/shared/ui/toast';

import { getExportWeekPeriodOptions } from '../model/get-export-week-period-options';
import { useCheckSheetAvailability } from '../model/use-check-sheet-availability';
import { ExportScheduleSummary } from './export-schedule-summary';

export interface ExportScheduleConfirmationProps {
  date: dayjs.Dayjs;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: (params: {
    endDate: dayjs.Dayjs;
    monthLabel: string;
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
    employeeError,
    isLoading: isCheckingSheet,
  } = useCheckSheetAvailability({
    endDate: currentOption.endDate,
    monthLabel: currentOption.monthLabel,
    startDate: currentOption.startDate,
  });

  useEffect(() => {
    if (employeeError) {
      showToast({
        text1: 'Помилка перевірки працівників',
        text2: employeeError,
        type: 'error',
      });
    }
  }, [employeeError]);

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
  const isSubmitDisabled =
    isLoading ||
    Boolean(monthError) ||
    Boolean(weekError) ||
    Boolean(employeeError) ||
    isCheckingSheet;

  return (
    <View className='mb-6'>
      <View className='mb-6'>
        <Text className='font-bold text-[22px] text-primary'>Відправка</Text>
        <Text className='mt-1 text-[14px] leading-5 text-grey'>
          Перевірте дані перед відправкою у Google Sheets.
        </Text>
      </View>

      <SelectInput<number>
        className='mb-4'
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
        className='mb-4'
        disabled={!isInteractive}
        error={weekError ?? undefined}
        label='Тиждень'
        labelColor='#ffffff'
        leftIcon={<Calendar className='text-primary' height={20} width={20} />}
        onChange={(val) => setSelectedIndex(val)}
        options={weekOptions}
        value={selectedIndex}
      />

      <View className='mb-6'>
        <ExportScheduleSummary
          monthLabel={currentOption.monthLabel}
          sourceLabel={sourceLabel}
          weekLabel={currentOption.weekLabel}
        />
      </View>

      {Boolean(employeeError) && (
        <View className='mb-4 rounded-8 bg-danger/10 p-3'>
          <Text className='font-medium text-[13px] leading-4 text-danger'>
            {employeeError}
          </Text>
        </View>
      )}

      <View className='flex-row gap-3'>
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
          disabled={isSubmitDisabled}
          loaderColor='#fff'
          loading={isLoading || isCheckingSheet}
          onPress={() =>
            onConfirm({
              endDate: currentOption.endDate,
              monthLabel: currentOption.monthLabel,
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
