
export function parseURL(url: string, endpoint: string): string {
    return new URL(url, endpoint).toString();
}