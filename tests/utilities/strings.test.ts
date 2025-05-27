import { parseURL } from "../../src/utilities/strings";

describe("String Utilities", () => {
    let url: string;
    let endpoint: string;
    let queryParams: Record<string, string | number>;

    beforeEach(() => {
        url = 'https://mock-api.openai.com/v1';
        endpoint = 'endpoint';
        queryParams = {'limit': 5, 'offset': 1000, 'country': 'BG'};
    });

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