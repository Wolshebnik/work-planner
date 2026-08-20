import { useCallback } from 'react';

import { Alert, View } from 'react-native';
import {
  SortableItem,
  type SortableRenderItemProps,
} from 'react-native-reanimated-dnd';

import {
  ArchivedEmployeesCard,
  type Employee,
  EmployeeCard,
} from '@/entities/employee';
import {
  EmployeeAddSheet,
  EmployeeDetailsSheet,
} from '@/features/employee-details';
import { getGoogleUserInitials, useGoogleAuth } from '@/entities/google-auth';
import { ButtonBase } from '@/shared/ui/button-base';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { SortableList } from '@/shared/ui/sortable-list';

import { useTeamPage } from '../model/use-team-page';

export function TeamPage() {
  const {
    user: googleUser,
    signIn: signInGoogle,
    signOut: signOutGoogle,
  } = useGoogleAuth();
  const {
    activeEmployees,
    archivedEmployeesCount,
    getCardData,
    handleAddEmployee,
    handleDrop,
    handleUpdateEmployee,
    isAddOpen,
    isLoading,
    selectedEmployee,
    setIsAddOpen,
    setSelectedEmployee,
  } = useTeamPage();

  const renderItem = useCallback(
    (props: SortableRenderItemProps<Employee>) => {
      const { item, id, ...rest } = props;
      const cardData = getCardData(item);

      return (
        <SortableItem
          key={id}
          id={id}
          data={item}
          onDrop={handleDrop}
          {...rest}
        >
          <View className='pb-3 px-4'>
            <EmployeeCard
              employee={cardData}
              onPress={() => setSelectedEmployee(cardData)}
            />
          </View>
        </SortableItem>
      );
    },
    [getCardData, handleDrop, setSelectedEmployee],
  );

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
        title='Команда'
        avatarUrl={googleUser?.photo ?? undefined}
        avatarInitials={getGoogleUserInitials(googleUser?.name)}
        onAvatarPress={handleAvatarPress}
      />

      <View className='flex-row items-center justify-between px-6 mb-5'>
        <SectionTitle
          text={`${activeEmployees.length} активних працівників`}
          className='font-bold text-[18px]'
        />
        <ButtonBase
          variant='primary'
          appearance='solid'
          onPress={() => setIsAddOpen(true)}
        >
          + Додати
        </ButtonBase>
      </View>

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <CircularProgressLoader size='large' />
        </View>
      ) : (
        <View className='flex-1'>
          <SortableList
            data={activeEmployees}
            itemHeight={78}
            useFlatList={false}
            renderItem={renderItem}
            style={{ backgroundColor: 'transparent' }}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListFooterComponent={
              archivedEmployeesCount > 0 ? (
                <View className='pt-2 pb-6 px-4'>
                  <ArchivedEmployeesCard count={archivedEmployeesCount} />
                </View>
              ) : null
            }
          />
        </View>
      )}

      <EmployeeDetailsSheet
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onSave={handleUpdateEmployee}
      />

      <EmployeeAddSheet
        employee={isAddOpen ? { id: 'new', name: '', isActive: true } : null}
        isOpen={isAddOpen}
        initialMode='edit'
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddEmployee}
      />
    </View>
  );
}
