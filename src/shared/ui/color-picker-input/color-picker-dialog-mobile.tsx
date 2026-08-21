import { useState } from 'react';

import { Modal, ScrollView, View } from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel3,
} from 'reanimated-color-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { Text } from '@/shared/ui/text';

import { type ColorPickerDialogProps } from './types';

const COLOR_PREVIEW_SIZE = 64;

export function ColorPickerDialogMobile({
  initialColor,
  onClose,
  onSelect,
}: ColorPickerDialogProps) {
  const [draftColor, setDraftColor] = useState(() =>
    colorKit.HEX(initialColor, true).toUpperCase(),
  );
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible
      animationType='slide'
      presentationStyle='fullScreen'
      onRequestClose={onClose}
    >
      <View
        className='flex-1 bg-background'
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Header title='Вибір кольору' onBackPress={onClose} />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            padding: 24,
          }}
        >
          <ColorPicker
            value={initialColor}
            onCompleteJS={(color) => {
              const hex8 = colorKit.HEX(color.rgba, true).toUpperCase();
              setDraftColor(hex8);
            }}
          >
            <Panel3
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 999,
              }}
            />

            <View className='h-3' />

            <HueSlider
              sliderThickness={28}
              thumbSize={36}
              style={{
                borderRadius: 14,
              }}
            />

            <View className='h-3' />

            <BrightnessSlider
              sliderThickness={28}
              thumbSize={36}
              style={{
                borderRadius: 14,
              }}
            />

            <View className='h-3' />

            <OpacitySlider
              sliderThickness={28}
              thumbSize={36}
              style={{
                borderRadius: 14,
              }}
            />

            <View className='h-3' />

            <View className='items-center gap-1 my-2'>
              <View
                style={{
                  width: COLOR_PREVIEW_SIZE,
                  height: COLOR_PREVIEW_SIZE,
                  borderRadius: COLOR_PREVIEW_SIZE / 2,
                  backgroundColor: draftColor,
                }}
              />

              <Text className='text-[16px] font-bold text-text'>
                {draftColor}
              </Text>
            </View>
          </ColorPicker>

          <View className='flex-row gap-3 pt-4'>
            <ButtonBase
              variant='primary'
              appearance='outline'
              className='flex-1'
              onPress={onClose}
            >
              Скасувати
            </ButtonBase>

            <ButtonBase
              variant='primary'
              appearance='solid'
              className='flex-1'
              onPress={() => onSelect(draftColor)}
            >
              Обрати
            </ButtonBase>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
