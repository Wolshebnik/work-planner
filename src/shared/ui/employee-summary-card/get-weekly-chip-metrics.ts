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
  rowWidth: number,
): WeeklyChipMetrics {
  const isCompact = weekCount >= 6;
  const weekGap = isCompact ? 2 : 3;
  const normalSlotWidth = isCompact ? 30 : 40;
  const scale = Math.max(
    0.65,
    Math.min(
      1,
      (rowWidth > 0
        ? (rowWidth - weekGap * Math.max(weekCount - 1, 0)) /
          Math.max(weekCount, 1)
        : normalSlotWidth) / normalSlotWidth,
    ),
  );

  return {
    chipHeight: (isCompact ? 36 : 48) * scale,
    chipPadding: (isCompact ? 2 : 4) * scale,
    isCompact,
    labelFontSize: (isCompact ? 6 : 10) * scale,
    labelLineHeight: (isCompact ? 8 : 14) * scale,
    valueFontSize: (isCompact ? 10 : 14) * scale,
    valueLineHeight: (isCompact ? 12 : 18) * scale,
  };
}
