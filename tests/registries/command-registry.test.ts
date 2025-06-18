import { CommandRegistry } from '../../src/registries/command-registry';
import { AIModelContext } from '../../src/context/ai-model-context';
import { mockContext } from '../mocks/vscode';
import { OpenAICommandStrategy } from '../../src/strategies/openai-command.strategy';
import { ExtensionContext } from 'vscode';


describe('CommandRegistry', () => {
    let commandRegistry: CommandRegistry;
    let mockProvider: AIModelContext;

    beforeEach(() => {
        mockProvider = { 
            getProviderName: jest.fn().mockReturnValue("mockProvider") 
        } as unknown as AIModelContext;
        commandRegistry = new CommandRegistry(mockContext, mockProvider);
    });

    test('should register OpenAI commands', async () => {
        const mockDisposable = { dispose: jest.fn() };
        const mockRegister = jest.fn().mockReturnValue(mockDisposable);

        const mockCommand = { id: 'testCommand', register: mockRegister, execute: jest.fn() };

        const mockContext = { subscriptions: [] } as unknown as ExtensionContext;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const provider = { getProviderName: jest.fn().mockReturnValue("OpenAI") } as any;
        
        const strategy = new OpenAICommandStrategy(mockContext, provider);
        
        jest.spyOn(strategy, 'getCommands').mockReturnValue([mockCommand]);

        const commands = strategy.getCommands();
        commands.forEach(cmd => {
            const disposable = cmd.register();
            mockContext.subscriptions.push(disposable);
        });

        expect(mockContext.subscriptions).toContain(mockDisposable);
    });


    test('should throw error for unknown provider', async () => {
        mockProvider.getProviderName();
        await expect(commandRegistry.getCommands()).rejects.toThrow('No command strategy found for this provider');
    });
});