export function getWorkHours(excelMark: string | null | undefined): number {
  if (!excelMark?.trim()) {
    return 0;
  }

  const normalized = excelMark.trim().replace(',', '.');
  const value = Number(normalized);

  return Number.isFinite(value) ? value : 0;
}
