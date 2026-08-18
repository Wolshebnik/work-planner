import { Link, usePathname } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Calendar, Dots, Team } from '@/assets/svg';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

const navigationItems = [
  { href: ROUTES.HOME, label: 'Графік', Icon: Calendar },
  { href: ROUTES.TEAM, label: 'Команда', Icon: Team },
  { href: ROUTES.MORE, label: 'Ще', Icon: Dots },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <View className='relative flex-row border-t border-border bg-neutral'>
      {navigationItems.map(({ href, label, Icon }) => {
        const isActive =
          href === ROUTES.HOME
            ? pathname === ROUTES.HOME
            : pathname.startsWith(href);

        return (
          <Link key={href} href={href} asChild>
            <Pressable
              accessibilityRole='tab'
              accessibilityState={{ selected: isActive }}
              className='items-center flex-1 py-2'
            >
              <View
                className={cn(
                  'items-center justify-center overflow-hidden rounded-full px-6 py-1',
                  isActive && 'bg-blue-light/40',
                )}
              >
                <Icon
                  className={cn('text-text', isActive && 'text-primary')}
                  height={24}
                  width={24}
                />
              </View>
              <Text
                className={cn(
                  'font-medium text-[12px] leading-4',
                  isActive && 'text-primary',
                )}
              >
                {label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}
