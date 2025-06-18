import { GlobalCommandStrategy } from '../../src/strategies/global-command.strategy';
import { ExtensionContext } from 'vscode';
import { AIModelContext } from '../../src/context/ai-model-context';
import { ICommand } from '../../src/interfaces/command';

jest.mock('../../src/commands/set-api-url.command', () => ({
  SetAPIURL: jest.fn().mockImplementation(() => ({ id: 'set-api-url' })),
}));
jest.mock('../../src/commands/get-llm-models.command', () => ({
  GetLLMModels: jest.fn().mockImplementation(() => ({ id: 'get-llm-models' })),
}));
jest.mock('../../src/commands/set-llm-model.command', () => ({
  SetLLMModel: jest.fn().mockImplementation(() => ({ id: 'set-llm-model' })),
}));
jest.mock('../../src/commands/prompt-ai.command', () => ({
  PromptAI: jest.fn().mockImplementation(() => ({ id: 'prompt-ai' })),
}));


describe('GlobalCommandStrategy', () => {
    let mockContext: ExtensionContext;
    let mockProvider: AIModelContext;

    beforeEach(() => {
        mockContext = {} as ExtensionContext;
        mockProvider = {} as AIModelContext;
    });

    it('should instantiate with all expected commands', () => {
        const strategy = new GlobalCommandStrategy(mockContext, mockProvider);
        const commands = strategy.getCommands();

        expect(commands).toHaveLength(4);
        const commandIds = commands.map((cmd: ICommand) => cmd.id);

        expect(commandIds).toContain('set-api-url');
        expect(commandIds).toContain('get-llm-models');
        expect(commandIds).toContain('set-llm-model');
        expect(commandIds).toContain('prompt-ai');
    });
});
