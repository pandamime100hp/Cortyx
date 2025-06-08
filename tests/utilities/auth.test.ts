//auth.test.ts

import { getBearerAuthHeader } from "../../src/utilities/auth";


describe('Authentication Utilities', () => {
    it('should return valid bearer token header', () => {
        const expected: Record<string, string> = {
            Authorization: 'Bearer xyz',
        };

        const auth = getBearerAuthHeader('xyz');
        expect(auth).toStrictEqual(expected);
    });
});