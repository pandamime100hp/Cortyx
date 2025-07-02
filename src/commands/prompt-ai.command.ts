import { 
    commands,
    Disposable, 
    ExtensionContext, 
    window 
} from "vscode";
import { ICommand } from "../interfaces/command";
import { ChatCompletionOptions } from '../types/chat'
import { showInputBox } from "../utilities/input-helpers.utility";
import { AIModelContext } from "../context/ai-model-context";
import { Output } from "../utilities/output.utility";
import { GLOBAL_STATE_KEYS } from "../constants/constants";
import { Prompt } from "../types/prompt";
import { DEV_PROMPT, REVIEW_PROMPT, TEST_PROMPT } from "../constants/ai-prompts";

/**
 * Represents a command that interacts with the AI model to generate responses based on user prompts.
 */
export class PromptAI implements ICommand {
    readonly id: string = 'cortyx.promptAi';
    private output: Output = Output.getInstance();
    private context: ExtensionContext;
    private provider: AIModelContext;
    private promptMode: Prompt = Prompt.REVIEW;

    /**
     * Creates an instance of the PromptAI command.
     * @param context The context of the extension, providing access to global state and services.
     * @param provider The AI model context, which facilitates interaction with the AI model.
     */
    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.output.info(`${provider.getProviderName()} Prompt initialising...`);
        this.context = context;
        this.provider = provider;
        this.output.info(`${provider.getProviderName()} Prompt initialised`);
    }

    /**
     * Registers the AI prompt command with the VSCode command palette.
     * @returns A disposable that unregisters the command when disposed.
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, (args?: { prompt?: string }) => this.execute(args));
    }

    /**
     * Executes the AI prompt command, gathering user input and interacting with the AI model.
     * @param args Optional arguments that may be passed from the command palette.
     * @returns A promise that resolves when the command execution is complete.
     */
    async execute(args?: { prompt?: string, mode?: string }): Promise<void> {
        const prompt: string | undefined = args?.prompt || await showInputBox(
            'Enter your AI prompt',
            false,
            '',
            'Prompt cannot be empty',
            'No prompt was entered'
        );

        if (!prompt) {
            this.output.warn('No prompt was provided.');
            return;
        }

        const model: string | undefined = this.context.globalState.get(GLOBAL_STATE_KEYS.MODEL)
        if (!model){
            this.output.error('No LLM model is set');
            window.showErrorMessage('No LLM model is set');
            return;
        }

        let base_prompt: string = '';

        switch(args?.mode || this.promptMode) {
            case Prompt.DEV:
                base_prompt = DEV_PROMPT;
                break;
            case Prompt.TEST:
                base_prompt = TEST_PROMPT;
                break;
            default: 
                base_prompt = REVIEW_PROMPT;
                break;
        }

        const options: ChatCompletionOptions = {
            model: String(model),
            messages: [{role: 'user', content: String(base_prompt + prompt)}]
        }

        this.output.clearAndShow('🤖 Waiting for AI Response...');

        try {
            const response = await this.provider.promptAi(options)

            this.output.clearAndShow('🤖 AI Response:\n' + response.choices[0].message.content);
        } catch (error) {
            window.showErrorMessage(`Failed to fetch response: ${error}`);
            this.output.clearAndShow(`🤖 Failed to fetch response: ${error}`);
            return;
        }
    }
}