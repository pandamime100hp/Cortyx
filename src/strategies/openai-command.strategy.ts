import { ExtensionContext } from "vscode";
import { ICommandStrategy } from "../interfaces/command-strategy";
import { AIModelContext } from "../context/ai-model-context";
import { ICommand } from "../interfaces/command";
import { GetLLMModels } from "../commands/get-llm-models.command";
import { SetOpenAIAPIKey } from "../commands/openai/set-openai-api-key.command";

export class OpenAICommandStrategy implements ICommandStrategy {
    private context: ExtensionContext;
    private model: AIModelContext;

    constructor(context: ExtensionContext, model: AIModelContext) {
        this.context = context;
        this.model = model;
    }

    getCommands(): ICommand[] {
        return [
            new SetOpenAIAPIKey(this.context),
            new GetLLMModels(this.context, this.model),
        ];
    }
}