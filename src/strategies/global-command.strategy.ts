import { ICommandStrategy } from '../interfaces/command-strategy';
import { ICommand } from '../interfaces/command';
import { ExtensionContext } from 'vscode';
import { SetAPIURL } from '../commands/set-api-url.command';
import { GetLLMModels } from '../commands/get-llm-models.command';
import { AIModelContext } from '../context/ai-model-context';
import { PromptAI } from '../commands/prompt-ai.command';
import { SetLLMModel } from '../commands/set-llm-model.command';

export class GlobalCommandStrategy implements ICommandStrategy {
    private readonly context: ExtensionContext;
    private readonly provider: AIModelContext;

    constructor(context: ExtensionContext, provider: AIModelContext) {
        this.context = context;
        this.provider = provider;
    }

    getCommands(): ICommand[] {
        return [
            new SetAPIURL(this.context),
            new GetLLMModels(this.context, this.provider),
            new SetLLMModel(this.context),
            new PromptAI(this.context, this.provider)
        ];
    }
}