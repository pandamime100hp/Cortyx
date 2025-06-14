import { 
    commands, 
    Disposable, 
    ExtensionContext
} from "vscode";
import { ICommand } from "../interfaces/command";
import { Output } from "../utilities/output.utility";
import { LLM_API_URL } from "../constants/constants";
import { showInputBox } from "../utilities/input-helpers.utility";

export class SetAPIURL implements ICommand {
    readonly id: string = 'cortyx.setApiUrl';
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