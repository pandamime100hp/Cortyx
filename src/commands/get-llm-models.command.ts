import { 
    commands, 
    Disposable, 
    ExtensionContext, 
    window 
} from 'vscode';
import { ICommand } from '../interfaces/command';
import { LLMModelListResponse } from '../types/chat';
import { Output } from '../utilities/output.utility';
import { AIModelContext } from '../context/ai-model-context';
import { GLOBAL_STATE_KEYS } from '../constants/constants';

/**
 * Command to fetch available LLM models from the AI model provider.
 * This command is registered in the VSCode context and retrieves the
 * list of models for use within the extension.
 */
export class GetLLMModels implements ICommand{
    private readonly output: Output = Output.getInstance();
    private readonly strategy: AIModelContext;
    private context: ExtensionContext;
    readonly id: string = 'cortyx.getLlmModels';

    /**
     * Creates an instance of GetLLMModels.
     * 
     * @param context The extension context, providing access to the global state and other extension APIs.
     * @param strategy The strategy for fetching available LLM models, encapsulating the logic to interact with the provider.
     */
    constructor(context: ExtensionContext, strategy: AIModelContext) {
        this.context = context;
        this.strategy = strategy;
    }

    /**
     * Registers the 'getLlmModels' command with the VSCode command system.
     * 
     * @returns A disposable object that can be used to unregister the command when the extension is deactivated.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, () => this.execute());
    }

    /**
     * Executes the command to fetch LLM models, handling the response and updating the global state.
     * 
     * @returns A promise that resolves when the execution is complete.
     */
    async execute(): Promise<void> {
        try {
            const models = await this.fetchModels();
            if (models) {
                await this.updateGlobalState(models.models);
                window.showInformationMessage(`Models: ${models.models.length}`);
            } else {
                this.handleNoModels();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Fetches the available LLM models from the provider.
     * 
     * @returns A promise that resolves to the list of models or undefined if an error occurs.
     */
    private async fetchModels(): Promise<LLMModelListResponse | undefined> {
        this.output.info(`Executing ${this.strategy.getProviderName()} getLlmModels`);
        return this.strategy.getAvailableLlmModels();
    }

    private async updateGlobalState(models: string[]): Promise<void> {
        const currentModels = this.context.globalState.get<string[]>(GLOBAL_STATE_KEYS.MODELS);
        if (JSON.stringify(currentModels) !== JSON.stringify(models)) {
            await this.context.globalState.update(GLOBAL_STATE_KEYS.MODELS, models);
        }
    }

    /**
     * Updates the global state with the new list of models if it differs from the existing models.
     * 
     * @param models An array of model names to store in global state.
     * @returns A promise that resolves when the global state update is complete.
     */
    private handleNoModels(): void {
        this.output.warn('No models returned from the provider');
        window.showWarningMessage('No models returned from the provider');
    }

    /**
     * Handles errors that occur during model fetching.
     * 
     * This method checks if the provided error is an instance of Error and 
     * extracts the message. If it is not an instance of Error, it converts 
     * the error to a string. The error message is then logged to the output 
     * and displayed to the user as an error message.
     *
     * @param error The error that occurred, which can be of any type.
     * @returns This function does not return a value.
     */
    private handleError(error: unknown): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.output.error(`Failed to fetch models: ${errorMessage}`);
        window.showErrorMessage(`Failed to fetch models: ${errorMessage}`);
    }
}
