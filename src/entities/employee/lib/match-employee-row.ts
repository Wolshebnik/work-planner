import type { Employee } from '../model/schema';

interface EmployeeRowMatch {
  ambiguous: boolean;
  rowIndex: number | null;
}

function resolveEmployeeRow(
  employee: Employee,
  sheetRows: (string | number)[][],
  usedRows: Set<number>,
): EmployeeRowMatch {
  const lastName = employee.last_name.trim().toLowerCase();
  const firstName = employee.first_name.trim().toLowerCase();
  const firstInitial = firstName.charAt(0);
  const candidates = new Map<number, number>();

  for (let rowIndex = 0; rowIndex < sheetRows.length; rowIndex += 1) {
    if (usedRows.has(rowIndex)) continue;

    const row = sheetRows[rowIndex] ?? [];
    const score = row.slice(0, 5).reduce<number>((bestScore, value) => {
      const cell = String(value ?? '')
        .trim()
        .toLowerCase();
      const cellWords = cell.split(/[\s.,;:]+/).filter(Boolean);

      if (!cell || !cellWords.includes(lastName)) return bestScore;
      if (!firstName) return Math.max(bestScore, 50);
      if (cellWords.includes(firstName)) return Math.max(bestScore, 100);

      if (
        firstInitial &&
        (cellWords.includes(firstInitial) ||
          cellWords.includes(`${firstInitial}.`))
      ) {
        return Math.max(bestScore, 80);
      }

      return bestScore;
    }, 0);

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
  const match = resolveEmployeeRow(employee, sheetRows, usedRows);
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

  for (const emp of employees) {
    const match = resolveEmployeeRow(emp, sheetRows, usedRows);
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
