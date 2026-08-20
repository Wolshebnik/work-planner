export const googleAuthKeys = {
  all: ['google-auth'] as const,
  user: () => [...googleAuthKeys.all, 'user'] as const,
};
