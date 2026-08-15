import { styled } from 'nativewind';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export function styledSvg(Icon: ComponentType<SvgProps>) {
  return styled(Icon, {
    className: { target: 'style', nativeStyleMapping: { color: 'color' } },
  });
}
