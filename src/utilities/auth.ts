export function getBearerAuthHeader(token: string): HeadersInit {
    return {
        Authorization: `Bearer ${token}`,
    };
}