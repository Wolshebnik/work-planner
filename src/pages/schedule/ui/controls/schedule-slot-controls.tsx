import { View } from 'react-native';

import { SchedulePeriodSwitcher } from './schedule-period-switcher';
import { ScheduleViewSwitcher } from './schedule-view-switcher';

export function ScheduleSlotControls() {
  return (
    <View className='mb-3 px-4'>
      <SchedulePeriodSwitcher className='mb-5' />
      <ScheduleViewSwitcher />
    </View>
  );
}
