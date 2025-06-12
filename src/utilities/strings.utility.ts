//strings.ts

/**
 * 
 * @param base 
 * @param endpoint 
 * @param queryParams 
 * @returns 
 */
export function parseURL(base: string, endpoint: string, queryParams?: Record<string, string | number>): string {
    const baseURL = new URL(base);

    baseURL.pathname = [
        baseURL.pathname.replace(/\/+$/, ''),
        endpoint.replace(/^\/+/, '')
    ].join('/');

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            baseURL.searchParams.append(key, String(value));
        });
    }

    return baseURL.toString();
}

/**
 * Helper function for splitting `camelCase` format text into split words that have upper characters.
 * @param str Text which we want to split.
 * @returns List of words split by `camelCased` words and upper cased.
 */
export function splitCamelCaseUpper(str: string): string[] {
  return str.split(/(?=[A-Z])/).map(s => s.toUpperCase());
}