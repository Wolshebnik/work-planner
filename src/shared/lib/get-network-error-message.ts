const NETWORK_ERROR_MESSAGE =
  'Нет подключения к интернету. Включите Wi-Fi и попробуйте снова.';

const NETWORK_ERROR_SIGNATURES = [
  'unknownhostexception',
  'unable to resolve host',
  'network request failed',
] as const;

export function getNetworkErrorMessage(error: unknown): string | null {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
        ? (() => {
            const record = error as Record<string, unknown>;
            const value = record.message;
            return typeof value === 'string' ? value : null;
          })()
        : null;

  if (
    message &&
    NETWORK_ERROR_SIGNATURES.some((signature) =>
      message.toLowerCase().includes(signature),
    )
  ) {
    return NETWORK_ERROR_MESSAGE;
  }

  return null;
}
