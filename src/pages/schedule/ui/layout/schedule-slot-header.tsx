import { ActivityIndicator, Pressable, View } from 'react-native';

import { TableSearch, UploadCloud } from '@/assets/svg';
import { useCheckScheduleSheet } from '@/features/export-schedule-sheet';
import { Header } from '@/shared/ui/header';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';

export function ScheduleSlotHeader() {
  const { currentDate, handleOpenExport, monthLabel, viewMode } =
    useScheduleSlotContext();
  const { handleCheck, isChecking } = useCheckScheduleSheet({
    currentDate,
    monthLabel,
  });

  const isCheckVisible = viewMode === 'week';
  const isExportVisible = viewMode !== 'month';

  return (
    <Header
      title='Графік роботи'
      className='mb-2'
      rightAction={
        <View className='flex-row gap-2'>
          {isCheckVisible && (
            <Pressable
              accessibilityLabel='Перевірити Google Sheets'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-button shadow-button active:scale-[0.98]'
              disabled={isChecking}
              hitSlop={8}
              onPress={handleCheck}
            >
              {isChecking ? (
                <ActivityIndicator color='#ffffff' size='small' />
              ) : (
                <TableSearch className='text-white' height={22} width={22} />
              )}
            </Pressable>
          )}

          {isExportVisible && (
            <Pressable
              accessibilityLabel='Відправка у Google Sheets'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-button shadow-button active:scale-[0.98]'
              hitSlop={8}
              onPress={handleOpenExport}
            >
              <UploadCloud className='text-white' height={22} width={22} />
            </Pressable>
          )}
        </View>
      }
    />
  );
}
