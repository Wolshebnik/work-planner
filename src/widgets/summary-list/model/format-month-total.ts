export function formatMonthTotal(totalHours: number): string {
  if (totalHours <= 0) {
    return '0';
  }

  const days = Math.floor(totalHours / 9);
  const remainingHours = Math.round((totalHours % 9) * 10) / 10;

  if (days === 0) {
    return `${remainingHours}г`;
  }

  if (remainingHours === 0) {
    return `${days}`;
  }

  if (Number.isInteger(remainingHours)) {
    return `${days}.${remainingHours}`;
  }

  return `${days}д ${remainingHours}г`;
}
