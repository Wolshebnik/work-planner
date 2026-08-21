import type { Employee } from '../model/schema';

export function findEmployeeRowIndex(
  employee: Employee,
  sheetRows: (string | number)[][],
  usedRows: Set<number>,
): number | null {
  const lastName = employee.last_name.trim().toLowerCase();
  const firstName = employee.first_name.trim().toLowerCase();
  const firstInitial = firstName.charAt(0);

  let targetRowIndex: number | null = null;
  let highestScore = 0;

  for (let r = 0; r < sheetRows.length; r++) {
    if (usedRows.has(r)) {
      continue;
    }

    const row = sheetRows[r] ?? [];
    const nameCells = row
      .slice(0, 5)
      .map((c) => String(c ?? '').trim().toLowerCase());

    for (const cell of nameCells) {
      if (!cell) {
        continue;
      }

      const cellWords = cell.split(/[\s.,;:]+/).filter(Boolean);

      if (!cellWords.includes(lastName)) {
        continue;
      }

      let score = 0;
      let hasFirstNameMatch = false;

      if (firstName) {
        if (cellWords.includes(firstName) || cell.includes(firstName)) {
          score = 100;
          hasFirstNameMatch = true;
        } else if (
          firstInitial &&
          (cellWords.includes(firstInitial) ||
            cell.includes(`${lastName} ${firstInitial}`) ||
            cell.includes(`${lastName}  ${firstInitial}`) ||
            cell.includes(`${firstInitial}.`) ||
            cell.includes(` ${firstInitial}`))
        ) {
          score = 80;
          hasFirstNameMatch = true;
        }
      } else {
        score = 50;
        hasFirstNameMatch = true;
      }

      if (!hasFirstNameMatch) {
        continue;
      }

      if (score > highestScore) {
        highestScore = score;
        targetRowIndex = r;
      }
    }
  }

  return targetRowIndex;
}

export function matchEmployeesWithSheet(
  employees: Employee[],
  sheetRows: (string | number)[][],
) {
  const usedRows = new Set<number>();
  const missingEmployees: Employee[] = [];
  const matchedMap = new Map<string, number>();

  for (const emp of employees) {
    const rowIndex = findEmployeeRowIndex(emp, sheetRows, usedRows);
    if (rowIndex === null) {
      missingEmployees.push(emp);
    } else {
      usedRows.add(rowIndex);
      matchedMap.set(emp.id, rowIndex);
    }
  }

  return {
    matchedMap,
    missingEmployees,
    usedRows,
  };
}
