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
  _rowWidth: number = 0,
): WeeklyChipMetrics {
  const isCompact = weekCount >= 6;

  return {
    chipHeight: 48,
    chipPadding: isCompact ? 2 : 4,
    isCompact,
    labelFontSize: 10,
    labelLineHeight: 14,
    valueFontSize: 14,
    valueLineHeight: 18,
  };
}
