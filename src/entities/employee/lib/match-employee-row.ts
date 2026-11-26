import type { Employee } from '../model/schema';

interface EmployeeRowMatch {
  ambiguous: boolean;
  rowIndex: number | null;
}

function findEmployeeNameColumnIndex(
  sheetRows: (string | number)[][],
): number | null {
  for (const row of sheetRows) {
    const columnIndex = row.findIndex(
      (value) =>
        String(value ?? '')
          .replace(/[.\s]/g, '')
          .toLowerCase() === 'фио',
    );

    if (columnIndex !== -1) return columnIndex;
  }

  return null;
}

function resolveEmployeeRow(
  employee: Employee,
  sheetRows: (string | number)[][],
  usedRows: Set<number>,
  nameColumnIndex: number | null,
): EmployeeRowMatch {
  if (nameColumnIndex === null) {
    return { ambiguous: false, rowIndex: null };
  }

  const lastName = employee.last_name.trim().toLowerCase();
  const firstName = employee.first_name.trim().toLowerCase();
  const firstInitial = firstName.charAt(0);
  const candidates = new Map<number, number>();

  for (let rowIndex = 0; rowIndex < sheetRows.length; rowIndex += 1) {
    if (usedRows.has(rowIndex)) continue;

    const row = sheetRows[rowIndex] ?? [];
    const cell = String(row[nameColumnIndex] ?? '')
      .trim()
      .toLowerCase();
    const cellWords = cell.split(/[\s.,;:]+/).filter(Boolean);
    let score = 0;

    if (cellWords.includes(lastName) && !firstName) {
      score = 50;
    }

    if (cellWords.includes(lastName) && cellWords.includes(firstName)) {
      score = 100;
    }

    if (
      cellWords.includes(lastName) &&
      firstInitial &&
      (cellWords.includes(firstInitial) ||
        cellWords.includes(`${firstInitial}.`))
    ) {
      score = Math.max(score, 80);
    }

    if (score > 0) candidates.set(rowIndex, score);
  }

  if (candidates.size === 0) return { ambiguous: false, rowIndex: null };

  const highestScore = Math.max(...candidates.values());
  const bestRows = [...candidates].filter(
    ([, score]) => score === highestScore,
  );

  return {
    ambiguous: bestRows.length > 1,
    rowIndex: bestRows.length === 1 ? bestRows[0][0] : null,
  };
}

export function findEmployeeRowIndex(
  employee: Employee,
  sheetRows: (string | number)[][],
  usedRows: Set<number>,
): number | null {
  const nameColumnIndex = findEmployeeNameColumnIndex(sheetRows);
  const match = resolveEmployeeRow(
    employee,
    sheetRows,
    usedRows,
    nameColumnIndex,
  );
  return match.ambiguous ? null : match.rowIndex;
}

export function matchEmployeesWithSheet(
  employees: Employee[],
  sheetRows: (string | number)[][],
) {
  const usedRows = new Set<number>();
  const missingEmployees: Employee[] = [];
  const ambiguousEmployees: Employee[] = [];
  const matchedMap = new Map<string, number>();
  const nameColumnIndex = findEmployeeNameColumnIndex(sheetRows);

  for (const emp of employees) {
    const match = resolveEmployeeRow(
      emp,
      sheetRows,
      usedRows,
      nameColumnIndex,
    );
    const rowIndex = match.rowIndex;

    if (match.ambiguous) {
      ambiguousEmployees.push(emp);
      continue;
    }

    if (rowIndex === null) {
      missingEmployees.push(emp);
      continue;
    }

    usedRows.add(rowIndex);
    matchedMap.set(emp.id, rowIndex);
  }

  return {
    matchedMap,
    ambiguousEmployees,
    missingEmployees,
    usedRows,
  };
}
