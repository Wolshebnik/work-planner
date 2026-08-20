import { Redirect } from 'expo-router';

import { ROUTES } from '@/shared/config/routes';

export default function ScheduleIndexRoute() {
  return <Redirect href={ROUTES.SCHEDULE_WEEK} />;
}
