import { cssInterop } from 'nativewind';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export function styledSvg(Icon: ComponentType<SvgProps>) {
  return cssInterop(Icon, {
    className: { target: 'style', nativeStyleToProp: { color: true } },
  });
}
