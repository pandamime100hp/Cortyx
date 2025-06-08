//strings.ts

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