import { Pressable } from 'react-native';

import { UploadCloud } from '@/assets/svg';
import { Header } from '@/shared/ui/header';

import { useScheduleSlotContext } from '../../model/context/schedule-slot-context';

export function ScheduleSlotHeader() {
  const { viewMode, handleOpenExport } = useScheduleSlotContext();

  const isExportVisible = viewMode !== 'month';

  return (
    <Header
      title='Графік роботи'
      rightAction={
        isExportVisible ? (
          <Pressable
            accessibilityLabel='Відправка у Google Sheets'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full bg-button shadow-button active:scale-[0.98]'
            hitSlop={8}
            onPress={handleOpenExport}
          >
            <UploadCloud className='text-white' height={22} width={22} />
          </Pressable>
        ) : undefined
      }
    />
  );
}
