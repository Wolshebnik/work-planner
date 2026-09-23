export function getWorkHours(excelMark: string | null | undefined): number {
  if (!excelMark?.trim()) {
    return 0;
  }

  const trimmed = excelMark.trim();

  if (trimmed.toUpperCase() === 'СТ' || trimmed.toUpperCase() === 'CT') {
    return 4.5;
  }

  const normalized = trimmed.replace(',', '.');
  const value = Number(normalized);

  return Number.isFinite(value) && value > 0 ? value : 0;
}
