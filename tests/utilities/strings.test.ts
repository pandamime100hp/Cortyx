import { parseURL } from "../../src/utilities/strings";

describe("String Utilities", () => {
    const url: string = 'https://mock-api.openai.com/v1';
    let endpoint = 'endpoint';
    const queryParams: Record<string, string | number> = {'limit': 5, 'offset': 1000, 'country': 'BG'};

    it("should return valid URL", () => {
        const result: string = parseURL(url, endpoint);

        expect(result).toEqual('https://mock-api.openai.com/v1/endpoint');
    });

    it("should remove leading slashes", () => {
        endpoint = '/endpoint';

        const result: string = parseURL(url, endpoint);

        expect(result).toEqual('https://mock-api.openai.com/v1/endpoint');
    });

    it("should allow query params", () => {
        const result: string = parseURL(url, endpoint, queryParams);

        expect(result).toEqual('https://mock-api.openai.com/v1/endpoint?limit=5&offset=1000&country=BG')
    });
});