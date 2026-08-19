export function isWorkStatus(excelMark: string | null | undefined): boolean {
  if (!excelMark?.trim()) {
    return false;
  }

  const value = Number(excelMark.trim());

  return Number.isFinite(value) && value > 0;
}
