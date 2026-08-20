import { Slot } from 'expo-router';

import { ScheduleSlotLayout } from '@/pages/schedule';

export default function ScheduleLayoutRoute() {
  return (
    <ScheduleSlotLayout>
      <Slot />
    </ScheduleSlotLayout>
  );
}
