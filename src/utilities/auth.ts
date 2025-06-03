export function getBearerAuthHeader(token: string): Record<string, string>{
    return {
        Authorization: `Bearer ${token}`,
    };
}