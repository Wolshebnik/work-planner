export const sessionKeys = {
  all: ['session'] as const,
  current: () => [...sessionKeys.all, 'current'] as const,
  init: () => [...sessionKeys.all, 'init'] as const,
};
