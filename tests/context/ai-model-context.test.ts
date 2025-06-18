import { AIModelContext } from '../../src/context/ai-model-context';
import { ChatCompletionOptions, ChatCompletionResponse, LLMModelListResponse } from '../../src/types/chat';

// Mock Output singleton
jest.mock('../../src/utilities/output.utility', () => {
    return {
        Output: {
            getInstance: jest.fn().mockReturnValue({
                add: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            })
        }
    };
});

describe('AIModelContext', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let mockStrategy: any;
    let context: AIModelContext;

    const mockChatResponse: ChatCompletionResponse = {
        object: 'chat.completion',
        id: '123',
        model: 'gpt-4',
        created: 1234567890,
        choices: [
            {
                index: 0,
                message: { role: 'assistant', content: 'Hello' },
                finish_reason: 'stop'
            }
        ],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
    };

    const mockModelListResponse: LLMModelListResponse = {
        models: ['gpt-3.5-turbo', 'gpt-4']
    };

    beforeEach(() => {
        mockStrategy = {
            name: 'MockStrategy',
            promptAi: jest.fn().mockResolvedValue(mockChatResponse),
            getLlmModels: jest.fn().mockResolvedValue(mockModelListResponse)
        };

        context = new AIModelContext(mockStrategy);
    });

    test('should return provider name', () => {
        expect(context.getProviderName()).toBe('MockStrategy');
    });

    test('should delegate promptAi to the strategy and log output', async () => {
        const options: ChatCompletionOptions = {
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Hello' }]
        };

        const result = await context.promptAi(options);

        expect(mockStrategy.promptAi).toHaveBeenCalledWith(options);
        expect(result).toBe(mockChatResponse);
    });

    test('should delegate getAvailableLlmModels to the strategy and log output', async () => {
        const result = await context.getAvailableLlmModels();

        expect(mockStrategy.getLlmModels).toHaveBeenCalled();
        expect(result).toBe(mockModelListResponse);
    });

    test('should allow setting a new strategy', () => {
        const newStrategy = {
            name: 'NewMockStrategy',
            promptAi: jest.fn(),
            getLlmModels: jest.fn()
        };

        context.setStrategy(newStrategy);
        expect(context.getProviderName()).toBe('NewMockStrategy');
    });
});
