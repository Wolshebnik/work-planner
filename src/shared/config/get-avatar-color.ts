import { AvatarColor } from './avatar-color';

const COLORS: AvatarColor[] = [
  { backgroundColor: '#F8D7DA', textColor: '#721C24' }, // 0 Red
  { backgroundColor: '#D4EDDA', textColor: '#155724' }, // 1 Green
  { backgroundColor: '#FFF3CD', textColor: '#856404' }, // 2 Yellow
  { backgroundColor: '#E0D4F1', textColor: '#4A1C72' }, // 3 Purple (Replaced Cyan)
  { backgroundColor: '#E2E3E5', textColor: '#383D41' }, // 4 Gray
  { backgroundColor: '#F8E1F4', textColor: '#721C64' }, // 5 Pink
  { backgroundColor: '#D4F1ED', textColor: '#0C6057' }, // 6 Teal (Replaced Light Cyan)
  { backgroundColor: '#F4F8E1', textColor: '#60570C' }, // 7 Lime
  { backgroundColor: '#F8EBE1', textColor: '#60380C' }, // 8 Orange
  { backgroundColor: '#E1E8F8', textColor: '#0C2460' }, // 9 Navy
];

export function getAvatarColor(name: string): AvatarColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}
