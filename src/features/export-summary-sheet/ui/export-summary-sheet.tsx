import { View } from 'react-native';

import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { Text } from '@/shared/ui/text';

import { useExportSummary } from '../model/use-export-summary';

interface ExportSummarySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportSummarySheet({
  isOpen,
  onClose,
}: ExportSummarySheetProps) {
  const { isLoading, handleExport } = useExportSummary(onClose);

  return (
    <BottomSheet
      title='Відправка у Google Sheets'
      isOpen={isOpen}
      onClose={onClose}
    >
      <View className='p-6 gap-4'>
        <View className='items-center gap-2'>
          <Text className='font-bold text-[18px] text-primary text-center'>
            Експорт підсумків годин
          </Text>
          <Text className='text-[14px] text-grey text-center'>
            Відправка звіту відпрацьованих годин працівників за місяць у
            підключену Google Таблицю.
          </Text>
        </View>

        <ButtonLoader
          variant='primary'
          appearance='solid'
          loading={isLoading}
          loaderColor='#fff'
          onPress={handleExport}
          className='w-full py-3'
        >
          Відправити звіт у Google Sheets
        </ButtonLoader>
      </View>
    </BottomSheet>
  );
}
