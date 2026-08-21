import { useEffect, useState } from 'react';

import {
  Keyboard,
  Modal,
  Pressable,
  View,
} from 'react-native';
import ColorPicker, {
  BrightnessSlider,
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel3,
} from 'reanimated-color-picker';

import { X } from '@/assets/svg';
import { ButtonBase } from '@/shared/ui/button-base';
import { Text } from '@/shared/ui/text';

import { type ColorPickerDialogProps } from './types';

const PANEL_SIZE = 200;
const PREVIEW_SIZE = 40;

export function ColorPickerDialogTablet({
  initialColor,
  onClose,
  onSelect,
}: ColorPickerDialogProps) {
  const [draftColor, setDraftColor] = useState(() =>
    colorKit.HEX(initialColor, true).toUpperCase(),
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal
      visible
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View
        className='flex-1 items-center justify-center p-4'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 16,
        }}
      >
        <Pressable className='absolute inset-0' onPress={onClose} />
        <View
          className='w-full max-w-[420px] rounded-28 bg-white p-5 shadow-xl'
          style={{
            borderRadius: 28,
          }}
        >
          <View className='mb-3 flex-row items-center justify-between'>
            <Text className='font-bold text-primary text-[18px]'>
              Вибір кольору
            </Text>

            <Pressable
              accessibilityLabel='Закрити'
              accessibilityRole='button'
              className='ml-auto h-8 w-8 items-center justify-center rounded-full active:bg-neutral/10'
              onPress={onClose}
            >
              <X className='text-primary' height={16} width={16} />
            </Pressable>
          </View>

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
              sliderThickness={20}
              thumbSize={28}
              style={{ borderRadius: 10, width: '100%' }}
            />

            <View className='h-2' />

            <BrightnessSlider
              sliderThickness={20}
              thumbSize={28}
              style={{ borderRadius: 10, width: '100%' }}
            />

            <View className='h-2' />

            <OpacitySlider
              sliderThickness={20}
              thumbSize={28}
              style={{ borderRadius: 10, width: '100%' }}
            />

            <View className='h-3' />

            <View className='items-center gap-1 mb-3'>
              <View
                style={{
                  width: PREVIEW_SIZE,
                  height: PREVIEW_SIZE,
                  borderRadius: PREVIEW_SIZE / 2,
                  backgroundColor: draftColor,
                }}
              />

              <Text className='text-[15px] font-bold text-text'>
                {draftColor}
              </Text>
            </View>
          </ColorPicker>

          <View className='flex-row gap-3 pt-1'>
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
      </View>
    </Modal>
  );
}
