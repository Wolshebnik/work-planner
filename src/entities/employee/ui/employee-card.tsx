import { TouchableOpacity, View } from 'react-native';

import type { AvatarColor } from '@/shared/config/get-avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { Text } from '@/shared/ui/text';

interface Employee {
  color?: AvatarColor;
  id?: string;
  isActive: boolean;
  name: string;
}
interface EmployeeCardProps {
  className?: string;
  employee: Employee;
  isArchived?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export function EmployeeCard({
  employee,
  className,
  onPress,
  isArchived,
  rightElement,
}: EmployeeCardProps) {
  const { name, isActive, color } = employee;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={cn(
        'flex-row items-center gap-3 p-3 bg-white rounded-12 border border-border shadow-card',
        className,
      )}
    >
      <Avatar
        initials={initials}
        color={isArchived ? undefined : color}
      />

      <View className='flex-1'>
        <Text className='font-bold text-[14px]'>{name}</Text>
        <Text
          className={cn('text-[12px]', isActive ? 'text-grey' : 'text-danger')}
        >
          {isActive ? 'Активний' : 'Неактивний'}
        </Text>
      </View>
      {rightElement}
    </TouchableOpacity>
  );
}
