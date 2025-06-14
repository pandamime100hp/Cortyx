import { 
    commands, 
    Disposable, 
    ExtensionContext
} from "vscode";
import { ICommand } from "../../interfaces/command";
import { Output } from "../../utilities/output.utility";
import { LLM_API_KEY } from "../../constants/constants";
import { showInputBox } from "../../utilities/input-helpers.utility";

export class SetOpenAIAPIKey implements ICommand {
    readonly id: string = 'cortyx.setOpenAiApiKey';
    private readonly output: Output;
    private context: ExtensionContext;
    
    /**
     * 
     * @param context 
     */
    constructor(context: ExtensionContext) {
        this.output = Output.getInstance();
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
     * @param args 
     */
    async execute(...args: unknown[]): Promise<void> {
        const PROMPT: string = 'Input the LLM provider API key';
        const SECRET: boolean = true;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API key cannot be empty';
        const ERROR_MSG = 'No API key provided';

        const llmApiKey: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiKey) {
            await this.context.secrets.store(LLM_API_KEY, llmApiKey);
        }
    }
}