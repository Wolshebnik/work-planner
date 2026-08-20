import { useCallback, useMemo } from 'react';

import {
  type ScheduleStatus,
  useGetScheduleStatuses,
  useReorderScheduleStatuses,
} from '@/entities/schedule-status';

export function useScheduleStatusesList() {
  const { data: statuses = [], isLoading, error } = useGetScheduleStatuses();
  const reorderStatusesMutation = useReorderScheduleStatuses();

  const activeStatuses = useMemo(
    () => statuses.filter((s) => s.is_active),
    [statuses],
  );
  const archivedStatusesCount = statuses.length - activeStatuses.length;

  const handleDrop = useCallback(
    (_id: string, _position: number, allPositions?: Record<string, number>) => {
      if (!allPositions) return;

      const count = activeStatuses.length;
      const orderedActive = new Array<ScheduleStatus>(count);
      const seenPositions = new Set<number>();

      for (const status of activeStatuses) {
        const pos = allPositions[status.id];
        if (
          pos === undefined ||
          pos < 0 ||
          pos >= count ||
          seenPositions.has(pos)
        ) {
          return;
        }
        seenPositions.add(pos);
        orderedActive[pos] = status;
      }

      if (seenPositions.size !== count) {
        return;
      }

      const reorderedStatuses: ScheduleStatus[] = orderedActive.map(
        (status, index) => ({
          ...status,
          sort_order: (index + 1) * 10,
        }),
      );

      reorderStatusesMutation.mutate(reorderedStatuses);
    },
    [activeStatuses, reorderStatusesMutation],
  );

  return {
    activeStatuses,
    archivedStatusesCount,
    error,
    handleDrop,
    isLoading,
  };
}
