import { OpenAIStrategy } from '../../../src/providers/openai/OpenAIStrategy';


describe('Open AI Strategy', () => {
    let strategy: OpenAIStrategy;

    const mockModels = {
        'object': 'list',
        'data': [{
                'id': 'model-id-0',
                'object': 'model',
                'created': 1686935002,
                'owned_by': 'organization-owner'
            }, {
                'id': 'model-id-1',
                'object': 'model',
                'created': 1686935002,
                'owned_by': 'organization-owner',
            }, {
                'id': 'model-id-2',
                'object': 'model',
                'created': 1686935002,
                'owned_by': 'openai'
            },
        ]
    }

    beforeEach(() => {
        process.env.OPENAI_SA_API_KEY = 'mock_api_key';
        process.env.OPENAI_URL = 'https://mock-api.openai.com/v1';

        strategy = new OpenAIStrategy();

        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockModels)
        })) as jest.Mock;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return missing env vars exception', () => {
        delete process.env.OPENAI_SA_API_KEY;
        delete process.env.OPENAI_URL;
        expect(() => new OpenAIStrategy()).toThrow('Missing OpenAI environment variables.');
    });

    it('should return mocked models', async () => {          
        const result = await strategy.getModels()

        expect(fetch).toHaveBeenCalled();
        expect(result).toStrictEqual(mockModels);
    });
});