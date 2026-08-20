import { useMemo, useState } from 'react';

import { useRouter } from 'expo-router';

import {
  type ScheduleStatus,
  useGetScheduleStatuses,
  useRestoreScheduleStatus,
} from '@/entities/schedule-status';
import { ROUTES } from '@/shared/config/routes';

export function useScheduleStatusesArchivedPage() {
  const router = useRouter();

  const { data: statuses = [], isLoading } = useGetScheduleStatuses();
  const restoreStatusMutation = useRestoreScheduleStatus();

  const [restoringStatus, setRestoringStatus] = useState<ScheduleStatus | null>(
    null,
  );

  const archivedStatuses = useMemo(
    () => statuses.filter((s) => !s.is_active),
    [statuses],
  );

  const handleRestore = () => {
    if (!restoringStatus) return;
    const statusId = restoringStatus.id;
    const isLastStatus = archivedStatuses.length <= 1;
    setRestoringStatus(null);
    restoreStatusMutation.mutate(statusId);
    if (isLastStatus) {
      router.push(ROUTES.MORE_SCHEDULE_STATUSES);
    }
  };

  const handleClose = () => {
    setRestoringStatus(null);
  };

  return {
    archivedStatuses,
    isLoading,
    restoringStatus,
    setRestoringStatus,
    isRestorePending: restoreStatusMutation.isPending,
    handleRestore,
    handleClose,
  };
}
