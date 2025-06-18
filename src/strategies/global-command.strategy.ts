import { ICommandStrategy } from '../interfaces/command-strategy';
import { ICommand } from '../interfaces/command';
import { ExtensionContext } from 'vscode';
import { SetAPIURL } from '../commands/set-api-url.command';
import { GetLLMModels } from '../commands/get-llm-models.command';
import { AIModelContext } from '../context/ai-model-context';
import { PromptAI } from '../commands/prompt-ai.command';
import { SetLLMModel } from '../commands/set-llm-model.command';
import { Output } from '../utilities/output.utility';

/**
 * GlobalCommandStrategy is responsible for managing a collection of
 * command instances for an extension context, allowing for execution
 * of various commands related to AI models.
 */
export class GlobalCommandStrategy implements ICommandStrategy {
    private readonly context: ExtensionContext;
    private readonly provider: AIModelContext;
    private readonly commands: ICommand[];
    private readonly output: Output = Output.getInstance();

    /**
     * Creates an instance of GlobalCommandStrategy.
     * 
     * @param context - The extension context provided by VSCode.
     * @param provider - An instance of AIModelContext for managing AI models.
     */
    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.context = context;
        this.provider = provider;
        this.commands = this.createCommands();
    }

    /**
     * Creates an array of command instances to be executed.
     * 
     * @returns An array of ICommand instances.
     */
    createCommands(): ICommand[] {
        try {
            return [
                new SetAPIURL(this.context),
                new GetLLMModels(this.context, this.provider),
                new SetLLMModel(this.context),
                new PromptAI(this.context, this.provider)
            ];
        } catch (error) {
            this.output.error(`Error creating commands: ${error}`);
            return [];
        }
    }

    /**
     * Retrieves the list of commands managed by this strategy.
     * 
     * @returns An array of ICommand instances.
     */
    getCommands(): ICommand[] {
        return this.commands;
    }
}