import { View, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';

import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';
import { Dots, Team, Calendar } from '@/assets/svg';

const navigationItems = [
  { href: '/', label: 'Графік', Icon: Calendar },
  { href: '/team', label: 'Команда', Icon: Team },
  { href: '/more', label: 'Ще', Icon: Dots },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <View className='relative flex-row border-t border-border bg-neutral'>
      {navigationItems.map(({ href, label, Icon }) => {
        const isActive = pathname === href;

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
                  isActive && 'bg-blue-light',
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
