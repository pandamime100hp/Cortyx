import { ExtensionContext } from "vscode";
import { CommandStrategy } from "./command.strategy";
import { AIModelContext } from "../context/ai-model-context";
import { GetLLMModels } from "../commands/get-llm-models.command";
import { IExtensionCommand } from "../interfaces/command";

export class OpenAICommandStrategy implements CommandStrategy {
    private context: ExtensionContext;
    private model: AIModelContext;

    constructor(context: ExtensionContext, model: AIModelContext) {
        this.context = context;
        this.model = model;
    }

    getCommands(): IExtensionCommand[] {
        return [
            new GetLLMModels(this.context, this.model),
        ];
    }
}