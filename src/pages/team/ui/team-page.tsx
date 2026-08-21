import { useCallback } from 'react';

import { View } from 'react-native';
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
import { ButtonBase } from '@/shared/ui/button-base';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { Header } from '@/shared/ui/header';
import { ResponsiveContainer } from '@/shared/ui/responsive-container';
import { SectionTitle } from '@/shared/ui/section-title';
import { SortableList } from '@/shared/ui/sortable-list';

import { useTeamPage } from '../model/use-team-page';

export function TeamPage() {
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
          <ResponsiveContainer className='pb-3 px-4'>
            <EmployeeCard
              employee={cardData}
              onPress={() => setSelectedEmployee(cardData)}
            />
          </ResponsiveContainer>
        </SortableItem>
      );
    },
    [getCardData, handleDrop, setSelectedEmployee],
  );

  return (
    <View className='flex-1'>
      <Header title='Команда' className='mb-4' />

      <ResponsiveContainer className='flex-row items-center justify-between px-6 mb-5'>
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
      </ResponsiveContainer>

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
                <ResponsiveContainer className='pt-2 pb-6 px-4'>
                  <ArchivedEmployeesCard count={archivedEmployeesCount} />
                </ResponsiveContainer>
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
