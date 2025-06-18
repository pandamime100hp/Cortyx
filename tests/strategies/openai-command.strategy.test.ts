import {
    commands,
    mockContext
} from '../mocks/vscode';
import { OpenAICommandStrategy } from '../../src/strategies/openai-command.strategy';
import { AIModelContext } from '../../src/context/ai-model-context';
import { ExtensionContext } from 'vscode';
import { SetOpenAIAPIKey } from '../../src/commands/openai/set-openai-api-key.command';

describe("OpenAICommandStrategy", () => {
    let context: ExtensionContext;
    let provider: AIModelContext;
    let strategy: OpenAICommandStrategy;

    beforeEach(() => {
        context = mockContext;
        provider = { getProviderName: jest.fn().mockReturnValue("mockProvider") } as unknown as AIModelContext;
        strategy = new OpenAICommandStrategy(context, provider);
    });

    it("should initialize with correct context and provider", () => {
        expect(strategy["context"]).toBe(context);
        expect(strategy["provider"]).toBe(provider);
    });

    it("should set provider context in command palette", async () => {
        await strategy.setProviderContextInCommandPalette();

        expect(commands.executeCommand).toHaveBeenCalledWith('setContext', 'cortyx.provider', 'mockProvider');
    });

    it("should return an array of commands", () => {
        const commands = strategy.getCommands();
        expect(commands.length).toBe(1);
        expect(commands[0]).toBeInstanceOf(SetOpenAIAPIKey);
    });

    it("should handle errors during context setting gracefully", async () => {
        commands.executeCommand.mockImplementationOnce(() => Promise.reject(new Error("Error occurred")));
        
        await expect(strategy.setProviderContextInCommandPalette()).resolves.not.toThrow();
    });
});