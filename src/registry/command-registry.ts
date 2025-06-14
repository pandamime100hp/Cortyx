// command-registry.ts

import { 
    commands,
    Disposable,
    ExtensionContext
} from 'vscode';
import { ICommand } from '../interfaces/command';
import { Output } from '../utilities/output.utility';
import { AIModelContext } from '../context/ai-model-context';
import { ICommandStrategy } from '../interfaces/command-strategy';
import { OpenAICommandStrategy } from '../strategies/openai-command.strategy';


export class CommandRegistry {
    private readonly output: Output;
    private readonly context: ExtensionContext;
    private disposables: Disposable[] = [];
    private commands: ICommand[] = []

    /**
     * Initialises the available commands found as `*.command.ts` under the `commands` folder. 
     * This enables the commands to register with VSCode for use with the command pallette.
     * 
     * @param context 
     * @param strategy 
     */
    constructor(context: ExtensionContext) {
        this.output = Output.getInstance();
        this.context = context;
        this.output.info('Command Registry initialised')
    }

    async getCommands(model: AIModelContext) {
        this.output.info('Setting command strategy');
        let commandStrategy: ICommandStrategy;
        const provider = model.getProviderName();
        await commands.executeCommand('setContext', 'cortyx.provider', provider);
        switch (provider) {
            case 'OpenAI':
                commandStrategy = new OpenAICommandStrategy(this.context, model);
                break;
            default:
                throw new Error('No command strategy found for this provider');
        }

        commandStrategy.getCommands(this.context, model).forEach(command => {
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
     * Registers all provided commands with VSCode. If a new strategy is set, you must 
     * reregister the commands by calling `registerCommands`.
     */
    registerAll(providerCommands: ICommand[] = []): void {
        this.output.info(`Registering all commands`)
        this.disposeCommands();

        this.commands.concat(providerCommands);

        for (const command of this.commands) {
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
}


