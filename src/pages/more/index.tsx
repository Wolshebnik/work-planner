import { Alert, ScrollView, View } from 'react-native';

import { getGoogleUserInitials, useGoogleAuth } from '@/entities/google-auth';
import { GoogleSheetsCard } from '@/entities/google-sheets';
import { ScheduleStatusesCard } from '@/entities/schedule-status';
import { Avatar } from '@/shared/ui/avatar';
import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

export function MorePage() {
  const {
    user: googleUser,
    signIn: signInGoogle,
    signOut: signOutGoogle,
  } = useGoogleAuth();

  const handleAvatarPress = () => {
    if (!googleUser) {
      void signInGoogle();
    } else {
      Alert.alert(
        googleUser.name ?? 'Google профіль',
        googleUser.email ?? undefined,
        [
          {
            text: 'Скасувати',
            style: 'cancel',
          },
          {
            text: 'Вийти з акаунта',
            style: 'destructive',
            onPress: () => {
              void signOutGoogle();
            },
          },
        ],
      );
    }
  };

  return (
    <View className='flex-1'>
      <Header
        title='Ще'
        avatarUrl={googleUser?.photo ?? undefined}
        avatarInitials={getGoogleUserInitials(googleUser?.name)}
        onAvatarPress={handleAvatarPress}
      />

      <ScrollView
        className='flex-1'
        contentContainerClassName='px-4 pb-4'
      >
        {googleUser ? (
          <View className='mb-5'>
            <SectionTitle text='АКАУНТ GOOGLE' className='font-bold text-[12px] pl-2 mb-2' />
            <View className='flex-row items-center gap-3 p-3 bg-white rounded-12 border border-border shadow-card'>
              <Avatar
                imageUri={googleUser.photo ?? undefined}
                initials={getGoogleUserInitials(googleUser.name)}
                size={48}
              />
              <View className='flex-1'>
                {googleUser.name ? (
                  <Text className='font-bold text-[15px] text-primary' numberOfLines={1}>
                    {googleUser.name}
                  </Text>
                ) : null}
                {googleUser.email ? (
                  <Text className='text-[13px] text-grey' numberOfLines={1}>
                    {googleUser.email}
                  </Text>
                ) : null}
              </View>
              <ButtonBase
                variant='danger'
                appearance='outline'
                onPress={() => void signOutGoogle()}
              >
                Вийти
              </ButtonBase>
            </View>
          </View>
        ) : null}

        <SectionTitle text='ГРАФІК' className='font-bold text-[12px] pl-2 mb-2' />
        <ScheduleStatusesCard className='w-full' />

        <SectionTitle text='ІНТЕГРАЦІЇ' className='font-bold text-[12px] pl-2 mt-5 mb-2' />
        <GoogleSheetsCard className='w-full' />
      </ScrollView>
    </View>
  );
}
