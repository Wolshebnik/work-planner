import { useState } from 'react';

import { Modal, View } from 'react-native';
import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel3,
} from 'reanimated-color-picker';

import { ButtonBase } from '@/shared/ui/button-base';
import { Header } from '@/shared/ui/header';
import { Text } from '@/shared/ui/text';

interface ColorPickerDialogProps {
  initialColor: string;
  onClose: () => void;
  onSelect: (color: string) => void;
}

const COLOR_PREVIEW_SIZE = 100;

export function ColorPickerDialog({
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
        <Header title='Вибір кольору' onBackPress={onClose} />

        <View className='flex-1 p-6'>
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

            <View className='h-6' />

            <HueSlider
              sliderThickness={32}
              thumbSize={40}
              style={{
                borderRadius: 16,
              }}
            />

            <View className='h-4' />

            <OpacitySlider
              sliderThickness={32}
              thumbSize={40}
              style={{
                borderRadius: 16,
              }}
            />

            <View className='h-5' />

            <View className='items-center gap-2'>
              <View
                style={{
                  width: COLOR_PREVIEW_SIZE,
                  height: COLOR_PREVIEW_SIZE,
                  borderRadius: COLOR_PREVIEW_SIZE / 2,
                  backgroundColor: draftColor,
                }}
              />

              <Text className='text-[18px] font-bold text-text'>
                {draftColor}
              </Text>
            </View>
          </ColorPicker>

          <View className='mt-auto flex-row gap-3'>
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
