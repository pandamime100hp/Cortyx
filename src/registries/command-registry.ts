import { 
    Disposable,
    ExtensionContext
} from 'vscode';
import { ICommand } from '../interfaces/command';
import { Output } from '../utilities/output.utility';
import { AIModelContext } from '../context/ai-model-context';
import { ICommandStrategy } from '../interfaces/command-strategy';
import { OpenAICommandStrategy } from '../strategies/openai-command.strategy';
import { GlobalCommandStrategy } from '../strategies/global-command.strategy';


/**
 * CommandRegistry handles the registration and disposal of commands 
 * within the VSCode extension context.
 */
export class CommandRegistry {
    private readonly output: Output = Output.getInstance();
    private readonly context: ExtensionContext;
    private readonly provider: AIModelContext;
    private disposables: Disposable[] = [];
    private commands: ICommand[] = []

    /**
     * Initializes the CommandRegistry with the given context and AI model provider.
     * 
     * @param context - The VSCode extension context.
     * @param provider - The AIModelContext providing the model for commands.
     */
    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.context = context;
        this.provider = provider;
        this.output.info('Command Registry initialised')
    }

    /**
     * Retrieves and registers the available commands for the current provider.
     * 
     * @returns A promise that resolves when the commands have been retrieved and registered.
     * @throws If no command strategy is found for the provider.
     */
    async getCommands(): Promise<void> {
        this.output.info('Getting commands');
        const globalCommands: GlobalCommandStrategy = new GlobalCommandStrategy(this.context, this.provider);
        globalCommands.getCommands().forEach(command => {
            this.commands.push(command);
        });

        let commandStrategy: ICommandStrategy;

        switch (this.provider.getProviderName()) {
            case 'OpenAI':
                commandStrategy = new OpenAICommandStrategy(this.context, this.provider);
                break;
            default:
                throw new Error('No command strategy found for this provider');
        }

        commandStrategy.getCommands().forEach(command => {
            this.commands.push(command);
        });
    }

    /**
     * Disposes all previously registered commands.
     */
    disposeCommands(): void {
        this.output.warn('Disposing commands')
        this.disposables.forEach(disposable => {
            disposable.dispose();
        });

        this.disposables = [];
    }

    /**
     * Registers all provided commands with VSCode. 
     * If a new strategy is set, you must re-register the commands by calling `registerCommands`.
     * 
     * @param providerCommands - An optional array of commands to register.
     */
    registerAll(providerCommands: ICommand[] = []): void {
        this.output.info(`Registering all commands`)
        this.disposeCommands();

        this.commands = this.commands.concat(providerCommands);

        this.commands.forEach(command => {
            this.registerCommand(command);
        });
    }

    /**
     * Registers a single command with VSCode and handles any errors during the registration.
     * 
     * @param command - The command to register.
     */
    private registerCommand(command: ICommand): void {
        try {
            const disposable: Disposable = command.register();
            this.context.subscriptions.push(disposable);
            this.disposables.push(disposable);
            this.output.info(`Registered command: ${command.id}`);
        } catch (error) {
            this.output.error(`Failed to register command: ${command.id} ${String(error)}`);
        }
    }
}


