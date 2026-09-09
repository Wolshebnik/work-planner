import type { GetCheckSheetAvailabilityStateParams } from './types';

export function getCheckSheetAvailabilityState({
  employeesError,
  hasSpreadsheet,
  isLoading,
  monthLabel,
  queryError,
  result,
}: GetCheckSheetAvailabilityStateParams) {
  let monthError: string | null = null;
  let weekError: string | null = null;
  let employeeError: string | null = null;

  if (!isLoading && !hasSpreadsheet) {
    monthError = 'Google Таблицю не підключено';
  }

  if (!isLoading && employeesError) {
    employeeError = 'Не вдалося завантажити працівників';
  }

  if (!isLoading && !monthError && queryError) {
    monthError =
      queryError instanceof Error
        ? queryError.message
        : `Вкладку "${monthLabel}" не знайдено в таблиці`;
  }

  if (!isLoading && !monthError && !result) {
    monthError = `Вкладку "${monthLabel}" не знайдено в таблиці`;
  }

  if (!isLoading && !monthError && result) {
    const missingDay = result.missingDays[0];

    if (missingDay) {
      weekError = `День ${Number(missingDay.slice(-2))} відсутній у вкладці`;
    }

    const missingNames = result.missingEmployees.map((employee) =>
      `${employee.last_name} ${employee.first_name}`.trim(),
    );

    const ambiguousNames = result.ambiguousEmployees.map((employee) =>
      `${employee.last_name} ${employee.first_name}`.trim(),
    );

    if (missingNames.length > 0) {
      const prefix = missingNames.length === 1 ? 'Працівника' : 'Працівників';
      employeeError = `${prefix} "${missingNames.join(', ')}" не знайдено в Google Таблиці`;
    }

    if (ambiguousNames.length > 0) {
      employeeError = `Неоднозначні працівники в Google Таблиці: "${ambiguousNames.join(', ')}"`;
    }
  }

  return {
    employeeError,
    isAvailable: !isLoading && !monthError && !weekError && !employeeError,
    monthError,
    weekError,
  };
}
