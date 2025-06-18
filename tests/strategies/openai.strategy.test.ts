// tests/strategies/strategy.openai.test.ts
import { OpenAIStrategy } from '../../src/strategies/openai.strategy';
import { ExtensionContext } from 'vscode';
import { Output } from '../../src/utilities/output.utility';
import { ChatCompletionOptions } from '../../src/types/chat';

jest.mock('../../src/utilities/output.utility');
global.fetch = jest.fn();

describe('OpenAIStrategy', () => {
    let context: ExtensionContext;
    let strategy: OpenAIStrategy;
    let getMock: jest.Mock;
    let outputMock: jest.Mocked<Output>;

    beforeEach(() => {
        getMock = jest.fn();
        context = {
            globalState: { get: jest.fn().mockReturnValue('https://api.openai.com/') },
            secrets: { get: getMock },
        } as unknown as ExtensionContext;

        outputMock = {
            info: jest.fn(),
            error: jest.fn(),
            add: jest.fn(),
        } as unknown as jest.Mocked<Output>;

        (Output.getInstance as jest.Mock).mockReturnValue(outputMock);

        strategy = new OpenAIStrategy(context);
    });

    it('should log initialization', () => {
        expect(outputMock.info).toHaveBeenCalledWith('OpenAI initialising...');
        expect(outputMock.info).toHaveBeenCalledWith('OpenAI initialised');
    });

    it('should log an error if URL is missing', () => {
        (context.globalState.get as jest.Mock).mockReturnValueOnce(undefined);
        new OpenAIStrategy(context);
        expect(outputMock.error).toHaveBeenCalledWith('Missing OpenAI configuration URL');
    });

    describe('promptAi', () => {
        it('should call fetch with correct arguments and format response', async () => {
            getMock.mockResolvedValue('test-key');

            const mockResponseData = {
                id: 'chatcmpl-1',
                object: 'chat.completion',
                created: 1234567890,
                model: 'gpt-4',
                usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
                choices: [
                    {
                        index: 0,
                        message: { role: 'assistant', content: 'Hello!' },
                        finish_reason: 'stop',
                    },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => 'application/json' },
                json: async () => mockResponseData,
            });

            const options: ChatCompletionOptions = {
                model: 'gpt-4',
                messages: [{ role: 'user', content: 'Hi' }],
            };

            const response = await strategy.promptAi(options);

            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('chat/completions'), expect.any(Object));
            expect(response).toEqual(mockResponseData);
        });

        it('should handle fetch errors', async () => {
            getMock.mockResolvedValue('key');
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

            await expect(
                strategy.promptAi({ model: 'gpt-4', messages: [] })
            ).rejects.toThrow('Failed to fetch models from OpenAI: Error: Fetch failed');

            expect(outputMock.error).toHaveBeenCalledWith(expect.stringContaining('Fetch failed'));
        });
    });

    describe('getLlmModels', () => {
        it('should return a list of model IDs', async () => {
            getMock.mockResolvedValue('key');
            const modelData = {
                data: [
                    { id: 'gpt-3.5-turbo' },
                    { id: 'gpt-4' },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => 'application/json' },
                json: async () => modelData,
            });

            const result = await strategy.getLlmModels();

            expect(result.models).toEqual(['gpt-3.5-turbo', 'gpt-4']);
        });
    });

    describe('checkResponse', () => {
        it('should throw if response is not ok', async () => {
            const badResponse = {
                ok: false,
                text: async () => 'Not Found',
                headers: { get: () => 'application/json' },
            };

            /* eslint-disable @typescript-eslint/no-explicit-any */
            await expect(strategy['checkResponse'](badResponse as any)).rejects.toThrow(
                'OpenAI API error: Not Found'
            );
        });

        it('should throw if content-type is not JSON', async () => {
            const badResponse = {
                ok: true,
                text: async () => 'HTML response',
                headers: { get: () => 'text/html' },
            };

            await expect(strategy['checkResponse'](badResponse as any)).rejects.toThrow(
                'Expected JSON but got: HTML response'
            );
        });
    });

    describe('createHeaders', () => {
        it('should return headers with API key', async () => {
            getMock.mockResolvedValue('secret-key');

            const headers = await strategy['createHeaders']();

            expect(headers).toEqual({
                'Content-Type': 'application/json',
                Authorization: 'Bearer secret-key',
            });
        });
    });
});
