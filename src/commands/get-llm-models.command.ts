// commands/get-model.command.ts

import { 
    commands, 
    Disposable, 
    ExtensionContext, 
    window 
} from 'vscode';
import { GLOBAL_STATE_KEYS } from '../utilities/constants.utility';
import { ExtensionCommand } from './types';
import { LLMModelListResponse } from '../providers/types';
import { Output } from '../utilities/output.utility';
import { AIModelContext } from '../providers/context.providers';


export class GetLLMModels implements ExtensionCommand{
    private readonly output: Output;
    readonly id: string = 'cortyx.getLlmModels';

    /**
     * 
     * @param context 
     * @param strategy 
     */
    constructor(private context: ExtensionContext, private strategy: AIModelContext) {
        this.output = Output.getInstance();
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
    async execute(...args: any[]): Promise<void> {
        let models: LLMModelListResponse | undefined = undefined;

        try{
            models = await this.strategy.getLlmModels();
        } catch (error) {
            this.output.error(`Failed to fetch models: ${String(error)}`);
            window.showErrorMessage(`Failed to fetch models: ${String(error)}`);
            return;
        }

        if (models) {
            await this.context.globalState.update(GLOBAL_STATE_KEYS.MODELS, models.models)
            window.showInformationMessage(`Models: ${models.models.length}`);
        } else {
            this.output.warn('No models returned from the provider');
            window.showWarningMessage('No models returned from the provider');
            return;
        }
    }
}
