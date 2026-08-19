export function resolveItemHeight<T>(
  itemHeightProp:
    | number
    | number[]
    | ((item: T, index: number) => number)
    | undefined,
  item: T,
  index: number,
  fallback: number,
): number {
  if (typeof itemHeightProp === 'number') {
    return itemHeightProp;
  }

  if (Array.isArray(itemHeightProp)) {
    return itemHeightProp[index] ?? fallback;
  }

  if (typeof itemHeightProp === 'function') {
    return itemHeightProp(item, index);
  }

  return fallback;
}
