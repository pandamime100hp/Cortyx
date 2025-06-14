import { ExtensionContext } from 'vscode';
import { IProviderConfiguration } from '../interfaces/provider-configuration';
import { OpenAIStrategy } from '../strategies/openai.strategy';
import { IAIModelStrategy } from '../interfaces/ai-model';
import { ICommand } from '../interfaces/command';
import { SetOpenAIAPIKey } from '../commands/openai/set-openai-api-key.command';
import { Output } from '../utilities/output.utility';
import { showInputBox } from '../utilities/input-helpers.utility';
import { 
    LLM_API_URL, 
    LLM_API_KEY 
} from '../constants/constants';

export class OpenAIConfiguration implements IProviderConfiguration {
    readonly context: ExtensionContext;
    output: Output = Output.getInstance();

    url: string | undefined;
    private apiKey: Thenable<string | undefined> | undefined;

    constructor(context: ExtensionContext) {
        this.output.info('OpenAIConfiguration initialising...');
        this.context = context;

        this.url = context.globalState.get(LLM_API_URL);
        this.apiKey = context.secrets.get(LLM_API_KEY);
        this.output.info('OpenAIConfiguration initialised');
    }

    async configure() {
        if (!this.apiKey) {
            await this.configureApiKey();
        }

        if (!this.url) {
            await this.configureUrl();
        }
    }

    getStrategy(): IAIModelStrategy {
        return new OpenAIStrategy(this.context);
    }

    getCommands(): ICommand[] {
        return [
            new SetOpenAIAPIKey(this.context)
        ];
    }

    /**
     * 
     */
    async configureUrl() {
        const PROMPT: string = 'Input the LLM provider API URL';
        const SECRET: boolean = false;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API URL cannot be empty';
        const ERROR_MSG = 'No API URL provided';

        const llmApiUrl: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiUrl) {
            await this.context.globalState.update(LLM_API_URL, llmApiUrl);
            this.url = llmApiUrl;
        }
    }

    /**
     * 
     */
    async configureApiKey() {
        const PROMPT: string = 'Input the LLM provider API key';
        const SECRET: boolean = true;
        const VALIDATION: string = '';
        const VALIDATION_MSG = 'API key cannot be empty';
        const ERROR_MSG = 'No API key provided';

        const llmApiKey: string | undefined = await showInputBox(
            PROMPT, SECRET, VALIDATION, VALIDATION_MSG, ERROR_MSG
        );

        if (llmApiKey) {
            await this.context.globalState.update(LLM_API_KEY, llmApiKey);
            this.apiKey = this.context.globalState.get(LLM_API_KEY);
            this.output.warn(`API key set`);
        }
    }
}