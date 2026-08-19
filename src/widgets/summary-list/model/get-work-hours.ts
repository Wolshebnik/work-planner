export function getWorkHours(excelMark: string | null | undefined): number {
  if (!excelMark?.trim()) {
    return 0;
  }

  const value = Number(excelMark);

  return Number.isFinite(value) ? value : 0;
}
