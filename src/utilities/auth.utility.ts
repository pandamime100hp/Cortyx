//auth.ts

/**
 * 
 * @param token 
 * @returns 
 */
export function getBearerAuthHeader(token: string): Record<string, string>{
    return {
        Authorization: `Bearer ${token}`,
    };
}