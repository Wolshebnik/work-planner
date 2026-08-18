export const scheduleKeys = {
  all: ['schedule'] as const,
  month: (monthKey: string) =>
    [...scheduleKeys.all, 'month', monthKey] as const,
};
