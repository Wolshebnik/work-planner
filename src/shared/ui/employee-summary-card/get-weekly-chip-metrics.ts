export interface WeeklyChipMetrics {
  chipHeight: number;
  chipPadding: number;
  isCompact: boolean;
  labelFontSize: number;
  labelLineHeight: number;
  valueFontSize: number;
  valueLineHeight: number;
}

export function getWeeklyChipMetrics(
  weekCount: number,
  rowWidth: number = 0,
): WeeklyChipMetrics {
  const isCompact = weekCount >= 6;
  const weekGap = isCompact ? 2 : 3;
  const estimatedSlotWidth = isCompact ? 34 : 44;
  const slotWidth =
    rowWidth > 0
      ? (rowWidth - weekGap * Math.max(weekCount - 1, 0)) /
        Math.max(weekCount, 1)
      : estimatedSlotWidth;

  if (slotWidth >= 55) {
    return {
      chipHeight: 52,
      chipPadding: 4,
      isCompact: false,
      labelFontSize: 13,
      labelLineHeight: 17,
      valueFontSize: 18,
      valueLineHeight: 22,
    };
  }

  if (slotWidth >= 40) {
    return {
      chipHeight: 48,
      chipPadding: 3,
      isCompact: false,
      labelFontSize: 11,
      labelLineHeight: 15,
      valueFontSize: 15,
      valueLineHeight: 19,
    };
  }

  const scale = Math.max(0.75, Math.min(1, slotWidth / 36));

  return {
    chipHeight: 48,
    chipPadding: 1,
    isCompact: true,
    labelFontSize: Math.max(7.5, Math.round(10 * scale * 10) / 10),
    labelLineHeight: Math.max(10, Math.round(14 * scale)),
    valueFontSize: Math.max(11, Math.round(14 * scale)),
    valueLineHeight: Math.max(14, Math.round(18 * scale)),
  };
}
