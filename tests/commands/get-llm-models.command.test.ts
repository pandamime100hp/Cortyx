import { GetLLMModels } from '../../src/commands/get-llm-models.command';
import { ExtensionContext } from 'vscode';
import { AIModelContext } from '../../src/context/ai-model-context';
import { GLOBAL_STATE_KEYS } from '../../src/constants/constants';
import { Output } from '../../src/utilities/output.utility';
import { mockContext, window } from '../mocks/vscode';

jest.mock('../../src/utilities/output.utility');

describe('GetLLMModels', () => {
    let command: GetLLMModels;
    let mockStrategy: jest.Mocked<AIModelContext>;

    const mockInfo = jest.fn();
    const mockWarn = jest.fn();

    (Output.getInstance as jest.Mock).mockReturnValue({
        info: mockInfo,
        warn: mockWarn,
        error: jest.fn(),
        add: jest.fn(),
    });

    beforeEach(() => {
        jest.clearAllMocks();

        mockStrategy = {
            getProviderName: jest.fn().mockReturnValue('TestProvider'),
            getAvailableLlmModels: jest.fn()
        } as unknown as jest.Mocked<AIModelContext>;

        command = new GetLLMModels(mockContext as ExtensionContext, mockStrategy);
    });

    it('should register the command', () => {
        const disposable = command.register();
        expect(disposable).toBeDefined();
    });

    it('should fetch models and update global state', async () => {
        const mockModels = ['gpt-4', 'gpt-3.5'];
        mockStrategy.getAvailableLlmModels.mockResolvedValue({ models: mockModels });
        (mockContext.globalState.get as jest.Mock).mockReturnValue([]);

        await command.execute();

        expect(mockStrategy.getAvailableLlmModels).toHaveBeenCalled();
        expect(mockContext.globalState.update).toHaveBeenCalledWith(GLOBAL_STATE_KEYS.MODELS, mockModels);
        expect(window.showInformationMessage).toHaveBeenCalledWith(`Models: ${mockModels.length}`);
    });

    it('should not update global state if models are the same', async () => {
        const mockModels = ['gpt-4', 'gpt-3.5'];
        mockStrategy.getAvailableLlmModels.mockResolvedValue({ models: mockModels });
        (mockContext.globalState.get as jest.Mock).mockReturnValue(mockModels);

        await command.execute();

        expect(mockContext.globalState.update).not.toHaveBeenCalled();
    });

    it('should handle errors and show error message', async () => {
        const error = new Error('Fetch failed');
        mockStrategy.getAvailableLlmModels.mockRejectedValue(error);

        await command.execute();

        expect(window.showErrorMessage).toHaveBeenCalledWith(`Failed to fetch models: ${error.message}`);
    });
});
