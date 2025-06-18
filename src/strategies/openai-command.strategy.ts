import { 
    commands, 
    ExtensionContext 
} from "vscode";
import { ICommand } from "../interfaces/command";
import { ICommandStrategy } from "../interfaces/command-strategy";
import { AIModelContext } from "../context/ai-model-context";
import { SetOpenAIAPIKey } from "../commands/openai/set-openai-api-key.command";
import { Output } from "../utilities/output.utility";

/**
 * Implements the ICommandStrategy interface for OpenAI commands.
 */
export class OpenAICommandStrategy implements ICommandStrategy {
    private readonly output: Output = Output.getInstance();
    private context: ExtensionContext;
    private provider: AIModelContext;

    /**
     * Creates an instance of OpenAICommandStrategy.
     * @param context - The extension context provided by VS Code.
     * @param provider - The AI model context that provides the necessary information for the commands.
     */
    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.context = context;
        this.provider = provider;
        this.setProviderContextInCommandPalette();
    }

    /**
     * Enables command palette commands by setting the context for the provider.
     * @returns A promise that resolves when the command has been executed.
     */
    async setProviderContextInCommandPalette(): Promise<void>{
        try {
            await commands.executeCommand('setContext', 'cortyx.provider', this.provider.getProviderName());
        } catch (error) {
            this.output.error(`Failed to set provider context: ${error}`);
        }
    }

    /**
     * Retrieves the list of command instances that this strategy provides.
     * @returns An array of ICommand instances.
     */
    getCommands(): ICommand[] {
        return [
            new SetOpenAIAPIKey(this.context),
        ];
    }
}