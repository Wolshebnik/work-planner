import { useState } from 'react';

import { Pressable, View } from 'react-native';

import { UploadCloud } from '@/assets/svg';
import { BottomSheet } from '@/shared/ui/bottom-sheet';

export function ScheduleExportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityLabel='Відправка у Google Sheets'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-button shadow-button active:scale-[0.98]'
        hitSlop={8}
        onPress={() => setIsOpen(true)}
      >
        <UploadCloud className='text-white' height={22} width={22} />
      </Pressable>

      <BottomSheet
        title='Відправка у Google Sheets'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <View className='h-32 items-center justify-center' />
      </BottomSheet>
    </>
  );
}
