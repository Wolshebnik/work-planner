import { createContext, type ReactNode, useContext } from 'react';

import { useScheduleSlot } from './use-schedule-slot';

type ScheduleSlotContextValue = ReturnType<typeof useScheduleSlot>;

const ScheduleSlotContext = createContext<ScheduleSlotContextValue | null>(
  null,
);

export function ScheduleSlotProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useScheduleSlot();
  return (
    <ScheduleSlotContext.Provider value={value}>
      {children}
    </ScheduleSlotContext.Provider>
  );
}

export function useScheduleSlotContext(): ScheduleSlotContextValue {
  const context = useContext(ScheduleSlotContext);
  if (!context) {
    throw new Error(
      'useScheduleSlotContext must be used within a ScheduleSlotProvider',
    );
  }
  return context;
}
