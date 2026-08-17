import { ScrollView } from 'react-native';

import { EmployeeStatus } from '@/shared/config/employee-status';
import { ScheduleStatusItem } from '@/shared/ui/schedule-status-item';
import { type BadgeVariant } from '@/shared/ui/status-badge/status-badge-appearance';

const employeeStatusOrder = [
  'WORK',
  'OFF',
  'SICK',
  'VACATION',
  'NA',
  'ST',
  'ABSENT',
  'FIRED',
] as const;

interface Props {
  onStatusPress: (status: { title: string }) => void;
  onDeleteStatus: (status: { title: string }) => void;
}

export const ScheduleStatusesList = ({ onStatusPress, onDeleteStatus }: Props) => {
  return (
    <ScrollView className='flex-1'>
      {employeeStatusOrder.map((key) => {
        const config = EmployeeStatus[key];

        return (
          <ScheduleStatusItem
            key={key}
            title={config.label}
            description={`${config.short} · Опис для ${config.label.toLowerCase()}`}
            status={config.short}
            variant={config.variant as BadgeVariant}
            onPress={() => onStatusPress({ title: config.label })}
            onDelete={() => onDeleteStatus({ title: config.label })}
          />
        );
      })}
    </ScrollView>
  );
};
