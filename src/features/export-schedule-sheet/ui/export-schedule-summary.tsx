import { View } from 'react-native';

import { Text } from '@/shared/ui/text';

export interface ExportScheduleSummaryProps {
  monthLabel: string;
  sourceLabel: string;
  weekLabel: string;
}

export function ExportScheduleSummary({
  monthLabel,
  sourceLabel,
  weekLabel,
}: ExportScheduleSummaryProps) {
  return (
    <View className='flex-row gap-3 rounded-12 border border-primary/15 bg-primary/5 p-4'>
      <View className='mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-primary'>
        <Text className='font-bold text-[12px] text-white'>i</Text>
      </View>

      <View className='flex-1 gap-1.5'>
        <Text className='font-medium text-[14px] text-text'>
          Буде відправлено:
        </Text>

        <View className='flex-row items-center gap-2'>
          <Text className='w-28 shrink-0 text-[13px] text-grey'>Місяць:</Text>
          <Text
            className='flex-1 font-bold text-[13px] text-text'
            numberOfLines={1}
          >
            {monthLabel}
          </Text>
        </View>

        <View className='flex-row items-center gap-2'>
          <Text className='w-28 shrink-0 text-[13px] text-grey'>Тиждень:</Text>
          <Text
            className='flex-1 font-bold text-[13px] text-text'
            numberOfLines={1}
          >
            {weekLabel}
          </Text>
        </View>

        <View className='flex-row items-center gap-2'>
          <Text className='w-28 shrink-0 text-[13px] text-grey'>Джерело:</Text>
          <Text
            className='flex-1 font-bold text-[13px] text-text'
            numberOfLines={1}
          >
            {sourceLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}