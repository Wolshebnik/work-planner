import { View } from 'react-native';

import { Table } from '@/assets/svg';
import type { GoogleSheetItem } from '@/entities/google-sheets';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { Text } from '@/shared/ui/text';

import { useSyncGoogleSheets } from '../model/use-sync-google-sheets';

interface GoogleSheetDetailsSheetProps {
  isOpen: boolean;
  item: GoogleSheetItem | null;
  onClose: () => void;
}

export function GoogleSheetDetailsSheet({
  isOpen,
  item,
  onClose,
}: GoogleSheetDetailsSheetProps) {
  const { sync, isSyncing } = useSyncGoogleSheets();

  if (!item) return null;

  const handleSync = async () => {
    await sync(item);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title='Підключена таблиця'
    >
      <View className='gap-4 pb-6 pt-2'>
        <View className='bg-neutral rounded-12 border border-border p-4 gap-2'>
          <View className='flex-row items-center gap-2'>
            <Table className='text-primary' height={18} width={18} />
            <Text className='font-bold text-[15px] text-primary'>
              {item.title}
            </Text>
          </View>
          <Text className='text-[13px] text-grey leading-4.5 select-text'>
            {item.url}
          </Text>
        </View>

        <View className='mt-2'>
          <ButtonLoader
            variant='primary'
            appearance='solid'
            className='w-full'
            loaderColor='#fff'
            loading={isSyncing}
            onPress={handleSync}
          >
            Синхронізація
          </ButtonLoader>
        </View>
      </View>
    </BottomSheet>
  );
}
