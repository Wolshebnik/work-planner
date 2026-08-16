import { View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { Archive } from '@/assets/svg';
import { Text } from '@/shared/ui/text';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { getAvatarColor } from '@/shared/config/get-avatar-color';

interface Employee {
  id: string;
  name: string;
  isActive: boolean;
}
interface EmployeeDetailsWidgetProps {
  isOpen: boolean;
  actionLabel: string;
  onClose: () => void;
  employee: Employee | null;
  isArchiveAction?: boolean;
  onAction: (id: string) => void;
}

export function EmployeeDetailsWidget({
  employee,
  isOpen,
  onClose,
  onAction,
  actionLabel,
  isArchiveAction = false,
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

        <Button
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
        </Button>

        <Button variant='primary' appearance='outline' className='mb-3 w-40'>
          Редагувати ім’я
        </Button>

        <Button
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
        </Button>
      </View>
    </BottomSheet>
  );
}
