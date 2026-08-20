import { View } from 'react-native';

import { User } from '@/assets/svg';
import { getGoogleUserInitials, useGoogleAuth } from '@/entities/google-auth';
import { Avatar } from '@/shared/ui/avatar';
import { ButtonLoader } from '@/shared/ui/button-loader';
import { Text } from '@/shared/ui/text';

export function GoogleAccountCard() {
  const {
    user: googleUser,
    signIn: signInGoogle,
    signOut: signOutGoogle,
    isSigningIn,
    isSigningOut,
  } = useGoogleAuth();

  if (googleUser) {
    return (
      <View className='flex-row items-center gap-3 p-3.5 bg-white rounded-12 border border-border shadow-card mb-5'>
        <Avatar
          imageUri={googleUser.photo ?? undefined}
          initials={getGoogleUserInitials(googleUser.name)}
          size={44}
        />
        <View className='flex-1 gap-0.5'>
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
        <ButtonLoader
          variant='danger'
          appearance='outline'
          loaderColor='#ef4444'
          loading={isSigningOut}
          onPress={() => void signOutGoogle()}
        >
          Вийти
        </ButtonLoader>
      </View>
    );
  }

  return (
    <View className='flex-row items-center gap-3 p-3.5 bg-white rounded-12 border border-border shadow-card mb-5'>
      <View className='h-11 w-11 rounded-full bg-neutral items-center justify-center border border-border'>
        <User className='text-grey' height={22} width={22} />
      </View>
      <View className='flex-1 gap-0.5'>
        <Text className='font-bold text-[15px] text-primary'>Google акаунт</Text>
        <Text className='text-[12px] text-grey leading-[16px]'>
          Увійдіть для синхронізації з Google Sheets
        </Text>
      </View>
      <ButtonLoader
        variant='primary'
        appearance='solid'
        loaderColor='#ffffff'
        loading={isSigningIn}
        onPress={() => void signInGoogle()}
      >
        Увійти
      </ButtonLoader>
    </View>
  );
}
