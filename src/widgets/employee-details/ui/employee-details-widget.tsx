import { View } from 'react-native';

import { Archive } from '@/assets/svg';
import { getAvatarColor } from '@/shared/config/get-avatar-color';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/avatar';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { ButtonBase } from '@/shared/ui/button-base';
import { Text } from '@/shared/ui/text';

interface Employee {
  id: string;
  isActive: boolean;
  name: string;
}
interface EmployeeDetailsWidgetProps {
  actionLabel: string;
  employee: Employee | null;
  isArchiveAction?: boolean;
  isOpen: boolean;
  onAction: (id: string) => void;
  onClose: () => void;
  onEditNamePress?: () => void;
}

export function EmployeeDetailsWidget({
  employee,
  isOpen,
  onClose,
  onAction,
  actionLabel,
  isArchiveAction = false,
  onEditNamePress,
}: EmployeeDetailsWidgetProps) {
  if (!employee) return null;

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarColor = getAvatarColor(employee.name);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View className='items-center'>
        <Avatar initials={initials} color={avatarColor} size={72} />
        <Text className='font-bold text-primary mb-3 text-[24px] leading-[32px]'>
          {employee.name}
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
          onPress={onEditNamePress}
        >
          Редагувати ім’я
        </ButtonBase>

        <ButtonBase
          variant={isArchiveAction ? 'danger' : 'primary'}
          appearance='outline'
          className='mb-5 flex-row gap-2'
          onPress={() => onAction(employee.id)}
        >
          {isArchiveAction && (
            <Archive className='text-danger' height={24} width={24} />
          )}
          <Text
            className={cn(
              'font-bold text-[16px]',
              isArchiveAction ? 'text-danger' : 'text-primary',
            )}
          >
            {actionLabel}
          </Text>
        </ButtonBase>
      </View>
    </BottomSheet>
  );
}
