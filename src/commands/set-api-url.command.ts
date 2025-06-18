import { 
    commands, 
    Disposable, 
    ExtensionContext
} from "vscode";
import { ICommand } from "../interfaces/command";
import { Output } from "../utilities/output.utility";
import { LLM_API_URL } from "../constants/constants";
import { showInputBox } from "../utilities/input-helpers.utility";

/**
 * Command implementation for setting the API URL for the LLM provider.
 * This class registers a command that prompts the user for an API URL 
 * and saves it in the global state of the extension.
 */
export class SetAPIURL implements ICommand {
    readonly id: string = 'cortyx.setApiUrl';
    private readonly output: Output;
    private context: ExtensionContext;
    
    /**
     * Creates an instance of SetAPIURL.
     * 
     * @param context The extension context provided by VSCode, 
     * which allows access to the global state and other extension resources.
     */
    constructor(context: ExtensionContext) {
        this.output = Output.getInstance();
        this.context = context;
    }

    /**
     * Registers the command in the VS Code command palette.
     * This command can be invoked to prompt the user to enter an API URL.
     * 
     * @returns The disposable object that can be used to unregister 
     * the command when the extension is deactivated.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, () => this.execute());
    }

    /**
     * Executes the command to prompt the user for the API URL and 
     * updates the global state with the provided URL.
     * 
     * @returns A promise that resolves when the API URL is successfully updated.
     */
    async execute(): Promise<void> {
        const PROMPT: string = 'Input the LLM provider API URL';
        const SECRET: boolean = false;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API URL cannot be empty';
        const ERROR_MSG = 'No API URL provided';

        const llmApiKey: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiKey) {
            await this.context.globalState.update(LLM_API_URL, llmApiKey);
        }
    }
}