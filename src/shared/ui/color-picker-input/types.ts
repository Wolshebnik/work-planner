export interface ColorPickerDialogProps {
  initialColor: string;
  onClose: () => void;
  onSelect: (color: string) => void;
}
