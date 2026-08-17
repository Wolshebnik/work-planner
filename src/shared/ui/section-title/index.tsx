import { cn } from '@/shared/lib/cn';
import { Text } from '@/shared/ui/text';

interface SectionTitleProps {
  className?: string;
  text: string;
}

export function SectionTitle({ text, className }: SectionTitleProps) {
  return (
    <Text
      className={cn('my-4 font-medium text-[12px] leading-[16px]', className)}
    >
      {text}
    </Text>
  );
}
