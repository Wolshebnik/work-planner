import { Redirect } from 'expo-router';

import { ROUTES } from '@/shared/config/routes';

export default function HomeRoute() {
  return <Redirect href={ROUTES.SCHEDULE_WEEK} />;
}
