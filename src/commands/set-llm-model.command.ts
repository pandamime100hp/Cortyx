import { 
    commands, 
    Disposable, 
    ExtensionContext
} from 'vscode';
import { ICommand } from '../interfaces/command';
import { Output } from '../utilities/output.utility';
import { GLOBAL_STATE_KEYS } from '../constants/constants';
import { showQuickPick } from '../utilities/input-helpers.utility';


export class SetLLMModel implements ICommand{
    private readonly output: Output = Output.getInstance();
    private context: ExtensionContext;
    readonly id: string = 'cortyx.setLlmModel';

    /**
     * 
     * @param context
     */
    constructor(context: ExtensionContext) {
        this.context = context;
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
        const models: string[] | undefined = this.context.globalState.get(GLOBAL_STATE_KEYS.MODELS);

        if (!models) {
            this.output.warn(`No LLM models have been fetched`);
            return;
        }

        const model: string | undefined = await showQuickPick(
            'Select a LLM model from the below list',
            models,
            'No LLM model selected'
        );

        if (model) {
            this.context.globalState.update(GLOBAL_STATE_KEYS.MODEL, model);
            this.output.info(`LLM model ${model} selected`);
        }
    }
}
