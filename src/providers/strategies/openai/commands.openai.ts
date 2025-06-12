import { ExtensionContext } from "vscode";
import { CommandStrategy } from "../../../commands/strategies/command.strategy";
import { AIModelContext } from "../../context.providers";
import { GetLLMModels } from "../../../commands/get-llm-models.command";
import { ExtensionCommand } from "../../../commands/types";

export class OpenAICommandStrategy implements CommandStrategy {
    constructor(
        private context: ExtensionContext,
        private model: AIModelContext
    ) {}

    getCommands(): ExtensionCommand[] {
        return [
            new GetLLMModels(this.context, this.model),
        ];
    }
}