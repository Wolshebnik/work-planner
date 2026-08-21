import { type ReactNode } from 'react';

export interface BottomSheetProps {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}
