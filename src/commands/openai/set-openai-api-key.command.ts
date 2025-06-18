import { 
    commands, 
    Disposable, 
    ExtensionContext
} from "vscode";
import { ICommand } from "../../interfaces/command";
import { Output } from "../../utilities/output.utility";
import { LLM_API_KEY } from "../../constants/constants";
import { showInputBox } from "../../utilities/input-helpers.utility";

/**
 * Command to set the OpenAI API key in the secrets storage.
 */
export class SetOpenAIAPIKey implements ICommand {
    readonly id: string = 'cortyx.setOpenAiApiKey';
    private readonly output: Output;
    private context: ExtensionContext;
    
    /**
     * Creates an instance of SetOpenAIAPIKey.
     *
     * @param context The extension context providing access to VS Code's API.
     */
    constructor(context: ExtensionContext) {
        this.output = Output.getInstance();
        this.context = context;
    }

    /**
     * Registers the command with the VS Code command palette.
     *
     * @returns A Disposable object that can be used to unregister the command.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, () => this.execute());
    }

    /**
     * Executes the command, prompting the user for an API key and storing it.
     *
     * @returns A promise that resolves when the API key has been stored or rejected if there was an error.
     */
    async execute(): Promise<void> {
        const PROMPT: string = 'Input the LLM provider API key';
        const VALIDATION_MSG = 'API key cannot be empty';
        const ERROR_MSG = 'No API key provided';

        try {
            const llmApiKey: string | undefined = await showInputBox(
                PROMPT, true, '', VALIDATION_MSG, ERROR_MSG
            );

            if (llmApiKey) {
                await this.context.secrets.store(LLM_API_KEY, llmApiKey);
            }
        } catch (error) {
            this.output.error(`Error storing API key: ${error}`);
        }
    }
}