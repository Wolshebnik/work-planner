import { useState } from 'react';

import { Modal, ScrollView, View } from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel3,
} from 'reanimated-color-picker';

import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { Text } from '@/shared/ui/text';

import { type ColorPickerDialogProps } from './types';

const PANEL_SIZE = 280;
const PREVIEW_SIZE = 64;

export function ColorPickerDialogMobile({
  initialColor,
  onClose,
  onSelect,
}: ColorPickerDialogProps) {
  const [draftColor, setDraftColor] = useState(() =>
    colorKit.HEX(initialColor, true).toUpperCase(),
  );

  return (
    <Modal
      visible
      animationType='slide'
      presentationStyle='fullScreen'
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-background'>
        <Header title='Вибір кольору' onBackPress={onClose} className='mb-2' />

        <ScrollView
          className='flex-1 px-6'
          contentContainerClassName='pb-6 items-center'
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <ColorPicker
            style={{ width: '100%', alignItems: 'center' }}
            value={initialColor}
            onCompleteJS={(color) => {
              const hex8 = colorKit.HEX(color.rgba, true).toUpperCase();
              setDraftColor(hex8);
            }}
          >
            <Panel3
              style={{
                width: PANEL_SIZE,
                height: PANEL_SIZE,
                borderRadius: PANEL_SIZE / 2,
                alignSelf: 'center',
              }}
            />

            <View className='h-3' />

            <HueSlider
              sliderThickness={26}
              thumbSize={34}
              style={{ borderRadius: 13, width: '100%' }}
            />

            <View className='h-3' />

            <BrightnessSlider
              sliderThickness={26}
              thumbSize={34}
              style={{ borderRadius: 13, width: '100%' }}
            />

            <View className='h-3' />

            <OpacitySlider
              sliderThickness={26}
              thumbSize={34}
              style={{ borderRadius: 13, width: '100%' }}
            />

            <View className='h-3' />

            <View className='items-center gap-1 mb-4'>
              <View
                style={{
                  width: PREVIEW_SIZE,
                  height: PREVIEW_SIZE,
                  borderRadius: PREVIEW_SIZE / 2,
                  backgroundColor: draftColor,
                }}
              />

              <Text className='text-[16px] font-bold text-text'>
                {draftColor}
              </Text>
            </View>
          </ColorPicker>
        </ScrollView>

        <View className='p-6 pt-0 flex-row gap-3'>
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
      </View>
    </Modal>
  );
}
