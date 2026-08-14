import { Text } from '@/shared/ui/text';

interface SectionTitleProps {
  text: string;
}

export function SectionTitle({ text }: SectionTitleProps) {
  return (
    <Text className='my-4 font-medium text-[12px] leading-[16px]'>
      {text}
    </Text>
  );
}
