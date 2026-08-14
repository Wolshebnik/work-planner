export interface AvatarColor {
  backgroundColor: string;
  textColor: string;
}

export const avatarColors: readonly AvatarColor[] = [
  { backgroundColor: '#F0E1FF', textColor: '#7C4DDB' },
  { backgroundColor: '#D1F5E1', textColor: '#087A58' },
  { backgroundColor: '#E0E6FF', textColor: '#4657B8' },
  { backgroundColor: '#CFF5F8', textColor: '#0C7080' },
  { backgroundColor: '#F2E5FF', textColor: '#8444AF' },
  { backgroundColor: '#D4F7F0', textColor: '#087568' },
  { backgroundColor: '#DDEFFF', textColor: '#186D98' },
  { backgroundColor: '#F7E8F0', textColor: '#A0476B' },
  { backgroundColor: '#E8F0DE', textColor: '#617C2A' },
  { backgroundColor: '#E8ECF7', textColor: '#50618A' },
];

export function shuffleAvatarColors() {
  const shuffledColors = [...avatarColors];

  for (let index = shuffledColors.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledColors[index], shuffledColors[randomIndex]] = [
      shuffledColors[randomIndex],
      shuffledColors[index],
    ];
  }

  return shuffledColors;
}
