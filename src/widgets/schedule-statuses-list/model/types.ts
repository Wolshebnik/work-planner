import { type ReactNode } from 'react';

import { type ScheduleStatus } from '@/entities/schedule-status';

export interface ScheduleStatusesListProps {
  onDeleteStatus: (status: ScheduleStatus) => void;
  onStatusPress: (status: ScheduleStatus) => void;
  refreshControl?: ReactNode;
  scrollEnabled?: boolean;
}
