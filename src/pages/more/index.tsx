import { useState } from 'react';

import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Header } from '@/shared/ui/header';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { StatusBadge } from '@/shared/ui/status-badge';
import { SectionTitle } from '@/shared/ui/section-title';

export function MorePage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  return (
    <View className='flex-1 bg-background'>
      <Header title='Ще' />

      <SectionTitle text='ПІДСУМКИ ЗА БЕРЕЗЕНЬ' />

      <View className='items-center justify-center'>
        <View className='flex-row gap-2 mb-4'>
          <StatusBadge variant='success'>Р</StatusBadge>
          <StatusBadge variant='danger'>В</StatusBadge>
          <StatusBadge variant='warning'>П</StatusBadge>
          <StatusBadge variant='purple'>Л</StatusBadge>
          <StatusBadge variant='maroon'>Б</StatusBadge>
        </View>

        <Button variant='warning'>warning</Button>
        <Button variant='success'>success</Button>
        <Button variant='danger'>danger</Button>
        <Button variant='maroon'>maroon</Button>
        <Button variant='purple'>purple</Button>

        <Button variant='warning' appearance='outline' className='mt-4'>
          warning
        </Button>
        <Button variant='success' appearance='outline'>
          success
        </Button>
        <Button variant='danger' appearance='outline'>
          danger
        </Button>
        <Button variant='maroon' appearance='outline'>
          maroon
        </Button>
        <Button variant='purple' appearance='outline'>
          purple
        </Button>
        <Button appearance='outline'>primary</Button>
      </View>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title='Ср, 4 березня'
      >
        <View className='flex-row gap-2 mb-4'>
          <StatusBadge variant='success'>Р</StatusBadge>
          <StatusBadge variant='danger'>В</StatusBadge>
          <StatusBadge variant='warning'>П</StatusBadge>
          <StatusBadge variant='purple'>Л</StatusBadge>
          <StatusBadge variant='maroon'>Б</StatusBadge>
        </View>
      </BottomSheet>
    </View>
  );
}
