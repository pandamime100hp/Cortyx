import { 
    commands, 
    ExtensionContext 
} from "vscode";
import { ICommandStrategy } from "../interfaces/command-strategy";
import { AIModelContext } from "../context/ai-model-context";
import { ICommand } from "../interfaces/command";
import { GetLLMModels } from "../commands/get-llm-models.command";
import { SetOpenAIAPIKey } from "../commands/openai/set-openai-api-key.command";

export class OpenAICommandStrategy implements ICommandStrategy {
    private context: ExtensionContext;
    private provider: AIModelContext;

    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.context = context;
        this.provider = provider;
        this.enableCommandPaletteCommands();
    }

    async enableCommandPaletteCommands(): Promise<void>{
        await commands.executeCommand('setContext', 'cortyx.provider', this.provider.getProviderName());
    }

    getCommands(): ICommand[] {
        return [
            new SetOpenAIAPIKey(this.context),
        ];
    }
}