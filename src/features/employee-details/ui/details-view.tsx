import { View } from 'react-native';

import { Archive } from '@/assets/svg';
import { getAvatarColor } from '@/shared/config/get-avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { ButtonBase } from '@/shared/ui/button-base';
import { Text } from '@/shared/ui/text';

import { type EmployeeData } from '../model/schema';

interface DetailsViewProps {
  employee: EmployeeData;
  onEditPress: () => void;
  onArchive: (id: string) => void;
}

export function DetailsView({
  employee,
  onEditPress,
  onArchive,
}: DetailsViewProps) {
  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarColor = getAvatarColor(employee.name || ' ');

  return (
    <View className='items-center'>
      <Avatar initials={initials} color={avatarColor} size={72} />
      <Text className='font-bold text-primary mb-3 text-[24px] leading-[32px]'>
        {employee.name || 'Новий працівник'}
      </Text>

      <ButtonBase
        variant='grey'
        appearance='outline'
        className='mb-3 flex-row gap-2 py-1'
      >
        <View
          className={cn(
            'w-4 h-4 rounded-full',
            employee.isActive ? 'bg-success' : 'bg-danger',
          )}
        />
        <Text className='font-bold text-grey text-[12px]'>
          {employee.isActive ? 'Активний' : 'Неактивний'}
        </Text>
      </ButtonBase>

      <ButtonBase
        variant='primary'
        appearance='outline'
        className='mb-3 w-40'
        onPress={onEditPress}
      >
        Редагувати ім’я
      </ButtonBase>

      <ButtonBase
        variant='danger'
        appearance='outline'
        className='mb-5 flex-row gap-2'
        onPress={() => onArchive(employee.id)}
      >
        <Archive className='text-danger' height={24} width={24} />
        <Text className='font-bold text-[16px] text-danger'>
          Архівувати працівника
        </Text>
      </ButtonBase>
    </View>
  );
}
