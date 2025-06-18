import { 
    commands, 
    Disposable, 
    ExtensionContext
} from 'vscode';
import { ICommand } from '../interfaces/command';
import { Output } from '../utilities/output.utility';
import { GLOBAL_STATE_KEYS } from '../constants/constants';
import { showQuickPick } from '../utilities/input-helpers.utility';


/**
* Represents a command to set the LLM model in the extension.
* It allows users to choose from a list of available models and updates the global state accordingly.
*/
export class SetLLMModel implements ICommand{
    private readonly output: Output = Output.getInstance();
    private context: ExtensionContext;
    readonly id: string = 'cortyx.setLlmModel';

    /**
    * Creates an instance of SetLLMModel.
    *
    * @param context The context of the extension, which provides access to global state and commands.
    */
    constructor(context: ExtensionContext) {
        this.context = context;
    }

    /**
    * Registers the LLM model selection command.
    *
    * This command allows users to select an LLM model from a predefined list. 
    * It returns a Disposable object that can be used to unregister the command.
    *
    * @returns The registered command's disposable object.
    */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, () => this.execute());
    }

    /**
    * Executes the command to select an LLM model.
    *
    * This function retrieves the available LLM models from global state, prompts the user to select one, 
    * and updates the global state with the selected model. If no models are available, a warning is logged.
    *
    * @returns A promise that resolves when the execution is complete.
    */
    async execute(): Promise<void> {
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
