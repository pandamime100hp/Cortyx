import { PromptAI } from '../../src/commands/prompt-ai.command';
import { mockContext, commands, window } from '../mocks/vscode';
import { Output } from '../../src/utilities/output.utility';
import { showInputBox } from '../../src/utilities/input-helpers.utility';
import { AIModelContext } from '../../src/context/ai-model-context';

// Mocks
jest.mock('../../src/utilities/output.utility');
jest.mock('../../src/utilities/input-helpers.utility');

describe('PromptAI Command', () => {
    const mockInfo = jest.fn();
    const mockError = jest.fn();
    const mockClearAndShow = jest.fn();
    const mockShowErrorMessage = jest.fn();

    const mockPromptAi = jest.fn();

    const mockProvider = {
        getProviderName: jest.fn().mockReturnValue('TestProvider'),
        promptAi: mockPromptAi
    } as unknown as AIModelContext;

    beforeEach(() => {
        jest.clearAllMocks();
        (Output.getInstance as jest.Mock).mockReturnValue({
            info: mockInfo,
            error: mockError,
            clearAndShow: mockClearAndShow
        });
        (window.showErrorMessage as jest.Mock) = mockShowErrorMessage;
    });

    it('should register the command', () => {
        const registerSpy = jest.spyOn(commands, 'registerCommand').mockReturnValue({ dispose: jest.fn() });

        const cmd = new PromptAI(mockContext, mockProvider);
        const disposable = cmd.register();

        expect(registerSpy).toHaveBeenCalledWith(cmd.id, expect.any(Function));
        expect(disposable).toBeDefined();
        expect(mockInfo).toHaveBeenCalledWith('Registering command: cortyx.promptAi');
        registerSpy.mockRestore();
    });

    it('should show error when no model is set', async () => {
        (showInputBox as jest.Mock).mockResolvedValue('User input');
        mockContext.globalState.get = jest.fn().mockReturnValue(undefined);

        const cmd = new PromptAI(mockContext, mockProvider);
        await cmd.execute();

        expect(mockError).toHaveBeenCalledWith('No LLM model is set');
        expect(mockShowErrorMessage).toHaveBeenCalledWith('No LLM model is set');
    });

    it('should call promptAi and display AI response', async () => {
        const fakeResponse = {
            choices: [{ message: { content: 'This is the AI response.' } }]
        };

        (showInputBox as jest.Mock).mockResolvedValue('Fix my code');
        mockContext.globalState.get = jest.fn().mockReturnValue('gpt-4');
        mockPromptAi.mockResolvedValue(fakeResponse);

        const cmd = new PromptAI(mockContext, mockProvider);
        await cmd.execute();

        expect(mockClearAndShow).toHaveBeenCalledWith('🤖 Waiting for AI Response...');
        expect(mockPromptAi).toHaveBeenCalledWith(expect.objectContaining({
            model: 'gpt-4',
            messages: [expect.objectContaining({
                role: 'user',
                content: expect.stringContaining('Fix my code')
            })]
        }));
        expect(mockClearAndShow).toHaveBeenCalledWith('🤖 AI Response:\nThis is the AI response.');
    });

    it('should handle promptAi errors gracefully', async () => {
        (showInputBox as jest.Mock).mockResolvedValue('My code fails');
        mockContext.globalState.get = jest.fn().mockReturnValue('gpt-4');
        mockPromptAi.mockRejectedValue('Error from provider');

        const cmd = new PromptAI(mockContext, mockProvider);
        await cmd.execute();

        expect(mockShowErrorMessage).toHaveBeenCalledWith('Failed to fetch response: Error from provider');
        expect(mockClearAndShow).toHaveBeenCalledWith('🤖 Failed to fetch response: Error from provider');
    });
});
