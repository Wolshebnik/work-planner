export type EmployeeStatusType = keyof typeof EmployeeStatus;

export const EmployeeStatus = {
  SICK: { label: 'Лікарняний', short: 'Б', variant: 'sky' },
  VACATION: { label: 'Відпустка', short: 'О', variant: 'purple' },
  NA: {
    label: 'Відпустка за власний рахунок',
    short: 'НА',
    variant: 'purpleLight',
  },
  ABSENT: { label: 'Прогули', short: 'ПР', variant: 'dangerLight' },
  FIRED: { label: 'Звільнений', short: 'УВ', variant: 'grey' },
  OFF: { label: 'Вихідний', short: '-', variant: 'danger' },
  WORK: { label: 'Робочий час', short: '9', variant: 'success' },
  ST: { label: 'Стажер', short: 'СТ', variant: 'blueLight' },
} as const;

export const SHORT_TO_STATUS: Record<string, EmployeeStatusType> = {
  Б: 'SICK',
  О: 'VACATION',
  НА: 'NA',
  ПР: 'ABSENT',
  УВ: 'FIRED',
  '-': 'OFF',
  '9': 'WORK',
  'СТ': 'ST',
};
