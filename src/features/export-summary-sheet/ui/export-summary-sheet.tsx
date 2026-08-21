import { useEffect, useMemo } from 'react';

import dayjs from 'dayjs';
import { View } from 'react-native';

import { Calendar } from '@/assets/svg';
import { useDebouncedValue } from '@/shared/lib/hooks/use-debounced-value';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonBase } from '@/shared/ui/button-base';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { InputBase } from '@/shared/ui/input-base';
import { SelectInput } from '@/shared/ui/select-input';
import { Text } from '@/shared/ui/text';
import { showToast } from '@/shared/ui/toast';

import { useCashierColumnTitle } from '../model/use-cashier-column-title';
import { useCheckSummarySheet } from '../model/use-check-summary-sheet';
import { useExportSummary } from '../model/use-export-summary';


interface ExportSummarySheetProps {
  date?: dayjs.Dayjs;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportSummarySheet({
  date = dayjs(),
  isOpen,
  onClose,
}: ExportSummarySheetProps) {
  const { isLoading: isExporting, handleExport } = useExportSummary(onClose);
  const { columnTitle, setColumnTitle } = useCashierColumnTitle();

  const debouncedColumnTitle = useDebouncedValue(columnTitle, 500);

  const {
    monthError,
    columnError,
    employeeError,
    isLoading: isCheckingSheet,
  } = useCheckSummarySheet({
    columnTitle: debouncedColumnTitle,
    date,
    isOpen,
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

  const formattedMonthLabel = useMemo(() => {
    return (
      date.format('MMMM').charAt(0).toUpperCase() +
      date.format('MMMM').slice(1) +
      ' ' +
      date.format('YYYY')
    );
  }, [date]);

  const monthOptions = useMemo(
    () => [{ label: formattedMonthLabel, value: 0 }],
    [formattedMonthLabel],
  );

  const isDebouncing = columnTitle !== debouncedColumnTitle;
  const isBusy = isExporting || isCheckingSheet || isDebouncing;
  const isSubmitDisabled =
    isBusy ||
    Boolean(monthError) ||
    Boolean(columnError) ||
    Boolean(employeeError) ||
    !columnTitle.trim();

  const rootError = employeeError;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title='Відправка у Google Sheets'
    >
      <View className='mb-6'>
        <View className='mb-6'>
          <Text className='font-bold text-[22px] text-primary'>Відправка</Text>
          <Text className='mt-1 text-[14px] leading-5 text-grey'>
            Перевірте дані перед відправкою у Google Sheets.
          </Text>
        </View>

        <SelectInput<number>
          className='mb-4'
          disabled
          error={monthError ?? undefined}
          label='Місяць'
          labelColor='#ffffff'
          leftIcon={
            <Calendar className='text-primary' height={20} width={20} />
          }
          onChange={() => {}}
          options={monthOptions}
          value={0}
        />

        <InputBase
          bottomSheet
          className='mb-4'
          error={columnError ?? undefined}
          label='Назва стовпця каси в Excel'
          labelColor='#ffffff'
          onChangeText={setColumnTitle}
          value={columnTitle}
        />

        {Boolean(rootError) && (
          <View className='mb-4 rounded-8 bg-danger/10 p-3'>
            <Text className='font-medium text-[13px] leading-4 text-danger'>
              {rootError}
            </Text>
          </View>
        )}

        <View className='flex-row gap-3'>
          <ButtonBase
            appearance='outline'
            className='flex-1 py-3'
            disabled={isExporting}
            onPress={onClose}
            variant='primary'
          >
            Скасувати
          </ButtonBase>

          <ButtonLoader
            appearance='solid'
            className='flex-1 py-3'
            disabled={isSubmitDisabled}
            loaderColor='#fff'
            loading={isBusy}
            onPress={() => handleExport({ columnTitle, date })}
            variant='primary'
          >
            Відправити
          </ButtonLoader>
        </View>
      </View>
    </BottomSheet>
  );
}
