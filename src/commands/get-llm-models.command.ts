// commands/get-model.command.ts

import { 
    commands, 
    Disposable, 
    ExtensionContext, 
    window 
} from 'vscode';
import { IExtensionCommand } from '../interfaces/command';
import { LLMModelListResponse } from '../types/chat';
import { Output } from '../utilities/output.utility';
import { AIModelContext } from '../context/ai-model-context';


export class GetLLMModels implements IExtensionCommand{
    private readonly output: Output;
    private readonly strategy: AIModelContext;
    private context: ExtensionContext;
    private readonly GLOBAL_STATE_KEY: string = 'llm';
    readonly id: string = 'cortyx.getLlmModels';

    /**
     * 
     * @param context 
     * @param strategy 
     */
    constructor(context: ExtensionContext, strategy: AIModelContext) {
        this.output = Output.getInstance();
        this.context = context;
        this.strategy = strategy;
    }

    /**
     * Registers the command.
     * 
     * @returns Registered disposable object which can be subscribed to the instance context.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, (...args) => this.execute(...args));
    }

    /**
     * 
     * @param args List of arguments required to be passed in for the execution.
     * @returns 
     */
    async execute(...args: unknown[]): Promise<void> {
        let models: LLMModelListResponse | undefined = undefined;

        try{
            models = await this.strategy.getLlmModels();
        } catch (error) {
            this.output.error(`Failed to fetch models: ${String(error)}`);
            window.showErrorMessage(`Failed to fetch models: ${String(error)}`);
            return;
        }

        if (models) {
            await this.context.globalState.update(this.GLOBAL_STATE_KEY, models.models)
            window.showInformationMessage(`Models: ${models.models.length}`);
        } else {
            this.output.warn('No models returned from the provider');
            window.showWarningMessage('No models returned from the provider');
            return;
        }
    }
}
