import { TouchableOpacity, View } from 'react-native';

import { Table, Trash } from '@/assets/svg';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

import { type GoogleSheetItem } from '../model/types';

interface GoogleSheetItemCardProps {
  className?: string;
  item: GoogleSheetItem;
  onDelete: (item: GoogleSheetItem) => void;
  onPress: (item: GoogleSheetItem) => void;
}

export function GoogleSheetItemCard({
  item,
  onPress,
  onDelete,
  className,
}: GoogleSheetItemCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      className={cn(
        'border-l-4 border-primary flex-row items-center bg-white rounded-12 border p-4 gap-3 shadow-card',
        className,
      )}
    >
      <View className='h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20'>
        <Table className='text-primary' height={20} width={20} />
      </View>

      <View className='flex-1 gap-1'>
        <Text className='font-bold text-[16px] text-primary'>{item.title}</Text>

        <Text className='text-[13px] text-text leading-4.5'>{item.url}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={(e) => {
          e.stopPropagation();
          onDelete(item);
        }}
        accessibilityLabel='Видалити таблицю'
        className='h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-danger/10'
      >
        <Trash className='text-danger' height={18} width={18} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
