

/**
 * Dynamically creates an enum-like object.
 * 
 * @param items List of items to form the dynamic enum.
 * @returns Dictionary like object containing the passed in items which can be accessed.
 */
export function createEnum<T extends string>(items: T[]) {
  return items.reduce((acc, item) => {
    acc[item.toUpperCase()] = item;
    return acc;
  }, {} as Record<string, T>);
}