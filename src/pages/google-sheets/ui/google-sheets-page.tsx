import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { GoogleSheetItemCard } from '@/entities/google-sheets';
import { ConnectGoogleSheetSheet } from '@/features/connect-google-sheet';
import { GoogleSheetDetailsSheet } from '@/features/sync-google-sheets';
import { ROUTES } from '@/shared/config/routes';
import { ButtonBase } from '@/shared/ui/button-base';
import { CircularProgressLoader } from '@/shared/ui/circular-progress-loader';
import { DeleteConfirmationSheet } from '@/shared/ui/delete-confirmation-sheet';
import { Header } from '@/shared/ui/header';
import { SectionTitle } from '@/shared/ui/section-title';
import { Text } from '@/shared/ui/text';

import { useGoogleSheetsPage } from '../model/use-google-sheets-page';
import { GoogleSheetsEmptyState } from './google-sheets-empty-state';
import { GoogleSheetsInfoCard } from './google-sheets-info-card';

export function GoogleSheetsPage() {
  const router = useRouter();
  const {
    sheets,
    isLoading,
    isSheetOpen,
    editingItem,
    deletingItem,
    selectedSheet,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetails,
    handleCloseDetails,
    handleCloseSheet,
    handleSave,
    setDeletingItem,
    handleDeleteConfirm,
  } = useGoogleSheetsPage();

  return (
    <View className='flex-1'>
      <Header
        title='Підключення до Google Sheets'
        onBackPress={() => router.push(ROUTES.MORE)}
      />

      <View className='flex-row items-center justify-between px-6 mb-3'>
        <SectionTitle
          text='ПІДКЛЮЧЕНІ ТАБЛИЦІ'
          className='font-bold text-[14px]'
        />

        <ButtonBase
          variant='primary'
          appearance='solid'
          onPress={handleOpenAdd}
        >
          + Додати
        </ButtonBase>
      </View>

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <CircularProgressLoader size='large' />
        </View>
      ) : (
        <ScrollView
          className='flex-1'
          contentContainerClassName='px-4 pb-6 gap-3'
        >
          {sheets.length === 0 ? (
            <GoogleSheetsEmptyState onPress={handleOpenAdd} />
          ) : (
            sheets.map((item) => (
              <GoogleSheetItemCard
                key={item.id}
                item={item}
                onPress={handleOpenDetails}
                onEdit={handleOpenEdit}
                onDelete={(selected) => setDeletingItem(selected)}
              />
            ))
          )}

          <GoogleSheetsInfoCard />
        </ScrollView>
      )}

      <GoogleSheetDetailsSheet
        isOpen={!!selectedSheet}
        item={selectedSheet}
        onClose={handleCloseDetails}
      />

      <ConnectGoogleSheetSheet
        isOpen={isSheetOpen}
        isEditing={editingItem !== null}
        sheetId={editingItem?.id}
        initialValues={
          editingItem
            ? { title: editingItem.title, url: editingItem.url }
            : null
        }
        onClose={handleCloseSheet}
        onSave={handleSave}
      />

      {deletingItem && (
        <DeleteConfirmationSheet
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title='Видалення таблиці'
          confirmText='Видалити'
          description={
            <Text className='text-[16px] text-text text-center'>
              Ви впевнені, що хочете видалити таблицю &nbsp;
              <Text className='text-[18px] text-danger'>
                {`"${deletingItem.title}"`}
              </Text>
              ?
            </Text>
          }
        />
      )}
    </View>
  );
}
