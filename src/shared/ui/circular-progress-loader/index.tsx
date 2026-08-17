import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

type CircularProgressLoaderProps = {
  size?: 'small' | 'large' | number;
  color?: string;
  className?: string;
} & ActivityIndicatorProps;

export function CircularProgressLoader({
  size = 'small',
  color = '#000000',
  className,
  ...props
}: CircularProgressLoaderProps) {
  return (
    <ActivityIndicator
      {...props}
      size={size}
      color={color}
      className={className}
    />
  );
}
