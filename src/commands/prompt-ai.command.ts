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

export class PromptAI implements ICommand {
    readonly id: string = 'cortyx.promptAi';
    private output: Output = Output.getInstance();
    private context: ExtensionContext;
    private provider: AIModelContext;

    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.output.info(`${provider.getProviderName()} Prompt initialising...`);
        this.context = context;
        this.provider = provider;
    }

    /**
     * 
     */
    register(): Disposable {
        this.output.info(`Registering command: ${this.id}`);
        return commands.registerCommand(this.id, (...args) => this.execute(...args));
    }

    /**
     * 
     * @param args 
     * @returns 
     */
    async execute(...args: unknown[]): Promise<void> {
        const prompt: string | undefined = await showInputBox(
            'Enter your AI prompt',
            false,
            '',
            'Prompt cannot be empty',
            'No prompt was entered'
        );

        const model: string | undefined = this.context.globalState.get(GLOBAL_STATE_KEYS.MODEL)
        if (!model){
            this.output.error('No LLM model is set');
            window.showErrorMessage('No LLM model is set');
            return;
        }

        const BASE_PROMPT: string = 'You are an experienced Microsoft software developer with years of experience in web development. You are familiar with the best practices and standards set out by MS. You have been tasked with helping me on my project. Review the below input and provide critical feedback giving justifications:\n'

        const options: ChatCompletionOptions = {
            model: String(model),
            messages: [{role: 'user', content: String(BASE_PROMPT + prompt)}]
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